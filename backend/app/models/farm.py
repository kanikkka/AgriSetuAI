from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    farmer_id: Mapped[int] = mapped_column(
        ForeignKey("farmer_profiles.id"),
        nullable=False
    )

    farm_name: Mapped[str] = mapped_column(String(100), nullable=False)
    village: Mapped[str] = mapped_column(String(100), nullable=True)
    district: Mapped[str] = mapped_column(String(100), nullable=True)

    land_area_acres: Mapped[float] = mapped_column(Float, nullable=False)

    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)

    soil_type: Mapped[str] = mapped_column(String(50), nullable=True)
