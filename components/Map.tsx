import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimesWithGeoapify,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { GeoapifyResponse } from "@/types/geoapify";
import { Driver, MarkerData } from "@/types/type";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const {
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
  } = useLocationStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const region = useMemo(() => {
    if (userLatitude || userLongitude) {
      return calculateRegion({
        destinationLatitude,
        destinationLongitude,
        userLatitude,
        userLongitude,
      });
    }
  }, [destinationLatitude, destinationLongitude, userLatitude, userLongitude]);

  const { selectedDriver, setDrivers } = useDriverStore();

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) {
        return;
      }
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimesWithGeoapify({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [
    markers,
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
    setDrivers,
  ]);

  useEffect(() => {
    if (
      userLatitude &&
      userLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
      getRouteCoordinates(
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      )
        .then((data) => {
          setRouteCoords(data);
        })
        .catch(console.error);
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size={"small"} color={"#000"} />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key={"destination"}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#0286ff"
              strokeWidth={3}
            />
          )}
        </>
      )}
    </MapView>
  );
};

export default Map;

const getRouteCoordinates = async (
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
) => {
  const API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
  const url = `https://api.geoapify.com/v1/routing?waypoints=${originLat},${originLon}|${destLat},${destLon}&mode=drive&apiKey=${API_KEY}`;

  const res = await fetch(url);
  const data: GeoapifyResponse = await res.json();

  // Geoapify returns a geometry in "coordinates" format [[lon, lat], ...]
  const coordinates: number[][][] =
    data.features?.[0]?.geometry?.coordinates || [];

  const route = coordinates[0].map((coord) => ({
    latitude: coord[1], // Latitude
    longitude: coord[0], // Longitude
  }));

  return route;
};
