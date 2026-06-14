export interface PricingConfig {
  regularTable: [number, number, number][];
  deepTable: [number, number, number][];
  vacateTable: [number, number, number][];
  regularHourly: { once: number; weekly: number; fortnightly: number; monthly: number };
  deepHourly: number;
  vacateHourly: number;
  defaultHourly: number;
  addons: { id: string; label: string; price: number; unit: string; status: 'active' | 'inactive' }[];
}

export const DEFAULT_PRICING: PricingConfig = {
  regularTable: [
    [1,1,120],[2,1,155],[2,2,199],[3,1,199],[3,2,235],[4,2,269],[5,3,339],
  ],
  deepTable: [
    [1,1,350],[2,1,440],[2,2,540],[3,1,500],[3,2,600],[4,2,660],[5,2,720],
  ],
  vacateTable: [
    [1,1,387],[2,1,459],[2,2,594],[3,1,531],[3,2,639],[4,2,711],[5,2,870],
  ],
  regularHourly: { once: 48, weekly: 45, fortnightly: 45, monthly: 48 },
  deepHourly: 55,
  vacateHourly: 65,
  defaultHourly: 48,
  addons: [
    { id: 'fridge',  label: 'Inside Fridge',             price: 59,  unit: '',      status: 'active' },
    { id: 'windows', label: 'Exterior Windows',           price: 80,  unit: '',      status: 'active' },
    { id: 'carpet',  label: 'Carpet Steam Clean',         price: 35,  unit: '/room', status: 'active' },
    { id: 'balcony', label: 'Balcony Cleaning',           price: 35,  unit: '',      status: 'active' },
    { id: 'walls',   label: 'Wall Deep Cleaning',         price: 180, unit: '',      status: 'active' },
    { id: 'garage',  label: 'Garage Sweep',               price: 29,  unit: '',      status: 'active' },
    { id: 'patio',   label: 'Patio / Alfresco',           price: 29,  unit: '',      status: 'active' },
    { id: 'tiles',   label: 'Professional Tile Cleaning', price: 150, unit: '',      status: 'active' },
    { id: 'blinds',  label: 'Blinds Wet Wipe',            price: 120, unit: '',      status: 'active' },
  ],
};
