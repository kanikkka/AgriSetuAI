from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Crop(Base):
    __tablename__ = "crops"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    farm_id: Mapped[int] = mapped_column(
        ForeignKey("farms.id"),
        nullable=False
    )

    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)

    quantity_quintal: Mapped[float] = mapped_column(Float, nullable=False)

    expected_harvest_date: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    crop_status: Mapped[str] = mapped_column(
        String(50),
        default="Growing"
    )

    storage_available: Mapped[str] = mapped_column(
        String(10),
        default="No"
    )
