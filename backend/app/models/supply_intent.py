from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class SupplyIntent(Base):
    __tablename__ = "supply_intents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    farmer_id: Mapped[int] = mapped_column(
        ForeignKey("farmer_profiles.id"),
        nullable=False
    )

    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_quintal: Mapped[float] = mapped_column(Float, nullable=False)
    available_date: Mapped[str] = mapped_column(String(20), nullable=False)

    village: Mapped[str] = mapped_column(String(100), nullable=True)
    district: Mapped[str] = mapped_column(String(100), nullable=True)

    quality_grade: Mapped[str] = mapped_column(String(50), nullable=True)

    status: Mapped[str] = mapped_column(
        String(30),
        default="OPEN"
    )
