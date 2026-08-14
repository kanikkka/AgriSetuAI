from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    village: Mapped[str] = mapped_column(String(100), nullable=True)
    district: Mapped[str] = mapped_column(String(100), nullable=True)
    state: Mapped[str] = mapped_column(String(100), default="Punjab")
    language: Mapped[str] = mapped_column(String(30), default="Punjabi")

    total_land_acres: Mapped[float] = mapped_column(Float, nullable=True)
