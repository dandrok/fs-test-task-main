export const ENERGY_CLASSES = ['A', 'B', 'C'] as const;
export const CAPACITIES = [8, 9, 10.5] as const;
export const FEATURES = [
  'Drzwi AddWash™',
  'Panel AI Control',
  'Silnik inwerterowy',
  'Wyświetlacz elektroniczny',
] as const;
export const SORT_OPTIONS = ['price', 'capacity'] as const;

export type EnergyClass = (typeof ENERGY_CLASSES)[number];
export type Capacity = (typeof CAPACITIES)[number];
export type Features = (typeof FEATURES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface IPrice {
  value: number;
  currency: string;
  installment: {
    value: number;
    period: number;
  };
  validFrom: Date;
  validTo: Date;
}

export interface IProduct {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: Capacity;
  dimensions: string;
  features: Features[];
  energyClass: EnergyClass;
  price: IPrice;
}
