from beanie import Document
from pydantic import Field
from datetime import datetime
from enum import Enum
from typing import Optional

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"

class Payment(Document):
    order_id: str
    amount: float
    md5: str
    status: PaymentStatus = PaymentStatus.PENDING
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "payments"