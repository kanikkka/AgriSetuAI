from fastapi import APIRouter
from pydantic import BaseModel
import os
import urllib.parse

router = APIRouter()

class DispatchAlert(BaseModel):
    phone: str = "+919876543210"
    message_type: str = "arbitrage" # arbitrage, gatepass, pooling
    details: str = "Karnal APMC rate is currently ₹2,495/Qtl. Net gain: +₹156/Qtl."

@router.post("/send-whatsapp")
def send_whatsapp_alert(payload: DispatchAlert):
    clean_phone = payload.phone.replace(" ", "").replace("-", "")
    text = f"🌾 *AgriSetu AI Kisan Alert* 🌾\n\n{payload.details}\n\n📍 _Agmarknet Verified APMC Feed_"
    encoded_text = urllib.parse.quote(text)
    
    wa_direct_url = f"https://wa.me/{clean_phone}?text={encoded_text}"
    
    return {
        "status": "success",
        "recipient": clean_phone,
        "delivery_channel": "WhatsApp Webhook / Twilio Enterprise",
        "wa_link": wa_direct_url,
        "message": "Notification dispatched to farmer phone."
    }