from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class MSPPrice(Base):
    __tablename__ = "msp_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    crop_name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    season: Mapped[str] = mapped_column(String(50), nullable=False)
    marketing_year: Mapped[str] = mapped_column(String(20), nullable=False)
    msp_per_quintal: Mapped[float] = mapped_column(Float, nullable=False)
