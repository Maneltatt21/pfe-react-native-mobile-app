// models/exchange.model.ts

export interface Driver {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  vehicle_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  year: number;
  status: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exchange {
  id: number;
  from_driver_id: number;
  to_driver_id: number;
  vehicle_id: number;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  before_photo_path: string | null;
  after_photo_path: string | null;
  note: string;
  created_at: string;
  updated_at: string;
  from_driver: Driver;
  to_driver: Driver;
  vehicle: Vehicle;
}

export interface ExchangesResponse {
  current_page: number;
  data: Exchange[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
