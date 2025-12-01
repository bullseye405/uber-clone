import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

const NotFound = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text>This screen doesn't exists</Text>
        <Link href="/">
          <Text>Go to home</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFound;
