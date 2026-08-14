from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)

    recommendation: Mapped[str] = mapped_column(String(50), nullable=False)

    predicted_price: Mapped[float] = mapped_column(Float, nullable=True)

    actual_action: Mapped[str] = mapped_column(String(50), nullable=True)

    actual_price: Mapped[float] = mapped_column(Float, nullable=True)

    result_status: Mapped[str] = mapped_column(
        String(50),
        default="PENDING"
    )
