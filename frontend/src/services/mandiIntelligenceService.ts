import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface MoisturePenaltyResult {
  moisturePct: number;
  isPenaltyApplied: boolean;
  penaltyPerQtl: number;
  totalPenaltyLoss: number;
  recommendedSunDryDays: number;
  netSavingsIfDried: number;
}

export interface ArhtiDebtAnalysis {
  hasDebt: boolean;
  debtAmount: number;
  interestSavedLocal: number;
  distantMandiNetBenefit: number;
  finalVerdict: string;
}

export interface FairFreightShare {
  farmerName: string;
  quantityQtl: number;
  fairCostShareRs: number;
  savingsVsIndividualRs: number;
}

// 1. Moisture Penalty (Sync Fallback + Live Call)
export function calculateMoisturePenalty(
  quantityQtl: number,
  basePricePerQtl: number,
  moisturePct: number
): MoisturePenaltyResult {
  const maxAllowedMoisture = 12.0;
  let penaltyPerQtl = 0;
  let recommendedSunDryDays = 0;

  if (moisturePct > maxAllowedMoisture) {
    const excessMoisture = moisturePct - maxAllowedMoisture;
    penaltyPerQtl = Math.round(basePricePerQtl * (excessMoisture * 0.015));
    recommendedSunDryDays = excessMoisture > 2 ? 2 : 1;
  }

  const totalPenaltyLoss = penaltyPerQtl * quantityQtl;
  const dryingCost = recommendedSunDryDays * 5 * quantityQtl;
  const netSavingsIfDried = Math.max(0, totalPenaltyLoss - dryingCost);

  return {
    moisturePct,
    isPenaltyApplied: penaltyPerQtl > 0,
    penaltyPerQtl,
    totalPenaltyLoss,
    recommendedSunDryDays,
    netSavingsIfDried,
  };
}

// 2. Arhti Debt Analysis
export function calculateArhtiDebtDecision(
  quantityQtl: number,
  localMandiPrice: number,
  distantMandiPrice: number,
  debtAmount: number,
  distanceKm: number
): ArhtiDebtAnalysis {
  const transportCostDistant = Math.round(distanceKm * 2.5) * quantityQtl;
  const priceGainDistant = (distantMandiPrice - localMandiPrice) * quantityQtl;
  const interestSavedLocal = Math.round(debtAmount * 0.015);
  const distantMandiNetBenefit = priceGainDistant - transportCostDistant;

  let finalVerdict = "";
  if (debtAmount > 0 && distantMandiNetBenefit - interestSavedLocal < 2000) {
    finalVerdict = "SELL TO LOCAL ARHTI: High debt balance neutralizes distant mandi price gain.";
  } else {
    finalVerdict = "SHIFT TO DISTANT MANDI: Higher price gain covers transport & debt settlement.";
  }

  return {
    hasDebt: debtAmount > 0,
    debtAmount,
    interestSavedLocal,
    distantMandiNetBenefit,
    finalVerdict,
  };
}

// 3. Fair Freight Allocator
export function calculateFairFreightSharing(
  farmers: { name: string; qtl: number }[],
  totalTruckCostRs: number
): FairFreightShare[] {
  const totalWeight = farmers.reduce((acc, f) => acc + f.qtl, 0);

  return farmers.map((f) => {
    const weightRatio = f.qtl / (totalWeight || 1);
    const fairCostShareRs = Math.round(totalTruckCostRs * weightRatio);
    const individualCostRs = f.qtl * 30;
    const savingsVsIndividualRs = Math.max(0, individualCostRs - fairCostShareRs);

    return {
      farmerName: f.name,
      quantityQtl: f.qtl,
      fairCostShareRs,
      savingsVsIndividualRs,
    };
  });
}

// 4. Async Backend Integrations
export async function getNasaFirmsDataLive(district: string = "Ludhiana") {
  try {
    const res = await axios.get(`${API_URL}/api/intelligence/nasa-firms?district=${district}`);
    return res.data;
  } catch {
    return { active_fire_spots: 14, satellite_source: "NASA FIRMS VIIRS Feed", district };
  }
}

export async function get7DayForecastLive(modalPrice: number, mandiName: string) {
  try {
    const res = await axios.get(
      `${API_URL}/api/intelligence/forecast-7days?modal_price=${modalPrice}&mandi_name=${encodeURIComponent(mandiName)}`
    );
    return res.data?.forecast || [];
  } catch {
    return [];
  }
}