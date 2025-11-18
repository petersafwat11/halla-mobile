import { View, Text, StyleSheet } from "react-native";

const PlansScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlansScreen</Text>
    </View>
  );
};

export default PlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
