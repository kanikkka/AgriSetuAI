from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class BuyerDemandIntent(Base):
    __tablename__ = "buyer_demand_intents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    buyer_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_quintal: Mapped[float] = mapped_column(Float, nullable=False)

    required_from_date: Mapped[str] = mapped_column(String(20), nullable=False)
    required_to_date: Mapped[str] = mapped_column(String(20), nullable=False)

    district: Mapped[str] = mapped_column(String(100), nullable=True)
    quality_grade: Mapped[str] = mapped_column(String(50), nullable=True)

    max_price_per_quintal: Mapped[float] = mapped_column(Float, nullable=True)

    status: Mapped[str] = mapped_column(
        String(30),
        default="OPEN"
    )
