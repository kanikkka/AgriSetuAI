"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "app_title": "AgriSetu AI",
      "live_grid": "Live Grid Active",
      "spot_diesel": "Punjab Spot Diesel",
      "nav_farmer_hub": "Farmer Pre-Sale Hub",
      "nav_collective": "Collective Selling",
      "nav_mandi_rates": "Mandi Rates & Map",
      "nav_quality": "Quality & QR Pass",
      "nav_copilot": "Voice AI Copilot",
      "sell_title": "Sell Before You Travel",
      "sell_desc": "Lock in a confirmed buyer and price before leaving your farm.",
      "my_crop": "My Harvest Details",
      "crop_name": "Select Crop",
      "quantity": "Total Quantity (Quintals)",
      "moisture": "Moisture (%)",
      "ready_buyers": "Real Buyers Ready For Your Crop",
      "no_buyers": "No eligible buyer currently available.",
      "request_sale": "Request Sale",
      "price_label": "Offered Price",
      "my_bookings": "My Pre-Sale Bookings",
      "money_need": "Money Needed By (Cash Flow Planner)",
      "today": "Today",
      "return_freight": "Return Load Finder (Save on Empty Trips)",
      "no_return": "No compatible return load currently available.",
      "talk_voice": "Talk to AgriSetu (Voice Assistant)",
      "ask": "Ask"
    }
  },
  hi: {
    translation: {
      "app_title": "एग्रीसेतु AI",
      "live_grid": "लाइव ग्रिड सक्रिय",
      "spot_diesel": "पंजाब डीज़ल भाव",
      "nav_farmer_hub": "किसान प्री-सेल हब",
      "nav_collective": "सामूहिक बिक्री (FPO)",
      "nav_mandi_rates": "मंडी भाव और मैप",
      "nav_quality": "क्वालिटी और QR पास",
      "nav_copilot": "वॉइस AI को-पायलट",
      "sell_title": "घर से निकलने से पहले फसल बेचें",
      "sell_desc": "मंडी जाने से पहले पक्का खरीदार और सही दाम तय करें।",
      "my_crop": "मेरी फसल का विवरण",
      "crop_name": "फसल चुनें",
      "quantity": "कुल मात्रा (क्विंटल)",
      "moisture": "नमी (%)",
      "ready_buyers": "आपकी फसल के लिए तैयार खरीदार",
      "no_buyers": "फिलहाल कोई खरीदार उपलब्ध नहीं है।",
      "request_sale": "बिक्री अनुरोध भेजें",
      "price_label": "प्रस्तावित भाव",
      "my_bookings": "मेरी पूर्व-बिक्री बुकिंग",
      "money_need": "पैसों की ज़रूरत कब तक है?",
      "today": "आज ही",
      "return_freight": "वापसी लोड खोजें (खाली किराया बचाएं)",
      "no_return": "फिलहाल कोई वापसी लोड उपलब्ध नहीं है।",
      "talk_voice": "एग्रीसेतु से बात करें (वॉइस सहायक)",
      "ask": "पूछें"
    }
  },
  pa: {
    translation: {
      "app_title": "ਐਗਰੀਸੇਤੂ AI",
      "live_grid": "ਲਾਈਵ ਗਰਿੱਡ ਚਾਲੂ",
      "spot_diesel": "ਪੰਜਾਬ ਡੀਜ਼ਲ ਰੇਟ",
      "nav_farmer_hub": "ਕਿਸਾਨ ਪ੍ਰੀ-ਸੇਲ ਹੱਬ",
      "nav_collective": "ਸਾਂਝੀ ਵਿਕਰੀ (FPO)",
      "nav_mandi_rates": "ਮੰਡੀ ਭਾਅ ਅਤੇ ਨਕਸ਼ਾ",
      "nav_quality": "ਕੁਆਲਿਟੀ ਅਤੇ QR ਪਾਸ",
      "nav_copilot": "ਵਾਇਸ AI ਕੋ-ਪਾਇਲਟ",
      "sell_title": "ਘਰੋਂ ਨਿਕਲਣ ਤੋਂ ਪਹਿਲਾਂ ਫ਼ਸਲ ਵੇਚੋ",
      "sell_desc": "ਮੰਡੀ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਪੱਕਾ ਗਾਹਕ ਅਤੇ ਸਹੀ ਰੇਟ ਤੈਅ ਕਰੋ।",
      "my_crop": "ਮੇਰੀ ਫ਼ਸਲ ਦਾ ਵੇਰਵਾ",
      "crop_name": "ਫ਼ਸਲ ਚੁਣੋ",
      "quantity": "ਕੁੱਲ ਮਾਤਰਾ (ਕੁਇੰਟਲ)",
      "moisture": "ਨਮੀ (%)",
      "ready_buyers": "ਤੁਹਾਡੀ ਫ਼ਸਲ ਲਈ ਤਿਆਰ ਖਰੀਦਦਾਰ",
      "no_buyers": "ਕੋਈ ਖਰੀਦਦਾਰ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
      "request_sale": "ਵੇਚਣ ਦੀ ਬੇਨਤੀ ਕਰੋ",
      "price_label": "ਮਿਲਣ ਵਾਲਾ ਰੇਟ",
      "my_bookings": "ਮੇਰੀਆਂ ਪੱਕੀਆਂ ਬੁਕਿੰਗਾਂ",
      "money_need": "ਪੈਸਿਆਂ ਦੀ ਲੋੜ ਕਦੋਂ ਤੱਕ ਹੈ?",
      "today": "ਅੱਜ ਹੀ",
      "return_freight": "ਵਾਪਸੀ ਦਾ ਕਿਰਾਇਆ ਬਚਾਓ",
      "no_return": "ਕੋਈ ਵਾਪਸੀ ਲੋਡ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
      "talk_voice": "ਐਗਰੀਸੇਤੂ ਨਾਲ ਗੱਲ ਕਰੋ (ਵਾਇਸ ਸਹਾਇਕ)",
      "ask": "ਪੁੱਛੋ"
    }
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;