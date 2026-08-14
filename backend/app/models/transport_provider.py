from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class TransportProvider(Base):
    __tablename__ = "transport_providers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    provider_name: Mapped[str] = mapped_column(String(120), nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(80), nullable=False)

    capacity_quintal: Mapped[float] = mapped_column(Float, nullable=False)

    district: Mapped[str] = mapped_column(String(100), nullable=False)

    cost_per_km: Mapped[float] = mapped_column(Float, nullable=False)

    status: Mapped[str] = mapped_column(
        String(30),
        default="AVAILABLE"
    )
