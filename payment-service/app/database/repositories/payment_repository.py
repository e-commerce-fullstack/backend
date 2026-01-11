from app.database.models.payment_model import Payment, PaymentStatus

class PaymentRepository:
    @staticmethod
    async def create(order_id: str, amount: float, md5: str):
        payment = Payment(order_id=order_id, amount=amount, md5=md5)
        return await payment.insert()

    @staticmethod
    async def find_by_md5(md5: str):
        return await Payment.find_one(Payment.md5 == md5)

    @staticmethod
    async def update_status(md5: str, status: PaymentStatus, transaction_id: str = None):
        payment = await Payment.find_one(Payment.md5 == md5)
        if payment:
            payment.status = status
            if transaction_id:
                payment.transaction_id = transaction_id
            await payment.save()
        return payment