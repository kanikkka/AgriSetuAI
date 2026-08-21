from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    buyer_type = Column(String, nullable=False)  # Mill, Corporate, Aggregator, Retailer
    location_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    required_crop = Column(String, nullable=False)
    required_variety = Column(String, nullable=True)
    min_quantity_qtl = Column(Float, default=0.0)
    max_quantity_qtl = Column(Float, nullable=True)
    max_moisture_pct = Column(Float, default=14.0)
    offered_price_per_qtl = Column(Float, nullable=False)
    delivery_window_start = Column(DateTime, nullable=True)
    delivery_window_end = Column(DateTime, nullable=True)
    verification_status = Column(String, default="Unverified") # Verified, Pending, Unverified
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("SaleBooking", back_populates="buyer")

class SaleBooking(Base):
    __tablename__ = "sale_bookings"

    id = Column(String, primary_key=True)
    farmer_id = Column(String, nullable=False)
    farmer_name = Column(String, nullable=False)
    farmer_phone = Column(String, nullable=False)
    buyer_id = Column(String, ForeignKey("buyer_profiles.id"), nullable=False)
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=True)
    quantity_qtl = Column(Float, nullable=False)
    agreed_price_per_qtl = Column(Float, nullable=False)
    delivery_location = Column(String, nullable=False)
    delivery_scheduled_at = Column(DateTime, nullable=True)
    status = Column(String, default="Requested") 
    # Requested, Counter Offer, Accepted, Rejected, Cancelled, Delivery Scheduled, Delivered, Payment Pending, Completed
    counter_price_per_qtl = Column(Float, nullable=True)
    payment_status = Column(String, default="Pending") # Pending, Processing, Completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    buyer = relationship("BuyerProfile", back_populates="bookings")

class ReturnFreightLoad(Base):
    __tablename__ = "return_freight_loads"

    id = Column(String, primary_key=True)
    transporter_name = Column(String, nullable=False)
    transporter_phone = Column(String, nullable=False)
    vehicle_type = Column(String, nullable=False)
    vehicle_number = Column(String, nullable=False)
    capacity_qtl = Column(Float, nullable=False)
    available_capacity_qtl = Column(Float, nullable=False)
    origin_city = Column(String, nullable=False)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    destination_city = Column(String, nullable=False)
    destination_lat = Column(Float, nullable=False)
    destination_lng = Column(Float, nullable=False)
    return_cargo_type = Column(String, nullable=False) # e.g. Fertilizer, Empty Return, Feed
    available_date = Column(DateTime, nullable=False)
    status = Column(String, default="Available") # Available, Booked, In Transit

class FarmerNotification(Base):
    __tablename__ = "farmer_notifications"

    id = Column(String, primary_key=True)
    farmer_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)