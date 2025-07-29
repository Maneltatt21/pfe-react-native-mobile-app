// models/driver.model.ts

import { Vehicle } from "./car.model";

export interface Driver {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: "admin" | "chauffeur";
  vehicle_id: number | null;
  created_at: string;
  updated_at: string;
  vehicle: Vehicle | null;
}

export interface DriversResponse {
  current_page: number;
  data: Driver[];
  total: number;
}
