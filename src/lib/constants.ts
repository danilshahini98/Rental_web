export const ALBANIAN_CITIES = [
  "Tirana",
  "Durrës",
  "Vlorë",
  "Sarandë",
  "Shkodër",
  "Elbasan",
  "Fier",
  "Korçë",
  "Berat",
  "Gjirokastër",
  "Pogradec",
  "Kukës",
  "Lezhë",
  "Lushnjë",
  "Kavajë",
] as const;

export const TRANSMISSIONS = ["manual", "automatic"] as const;
export const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"] as const;

export const FUEL_TYPE_LABELS: Record<(typeof FUEL_TYPES)[number], string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
};

export const TRANSMISSION_LABELS: Record<(typeof TRANSMISSIONS)[number], string> = {
  manual: "Manual",
  automatic: "Automatic",
};

// Default map view: centered on Albania.
export const ALBANIA_MAP_CENTER: [number, number] = [41.1533, 20.1683];
export const ALBANIA_MAP_ZOOM = 7.4;
