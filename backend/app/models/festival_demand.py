from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class FestivalDemand(Base):
    __tablename__ = "festival_demands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    festival_name: Mapped[str] = mapped_column(String(100), nullable=False)

    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)

    festival_date: Mapped[str] = mapped_column(String(20), nullable=False)

    expected_demand_change_percent: Mapped[float] = mapped_column(
        Float,
        default=0
    )
