from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    MONGO_URL: str
    BAKONG_MERCHANT_ID: str
    BAKONG_SECRET_KEY: SecretStr
    ORDER_SERVICE_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()