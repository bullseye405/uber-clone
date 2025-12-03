import { Text, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  // const region = {};
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      // initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <View>
        <Text>Map</Text>
      </View>
    </MapView>
  );
};

export default Map;
