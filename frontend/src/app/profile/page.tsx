"use client";

import React, { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: "Sardar Harpreet Singh",
    phone: "+91 98765 43210",
    district: "Ludhiana",
    state: "Punjab",
    land_acres: 18.5,
    crops: "Wheat (Sharbati), Basmati Paddy 1121",
    primary_mandi: "Khanna APMC Yard",
    apmc_license: "PB-LDH-2024-8891"
  });
  const [editing, setEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      const res = await fetch(`${apiUrl}/api/profile/`);
      const json = await res.json();
      if (json.status === "success") setProfile(json.profile);
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agrisetuai.onrender.com";
      await fetch(`${apiUrl}/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setSavedMsg("Profile synchronized to cloud registry!");
    } catch {
      setSavedMsg("Updated locally in session.");
    }
    setEditing(false);
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Kisan Profile & Farm Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Verified land records, linked APMC mandis, and dynamic dispatch preferences.</p>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs"
        >
          {editing ? "Cancel Editing" : "✏️ Edit Profile"}
        </button>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <span>✅</span> {savedMsg}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="kisan-card p-6 md:p-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Update Farmer Registry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-400">Registered Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Mobile Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Operational Land Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={profile.land_acres}
                onChange={(e) => setProfile({ ...profile, land_acres: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Primary Linked APMC</label>
              <input
                type="text"
                value={profile.primary_mandi}
                onChange={(e) => setProfile({ ...profile, primary_mandi: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 mt-3">
            Save & Sync Registry
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="kisan-card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Farmer Identity</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs block">Registered Name</span>
                <span className="text-slate-900 font-bold">{profile.name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Mobile Number</span>
                <span className="text-slate-800 font-semibold">{profile.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Location</span>
                <span className="text-slate-800 font-semibold">{profile.district}, {profile.state}</span>
              </div>
            </div>
          </div>

          <div className="kisan-card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Land & APMC Registry</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs block">Land Holdings</span>
                <span className="text-slate-900 font-bold">{profile.land_acres} Acres</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Assigned APMC Yard</span>
                <span className="text-slate-800 font-semibold">{profile.primary_mandi}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">APMC Digital Trade ID</span>
                <span className="text-slate-800 font-mono text-xs font-bold">{profile.apmc_license}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}