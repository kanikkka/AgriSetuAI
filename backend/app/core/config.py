from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "KisanLogic.AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    NASA_FIRMS_MAP_KEY: str = ""
    OGD_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()
