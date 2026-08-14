from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    mandi_name: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)

    min_price: Mapped[float] = mapped_column(Float, nullable=False)
    max_price: Mapped[float] = mapped_column(Float, nullable=False)
    modal_price: Mapped[float] = mapped_column(Float, nullable=False)

    price_date: Mapped[str] = mapped_column(String(20), nullable=False)
