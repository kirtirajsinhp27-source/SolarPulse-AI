import json
from typing import List, Union

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "SolarPulse AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/dbname"

    # CORS Origins
    ALLOWED_ORIGINS: Union[str, List[str]] = ["http://localhost:3000"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            if isinstance(v, str):
                v = json.loads(v)
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
    case_sensitive=True,
    env_file=".env",
    env_file_encoding="utf-8"
)


settings = Settings()