import { DriverStore, LocationStore, MarkerData } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  destinationAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  userAddress: null,
  userLatitude: null,
  userLongitude: null,
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationAddress: address,
      destinationLatitude: latitude,
      destinationLongitude: longitude,
    }));
  },

  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
  selectedDriver: null,
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
}));
