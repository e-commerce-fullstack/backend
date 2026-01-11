import httpx
from fastapi import HTTPException
from app.services.payment_service import BakongService
from app.database.repositories.payment_repository import PaymentRepository
from app.database.models.payment_model import PaymentStatus
from app.config import settings

async def generate_payment_qr(order_id: str, amount: float):
    try:
        # 1. Generate QR Data
        khqr_data = BakongService.generate_khqr_string(
            settings.BAKONG_MERCHANT_ID, amount, order_id
        )

        # 2. Save to Mongo
        await PaymentRepository.create(order_id, amount, khqr_data['md5'])

        return {"success": True, "data": khqr_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def check_bakong_api(md5: str):
    try:
        payment = await PaymentRepository.find_by_md5(md5)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        if payment.status == PaymentStatus.PAID:
            return {"success": True, "status": "PAID"}

        # Official Bakong API Endpoint
        url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5"
        headers = {
            "Authorization": f"Bearer {settings.BAKONG_SECRET_KEY.get_secret_value()}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={"md5": md5}, headers=headers)
            result = response.json()

        # responseCode 0 = Success (Paid)
        if result.get("responseCode") == 0:
            bank_data = result.get("data")
            await PaymentRepository.update_status(
                md5, PaymentStatus.PAID, bank_data.get("hash")
            )
            return {"success": True, "status": "PAID", "data": bank_data}

        return {"success": False, "status": "PENDING", "message": result.get("responseMessage")}
    except Exception as e:
        return {"success": False, "status": "ERROR", "detail": str(e)}