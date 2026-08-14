import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export async function getSmartDecision(params: {
  day: number;
  month: number;
  previous_price: number;
  current_price: number;
  msp: number;
  storage_cost_per_quintal?: number;
  storage_days?: number;
}) {
  const response = await API.get("/smart-decision", {
    params,
  });

  return response.data;
}
