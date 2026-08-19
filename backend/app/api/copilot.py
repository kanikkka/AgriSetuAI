from fastapi import APIRouter
from pydantic import BaseModel
import os
import google.generativeai as genai

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    crop: str = "Wheat"
    language: str = "en"

@router.post("/chat")
async def chat_with_copilot(req: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    if not api_key:
        return {
            "status": "error",
            "reply": "API Key configure nahi hai. Kripya GEMINI_API_KEY environment variable set karein."
        }

    try:
        genai.configure(api_key=api_key)
        
        system_prompt = """
        You are AgriSetu AI, an expert agricultural economist and agronomist for Indian farmers.
        - Give direct, highly accurate, and practical farming/market advisory.
        - Answer in the user's language (Hinglish/Hindi/Punjabi/English).
        - Cover Mandi rates, FCI norms, pest control, crop management, and price forecasting.
        - Keep answers crisp, respectful, and limited to 2-4 sentences.
        """
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt
        )
        
        response = model.generate_content(
            f"Fasla: {req.crop}\nBhasha: {req.language}\nKisan ka sawal: {req.query}"
        )
        
        return {
            "status": "success",
            "mode": "live_gemini_llm",
            "reply": response.text.strip(),
            "confidence": 0.99
        }
    except Exception as e:
        return {
            "status": "error",
            "reply": f"AI Engine connect karne mein error aaya: {str(e)}"
        }