from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class StorageProvider(Base):
    __tablename__ = "storage_providers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    storage_name: Mapped[str] = mapped_column(String(120), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)

    supported_crop: Mapped[str] = mapped_column(String(100), nullable=False)

    total_capacity_quintal: Mapped[float] = mapped_column(Float, nullable=False)
    available_capacity_quintal: Mapped[float] = mapped_column(Float, nullable=False)

    cost_per_quintal_per_day: Mapped[float] = mapped_column(Float, nullable=False)

    status: Mapped[str] = mapped_column(
        String(30),
        default="AVAILABLE"
    )
