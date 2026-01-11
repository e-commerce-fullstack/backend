import hashlib
from bakong_khqr import KHQR

class BakongService:
    @staticmethod
    def generate_khqr_string(merchant_id: str, amount: float, order_id: str):
        try:
            khqr = KHQR()
            
            # The library requires exactly 9 arguments (excluding self) in this order:
            # 1. bank_account (merchant_id)
            # 2. merchant_name
            # 3. merchant_city
            # 4. amount
            # 5. currency
            # 6. store_label
            # 7. phone_number
            # 8. bill_number
            # 9. terminal_label
            
            qr_data = khqr.create_qr(
                merchant_id,         # 1. bank_account
                "E-Store",           # 2. merchant_name
                "Phnom Penh",        # 3. merchant_city
                float(amount),       # 4. amount
                "USD",               # 5. currency
                "E-Store-Main",      # 6. store_label
                "855962469031",      # 7. phone_number
                str(order_id),       # 8. bill_number
                "Cashier-01"         # 9. terminal_label
            )

            md5_hash = hashlib.md5(qr_data.encode()).hexdigest().lower()

            return {
                "qrString": qr_data,
                "md5": md5_hash
            }
        except Exception as e:
            print(f"❌ KHQR Generation Error: {str(e)}")
            raise e