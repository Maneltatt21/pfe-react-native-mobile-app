// Route configuration for the app
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "Login",
    REGISTER: "Register",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "AdminDashboard",
    CARS: "AdminCars",
    CAR_DETAILS: "AdminCarDetails",
    CAR_CREATE: "AdminCarCreate",
    CAR_EDIT: "AdminCarEdit",
    ARCHIVED_CARS: "AdminArchivedCars",
    DRIVERS: "AdminDrivers",
    DRIVER_DETAILS: "AdminDriverDetails",
    DRIVER_CREATE: "AdminDriverCreate",
    DRIVER_EDIT: "AdminDriverEdit",
    INVOICES: "AdminInvoices",
    INVOICE_DETAILS: "AdminInvoiceDetails",
    INVOICE_CREATE: "AdminInvoiceCreate",
    SUBSTITUTIONS: "AdminSubstitutions",
    SUBSTITUTION_DETAILS: "AdminSubstitutionDetails",
    SUBSTITUTION_CREATE: "AdminSubstitutionCreate",
    MAINTENANCES: "AdminMaintenances",
    MAINTENANCE_DETAILS: "AdminMaintenanceDetails",
    USERS: "AdminUsers",
    INSURANCE: "AdminInsurance",
    TECHNICAL_CONTROL: "AdminTechnicalControl",
    REGISTRATION_CARD: "AdminRegistrationCard",
  },

  // Chauffeur/Driver routes
  CHAUFFEUR: {
    HOME: "ChauffeurHome",
    MY_VEHICLES: "ChauffeurMyVehicles",
    VEHICLE_DETAILS: "ChauffeurVehicleDetails",
    ASSIGNED_RIDES: "ChauffeurAssignedRides",
    RIDE_DETAILS: "ChauffeurRideDetails",
    PROFILE: "ChauffeurProfile",
    INSPECTIONS: "ChauffeurInspections",
    MAINTENANCES: "ChauffeurMaintenances",
  },
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REGISTER: "/register",
    PROFILE: "/user",
  },

  CARS: {
    LIST: "/cars",
    SHOW: "/cars/:id",
    CREATE: "/cars",
    UPDATE: "/cars/:id",
    DELETE: "/cars/:id",
    ARCHIVED: "/cars/archived",
  },

  DRIVERS: {
    LIST: "/drivers",
    SHOW: "/drivers/:id",
    CREATE: "/drivers",
    UPDATE: "/drivers/:id",
    DELETE: "/drivers/:id",
  },

  INVOICES: {
    LIST: "/invoices",
    SHOW: "/invoices/:id",
    CREATE: "/invoices",
    UPDATE: "/invoices/:id",
    DELETE: "/invoices/:id",
  },

  SUBSTITUTIONS: {
    LIST: "/substitutions",
    SHOW: "/substitutions/:id",
    CREATE: "/substitutions",
    UPDATE: "/substitutions/:id",
    DELETE: "/substitutions/:id",
  },

  MAINTENANCES: {
    LIST: "/maintenances",
    SHOW: "/maintenances/:id",
    CREATE: "/maintenances",
    UPDATE: "/maintenances/:id",
    DELETE: "/maintenances/:id",
  },
};
