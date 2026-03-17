from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, JSON, String, Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_state = Column(String(20), default="energized", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    weather_records = relationship("WeatherRecord", back_populates="user", lazy="dynamic")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    @property
    def age_range(self):
        if self.profile is None:
            return None
        return self.profile.age_range

    @property
    def mobility_issue(self):
        if self.profile is None:
            return None
        return self.profile.mobility_issue

    @property
    def vision_issue(self):
        if self.profile is None:
            return None
        return self.profile.vision_issue

    @property
    def preferred_transport(self):
        if self.profile is None:
            return None
        return self.profile.preferred_transport

    @property
    def housing_type(self):
        if self.profile is None:
            return None
        return self.profile.housing_type

    @property
    def housing_floor(self):
        if self.profile is None:
            return None
        return self.profile.housing_floor


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False)
    age_range = Column(String(20), nullable=False)
    mobility_issue = Column(Boolean, default=False, nullable=True)
    vision_issue = Column(Boolean, default=False, nullable=True)
    preferred_transport = Column(String(50), nullable=True)
    housing_type = Column(String(20), nullable=True)
    housing_floor = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    weather_data = Column(JSON, nullable=False)
    llm_response = Column(Text, nullable=True)
    avatar_state = Column(String(20), nullable=True)
    is_disaster = Column(Boolean, default=False)
    # Extracted scalar fields for fast charting
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="weather_records")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="info")  # info | warning | critical
    is_active = Column(Boolean, default=True)
    created_by = Column(String(50), default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)


class EmergencyBroadcast(Base):
    __tablename__ = "emergency_broadcasts"

    id = Column(Integer, primary_key=True, index=True)
    weather_data = Column(JSON, nullable=True)
    llm_message = Column(Text, nullable=True)
    # Structured alert fields (new)
    cause = Column(String(50), nullable=True)
    severity = Column(String(20), nullable=True)
    alert_title = Column(String(200), nullable=True)
    alert_color = Column(String(20), nullable=True)
    actions = Column(JSON, nullable=True)
    triggered_by = Column(String(50), default="admin")
    recipients_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
