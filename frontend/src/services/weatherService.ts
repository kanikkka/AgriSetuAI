import axios from "axios";

export interface WeatherRiskScore {
  location: string;
  temp: number;
  humidity: number;
  rainfallProbability: number;
  riskLevel: "Low" | "Medium" | "High";
  advice: string;
}

export async function getWeatherRiskScore(city: string = "Ludhiana"): Promise<WeatherRiskScore> {
  try {
    // OpenWeather API Integration with fallback calculation
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b6907d289e10d714a6e88b30761fae22`
    );

    const temp = response.data?.main?.temp || 30;
    const humidity = response.data?.main?.humidity || 65;
    const rainProb = response.data?.rain ? 75 : 20;

    let riskLevel: "Low" | "Medium" | "High" = "Low";
    let advice = "Optimal weather conditions for harvest storage.";

    if (humidity > 75 || rainProb > 50) {
      riskLevel = "High";
      advice = "High unseasonal rain risk! Avoid open field storage, ship to covered warehouse immediately.";
    } else if (humidity > 60) {
      riskLevel = "Medium";
      advice = "Moderate moisture. Ensure tarp covers if holding crop for >10 days.";
    }

    return {
      location: response.data?.name || city,
      temp: Math.round(temp),
      humidity,
      rainfallProbability: rainProb,
      riskLevel,
      advice,
    };
  } catch {
    // Graceful fallback for demo
    return {
      location: city,
      temp: 31,
      humidity: 58,
      rainfallProbability: 15,
      riskLevel: "Low",
      advice: "Optimal weather conditions for harvest storage.",
    };
  }
}