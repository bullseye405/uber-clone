import { icons } from "@/constants";
import { debounce } from "@/lib/utils";
import { useLocationStore } from "@/store";
import { GoogleInputProps } from "@/types/type";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

type GeoapifyResult = {
  place_id: string;
  formatted: string;
  lat: number;
  lon: number;
};

export default function GeoapifyAutocomplete({
  handlePress,
  containerStyle,
  icon,
  initialLocation,
  textInputBackgroundColor,
}: GoogleInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoapifyResult[]>([]);

  const { userLatitude, userLongitude } = useLocationStore();

  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setResults([]);
      return;
    }

    const countryFilter = "countrycode:np";
    const bias = `circle:${userLongitude},${userLatitude},5000`;

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        text,
      )}&format=json&filter=${countryFilter}&bias=${bias}&apiKey=${GEOAPIFY_API_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      setResults(json.results || []);
    } catch (err) {
      console.log("Auto-suggest error:", err);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  const handleInputChange = (text: string) => {
    setQuery(text);
    debouncedFetch(text);
  };

  return (
    <View
      className={`flex items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          marginHorizontal: 20,
          shadowColor: "#d4d4d4",
          position: "relative",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <View className="justify-center items-center w-6 h-6">
          <Image
            source={icon ? icon : icons.search}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <TextInput
          style={{
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
            padding: 10,
            paddingLeft: 12,
            color: "black",
          }}
          placeholderTextColor={"gray"}
          placeholder={initialLocation ?? "Where do you want to go?"}
          value={query}
          onChangeText={handleInputChange}
          clearButtonMode="always"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        style={{
          backgroundColor: textInputBackgroundColor
            ? textInputBackgroundColor
            : "white",
          position: "relative",
          top: 0,
          width: "100%",
          borderRadius: 10,
          shadowColor: "#d4d4d4",
          zIndex: 99,
          marginTop: 4,
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
            onPress={() => {
              setQuery(item.formatted);
              setResults([]);

              handlePress({
                latitude: item.lat,
                longitude: item.lon,
                address: item.formatted,
              });
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.formatted}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
