import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { validateClaimState } from "../utils/claimGuard";

export const RewardScreen = ({ route }) => {
  const navigation = useNavigation();
  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const claimId = route?.params?.claimId ?? null;
    const result = validateClaimState(claimId);
    setValid(result.valid);
    setChecked(true);
    if (!result.valid && !claimId) {
      const t = setTimeout(() => navigation.navigate("Home"), 2000);
      return () => clearTimeout(t);
    }
  }, [route?.params?.claimId]);

  if (!checked) return <View style={s.c}><Text>Loading...</Text></View>;
  if (!valid) return (
    <View style={s.c}>
      <Text style={s.err}>No Reward Available</Text>
      <Text>This reward has already been claimed or is invalid.</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}><Text>Go Home</Text></TouchableOpacity>
    </View>
  );
  return (
    <View style={s.c}>
      <Text style={s.ok}>Reward Earned!</Text>
      <Text>{route?.params?.rewardAmount ?? 0} points</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}><Text>Continue</Text></TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({ c: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }, err: { fontSize: 20, fontWeight: "bold", color: "red" }, ok: { fontSize: 24, fontWeight: "bold" } });
