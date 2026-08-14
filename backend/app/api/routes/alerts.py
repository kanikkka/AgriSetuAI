from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertResponse
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/alerts",
    tags=["Smart Alerts"]
)


@router.post("", response_model=AlertResponse)
def create_alert(
    data: AlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = Alert(
        user_id=current_user.id,
        alert_type=data.alert_type,
        title=data.title,
        message=data.message,
        is_read=False
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


@router.get("", response_model=list[AlertResponse])
def get_my_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Alert).filter(
        Alert.user_id == current_user.id
    ).order_by(
        Alert.id.desc()
    ).all()


@router.put("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.is_read = True

    db.commit()
    db.refresh(alert)

    return alert
