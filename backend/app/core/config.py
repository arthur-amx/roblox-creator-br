from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_name: str = "Roblox Creator BR"
    environment: str = "development"
    secret_key: str = "change-me-in-production"

    # Database
    database_url: str = "postgresql://roblox_user:roblox_pass@localhost:5432/roblox_creator"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # OpenAI
    openai_api_key: str = ""

    # Roblox Open Cloud
    roblox_api_key: str = ""
    roblox_creator_id: str = ""

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # Mercado Pago
    mercado_pago_access_token: str = ""


settings = Settings()
