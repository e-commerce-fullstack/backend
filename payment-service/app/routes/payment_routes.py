from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers import payment_controller

router = APIRouter()


class QRRequest(BaseModel):
    order_id: str  # Change this from orderId to order_id
    amount: float

@router.post("/generate")
async def create_qr(req: QRRequest):
    # Ensure you pass req.order_id here too
    return await payment_controller.generate_payment_qr(req.order_id, req.amount)

@router.get("/status/{md5}")
async def get_status(md5: str):
    return await payment_controller.check_bakong_api(md5)