from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, Field

class Settings(BaseSettings):
    # Required variables
    MONGO_URL: str
    BAKONG_MERCHANT_ID: str
    BAKONG_SECRET_KEY: SecretStr
    ORDER_SERVICE_URL: str

    # Define 'port' so Pydantic expects it. 
    # validation_alias='PORT' allows it to read 'PORT' from Render 
    # while you use 'settings.port' in your code.
    port: int = Field(default=4004, validation_alias="PORT")

    # model_config allows the app to ignore other system variables (like USER, PATH, etc.)
    # that would otherwise cause the 'extra_forbidden' crash.
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"  # This is the key fix to prevent the crash
    )

settings = Settings()