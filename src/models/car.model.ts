export interface VehicleDocument {
  id: number;
  vehicle_id: number;
  type: "assurance" | "carte_grise" | "controle_technique";
  expiration_date: string; // ISO-8601
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

// models/create-car.model.ts
export interface CreateCar {
  registration_number: string;
  model: string;
  year: number;
  type: string;
}

// Chauffeur assigned to a vehicle
export interface AssignedUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: "admin" | "chauffeur";
  vehicle_id: number;
  created_at: string;
  updated_at: string;
}

// Single vehicle
export interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  year: number;
  status: "active" | "archived";
  type: "sec" | "frigo";
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_user: AssignedUser | null;
  documents: VehicleDocument[];
  maintenances: any[];
}

// Paginated API response wrapper
export interface VehiclesResponse {
  current_page: number;
  data: Vehicle[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Error entry for store
export interface ErrorEntry {
  message: string;
  operation: string;
  timestamp: string;
  code?: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}
