// import React, { createContext, useCallback, useContext } from "react";
// import { Vehicle, VehiclesResponse } from "../models/car.model";
// import { useCarsStore } from "../store/carsStore";

// interface CarsContextType {
//   cars: Vehicle[];
//   isLoading: boolean;
//   fetchCars: () => Promise<void>;
//   refetch: () => Promise<void>;
// }

// const CarsContext = createContext<CarsContextType | undefined>(undefined);

// export const CarsProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { cars, isLoading, setCars, setLoading } = useCarsStore();

//   const fetchCars = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/v1/vehicles");
//       const json: VehiclesResponse = await res.json();
//       console.log(res);
//       setCars(json.data);
//     } catch (e) {
//       console.error("fetchCars failed", e);
//     } finally {
//       setLoading(false);
//     }
//   }, [setCars, setLoading]);

//   const refetch = useCallback(() => fetchCars(), [fetchCars]);

//   return (
//     <CarsContext.Provider value={{ cars, isLoading, fetchCars, refetch }}>
//       {children}
//     </CarsContext.Provider>
//   );
// };

// // Hook to consume the context
// export const useCars = () => {
//   const ctx = useContext(CarsContext);
//   if (!ctx) throw new Error("useCars must be used inside CarsProvider");
//   return ctx;
// };
