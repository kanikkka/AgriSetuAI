"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "pa";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    pa: string;
  };
}

export const translations: Translations = {
  // App Titles & Navigation
  app_name: { en: "AgriSetu AI", hi: "एग्रीसेतु AI", pa: "ਐਗਰੀਸੇਤੂ AI" },
  nav_farmer_hub: { en: "Farmer Pre-Sale Hub", hi: "किसान प्री-सेल हब", pa: "ਕਿਸਾਨ ਪ੍ਰੀ-ਸੇਲ ਹੱਬ" },
  nav_collective: { en: "Collective Selling", hi: "सामूहिक बिक्री (FPO)", pa: "ਸਾਂਝੀ ਵਿਕਰੀ (FPO)" },
  nav_mandi_rates: { en: "Mandi Rates & Map", hi: "मंडी भाव और मैप", pa: "ਮੰਡੀ ਭਾਅ ਅਤੇ ਨਕਸ਼ਾ" },
  nav_quality: { en: "Quality & QR Pass", hi: "क्वालिटी और QR पास", pa: "ਕੁਆਲਿਟੀ ਅਤੇ QR ਪਾਸ" },
  nav_copilot: { en: "Voice AI Copilot", hi: "वॉइस AI को-पायलट", pa: "ਵਾਇਸ AI ਕੋ-ਪਾਇਲਟ" },
  
  // Top Status Bar
  spot_diesel: { en: "Punjab Spot Diesel", hi: "पंजाब डीज़ल रेट", pa: "ਪੰਜਾਬ ਡੀਜ਼ਲ ਰੇਟ" },
  live_status: { en: "Live Grid Active", hi: "लाइव ग्रिड सक्रिय", pa: "ਲਾਈਵ ਗਰਿੱਡ ਚਾਲੂ" },
  
  // Farmer Pre-Sale Hub
  sell_before_travel: { en: "Sell Before You Travel", hi: "घर से निकलने से पहले फसल बेचें", pa: "ਘਰੋਂ ਨਿਕਲਣ ਤੋਂ ਪਹਿਲਾਂ ਫ਼ਸਲ ਵੇਚੋ" },
  sell_subtext: { en: "Lock in a confirmed buyer & price before you leave your farm.", hi: "मंडी जाने से पहले पक्का खरीदार और सही दाम तय करें।", pa: "ਮੰਡੀ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਪੱਕਾ ਖਰੀਦਦਾਰ ਅਤੇ ਸਹੀ ਰੇਟ ਤੈਅ ਕਰੋ।" },
  my_harvest: { en: "My Harvest Details", hi: "मेरी फसल का विवरण", pa: "ਮੇਰੀ ਫ਼ਸਲ ਦਾ ਵੇਰਵਾ" },
  select_crop: { en: "Select Crop", hi: "फसल चुनें", pa: "ਫ਼ਸਲ ਚੁਣੋ" },
  quantity_qtl: { en: "Quantity (Quintals)", hi: "कुल मात्रा (क्विंटल)", pa: "ਕੁੱਲ ਮਾਤਰਾ (ਕੁਇੰਟਲ)" },
  moisture_pct: { en: "Moisture (%)", hi: "नमी (%)", pa: "ਨਮੀ (%)" },
  real_buyers: { en: "Real Buyers Ready For Your Crop", hi: "आपकी फसल के लिए तैयार खरीदार", pa: "ਤੁਹਾਡੀ ਫ਼ਸਲ ਲਈ ਤਿਆਰ ਖਰੀਦਦਾਰ" },
  no_buyers: { en: "No eligible buyer currently available.", hi: "फिलहाल कोई पात्र खरीदार उपलब्ध नहीं है।", pa: "ਫਿਲਹਾਲ ਕੋਈ ਯੋਗ ਖਰੀਦਦਾਰ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।" },
  request_sale: { en: "Request Sale", hi: "बिक्री का अनुरोध करें", pa: "ਵੇਚਣ ਦੀ ਬੇਨਤੀ ਕਰੋ" },
  offered_price: { en: "Offered Price", hi: "प्रस्तावित भाव", pa: "ਮਿਲਣ ਵਾਲਾ ਰੇਟ" },
  distance_away: { en: "away", hi: "दूर", pa: "ਦੂਰ" },
  
  // Bookings
  my_bookings: { en: "My Pre-Sale Bookings", hi: "मेरी पूर्व-बिक्री बुकिंग", pa: "ਮੇਰੀਆਂ ਪੱਕੀਆਂ ਬੁਕਿੰਗਾਂ" },
  gross_value: { en: "Gross Value", hi: "कुल मूल्य", pa: "ਕੁੱਲ ਰਕਮ" },
  
  // Cash Need Mode
  money_needed_by: { en: "Money Needed By (Cash Flow)", hi: "पैसों की ज़रूरत कब तक है?", pa: "ਪੈਸਿਆਂ ਦੀ ਲੋੜ ਕਦੋਂ ਤੱਕ ਹੈ?" },
  today: { en: "Today", hi: "आज ही", pa: "ਅੱਜ ਹੀ" },
  days_3: { en: "3 Days", hi: "3 दिन", pa: "3 ਦਿਨ" },
  days_7: { en: "7 Days", hi: "7 दिन", pa: "7 ਦਿਨ" },
  days_15: { en: "15 Days", hi: "15 दिन", pa: "15 ਦਿਨ" },
  days_30: { en: "30 Days", hi: "30 दिन", pa: "30 ਦਿਨ" },
  recommended: { en: "RECOMMENDED", hi: "सुझाव", pa: "ਸੁਝਾਅ" },
  
  // Return Freight
  return_freight: { en: "Return Load Finder (Save on Empty Trips)", hi: "वापसी लोड खोजें (खाली ट्रिप बचाएं)", pa: "ਵਾਪਸੀ ਦਾ ਕਿਰਾਇਆ ਬਚਾਓ" },
  no_return_load: { en: "No compatible return load currently available.", hi: "फिलहाल कोई वापसी लोड उपलब्ध नहीं है।", pa: "ਕੋਈ ਵਾਪਸੀ ਲੋਡ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।" },
  save_freight: { en: "Save Freight", hi: "किराया बचत", pa: "ਕਿਰਾਇਆ ਬੱਚਤ" },
  
  // Voice Assistant
  talk_to_agrisetu: { en: "Talk to AgriSetu (Voice Assistant)", hi: "एग्रीसेतु से बात करें (वॉइस सहायक)", pa: "ਐਗਰੀਸੇਤੂ ਨਾਲ ਗੱਲ ਕਰੋ (ਵਾਇਸ ਸਹਾਇਕ)" },
  ask_button: { en: "Ask", hi: "पूछें", pa: "ਪੁੱਛੋ" },
  voice_placeholder: { en: "Ask: 'Who is the best buyer for my crop today?'", hi: "पूछें: 'आज मेरी फसल का सबसे अच्छा खरीदार कौन है?'", pa: "ਪੁੱਛੋ: 'ਅੱਜ ਮੇਰੀ ਫ਼ਸਲ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਗਾਹਕ ਕੌਣ ਹੈ?'" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("agrisetu_lang") as Language;
    if (saved && (saved === "en" || saved === "hi" || saved === "pa")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("agrisetu_lang", lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["en"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);