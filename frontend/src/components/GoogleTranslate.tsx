"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,pa",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden default widget container */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Styled Farmer-Friendly Toggle Buttons */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => changeLanguage("en")}
          className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition"
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("hi")}
          className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition"
        >
          हिंदी
        </button>
        <button
          onClick={() => changeLanguage("pa")}
          className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition"
        >
          ਪੰਜਾਬੀ
        </button>
      </div>
    </div>
  );
}