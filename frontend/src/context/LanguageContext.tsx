"use client";

import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "hi" | "pa";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  appName: { en: "AgriSetu AI", hi: "एग्रीसेतु AI", pa: "ਐਗਰੀਸੇਤੂ AI" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", pa: "ਡੈਸ਼ਬੋਰਡ" },
  market: { en: "7-Day Market AI", hi: "7-दिवसीय बाज़ार AI", pa: "7-ਦਿਨਾਂ ਮੰਡੀ AI" },
  simulator: { en: "Profit Simulator", hi: "मुनाफा सिमुलेटर", pa: "ਮੁਨਾਫਾ ਸਿਮੂਲੇਟਰ" },
  coalitions: { en: "Farmer Coalitions", hi: "किसान समूह", pa: "ਕਿਸਾਨ ਸਮੂਹ" },

  // Spatial Arbitrage
  spatialArbitrageBadge: { en: "Spatial Arbitrage Optimization", hi: "अंतर-मंडी मूल्य अंतर एवं मुनाफा", pa: "ਅੰਤਰ-ਮੰਡੀ ਮੁੱਲ ਅੰਤਰ ਅਤੇ ਮੁਨਾਫਾ" },
  spatialArbitrageTitle: { en: "Inter-Mandi Spatial Arbitrage Optimizer", hi: "अंतर-मंडी लॉजिस्टिक्स एवं मुनाफा अनुकूलक", pa: "ਅੰਤਰ-ਮੰਡੀ ਲੌਜਿਸਟਿਕਸ ਅਤੇ ਮੁਨਾਫਾ ਅਨੁਕੂਲਕ" },
  spatialArbitrageSubtitle: { en: "Net profit after deducting round-trip diesel & freight costs across Punjab APMCs.", hi: "पंजाब की मंडियों में डीजल और मालभाड़ा काटकर शुद्ध अतिरिक्त मुनाफा।", pa: "ਪੰਜਾਬ ਦੀਆਂ ਮੰਡੀਆਂ ਵਿੱਚ ਡੀਜ਼ਲ ਅਤੇ ਮਾਲ-ਭਾੜਾ ਕੱਟ ਕੇ ਸ਼ੁੱਧ ਵਾਧੂ ਮੁਨਾਫਾ।" },

  // Circular Economy
  stubbleEconomyTitle: { en: "Stubble-to-Biofuel Circular Economy Calculator", hi: "पराली से बायो-ईंधन चक्रीय अर्थव्यवस्था कैलकुलेटर", pa: "ਪਰਾਲੀ ਤੋਂ ਬਾਇਓ-ਫਿਊਲ ਸਰਕੂਲਰ ਇਕਾਨਮੀ ਕੈਲਕੁਲੇਟਰ" },
  stubbleEconomySubtitle: { en: "Turn stubble into guaranteed cash revenue instead of burning penalties.", hi: "जुर्माने और प्रदूषण के बजाय पराली को सीधी नकद आमदनी में बदलें।", pa: "ਜੁਰਮਾਨੇ ਦੀ ਬਜਾਏ ਪਰਾਲੀ ਨੂੰ ਸਿੱਧੀ ਨਕਦ ਕਮਾਈ ਵਿੱਚ ਬਦਲੋ।" },
  landAcres: { en: "Land Size (Acres)", hi: "जमीन का आकार (एकड़)", pa: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)" },
  netStrawProfit: { en: "Net In-Hand Biomass Revenue", hi: "शुद्ध इन-हैंड पराली मुनाफा", pa: "ਕੁੱਲ ਹੱਥ ਵਿੱਚ ਪਰਾਲੀ ਮੁਨਾਫਾ" },
  avoidedCo2: { en: "CO2 Emissions Prevented", hi: "रोका गया कार्बन उत्सर्जन", pa: "ਰੋਕਿਆ ਗਿਆ ਕਾਰਬਨ ਪ੍ਰਦੂਸ਼ਣ" },

  // Grain Inspector
  grainInspectorTitle: { en: "AI Grain Quality & FCI Grading Shield", hi: "एआई अनाज गुणवत्ता और एफसीआई ग्रेडिंग प्रमाणक", pa: "AI ਅਨਾਜ ਗੁਣਵੱਤਾ ਅਤੇ FCI ਗਰੇਡਿੰਗ ਪ੍ਰਮਾਣਕ" },
  grainInspectorSubtitle: { en: "Scientific image & sample inspection to stop arbitrary dockage deductions by local middle-men.", hi: "आढ़तियों द्वारा मनमानी कटौती रोकने के लिए वैज्ञानिक नमूना परीक्षण।", pa: "ਆੜ੍ਹਤੀਆਂ ਵੱਲੋਂ ਮਨਮਾਨੀ ਕਟੌਤੀ ਰੋਕਣ ਲਈ ਵਿਗਿਆਨਕ ਨਮੂਨਾ ਟੈਸਟ।" },

  // Biological Decay
  decayTitle: { en: "Biological Grain Respiration & Spoilage Decay Curve", hi: "जैविक अनाज श्वसन और गुणवत्ता क्षय वक्र", pa: "ਜੈਵਿਕ ਅਨਾਜ ਸਾਹ-ਦਰ ਅਤੇ ਗੁਣਵੱਤਾ ਗਿਰਾਵਟ ਵਕਰ" },
  decaySubtitle: { en: "Thermodynamic moisture-heat decay projection over a 14-day storage holding window.", hi: "तापमान और नमी के आधार पर 14-दिवसीय जैविक भंडारण सुरक्षा विश्लेषण।", pa: "ਤਾਪਮਾਨ ਅਤੇ ਨਮੀ ਦੇ ਅਧਾਰ 'ਤੇ 14-ਦਿਨਾਂ ਜੈਵਿਕ ਸਟੋਰੇਜ ਸੁਰੱਖਿਆ ਵਿਸ਼ਲੇਸ਼ਣ।" },
  criticalCliff: { en: "Critical Spoilage Cliff Date", hi: "महत्वपूर्ण गुणवत्ता गिरावट सीमा", pa: "ਗੰਭੀਰ ਗੁਣਵੱਤਾ ਗਿਰਾਵਟ ਸੀਮਾ" }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);