export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  vehicle_id: any;
}

//Car store

// AssignedUser interface
export interface AssignedUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  vehicle_id: number;
  created_at: string;
  updated_at: string;
}

// VehicleDocument interface
export interface VehicleDocument {
  id: number;
  vehicle_id: number;
  type: string;
  expiration_date: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

// Maintenance interface
export interface Maintenance {
  id: number;
  vehicle_id: number;
  maintenance_type: string;
  description: string;
  date: string;
  reminder_date: string;
  invoice_path: string;
  created_at: string;
  updated_at: string;
}

// Exchange interface
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
}

// Vehicle interface
export interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  year: number;
  status: "active" | "archived";
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_user: AssignedUser | null;
  documents: VehicleDocument[];
  maintenances: Maintenance[];
  exchanges: Exchange[];
}

// CreateCar interface
export interface CreateCar {
  registration_number: string;
  model: string;
  year: number;
  status?: "active" | "archived";
  assigned_user_id?: number | null;
}

// CreateCarDocument interface
export interface CreateCarDocument {
  type: string;
  expiration_date: string;
  file_path: string;
}

// CreateCarMaintenance interface
export interface CreateCarMaintenance {
  maintenance_type: string;
  description: string;
  date: string;
  reminder_date: string;
  invoice_path: string;
}

// ErrorEntry interface
export interface ErrorEntry {
  message: string;
  operation: string;
  timestamp: string;
}

// Default empty vehicle
export const defaultVehicle: Vehicle = {
  id: 0,
  registration_number: "",
  model: "",
  year: 0,
  status: "active",
  archived_at: null,
  created_at: "",
  updated_at: "",
  assigned_user: null,
  documents: [],
  maintenances: [],
  exchanges: [],
};
