import { StyleSheet, Text, View } from "react-native";
import { formatWeight } from "@food-rescue/shared";

const impact = { total_kg: 12.5, total_co2: 31.25, total_orders: 8 };

export default function ImpactScreen() {
  let badge = "Starter";
  if (impact.total_kg >= 50) badge = "Master Rescuer";
  else if (impact.total_kg >= 20) badge = "Advanced Hero";
  else if (impact.total_kg >= 5) badge = "Food Saver";

  return (
    <View style={s.container}>
      <Text style={s.heading}>My Impact</Text>
      <Text style={s.subheading}>Dampak positifmu untuk lingkungan</Text>

      <View style={s.badgeCard}>
        <Text style={s.badgeTitle}>Badge Saat Ini</Text>
        <Text style={s.badgeIcon}>🏆</Text>
        <Text style={s.badgeName}>{badge}</Text>
        <Text style={s.badgeDesc}>
          Luar biasa! Kamu telah membuktikan bahwa tindakan kecil bisa membawa dampak besar.
        </Text>
      </View>

      <View style={s.statsGrid}>
        <View style={s.statCard}>
          <View style={[s.statIconBox, { backgroundColor: "#d8f3dc" }]}>
            <Text style={s.statIcon}>🍱</Text>
          </View>
          <Text style={s.statLabel}>Makanan Diselamatkan</Text>
          <Text style={s.statVal}>{formatWeight(impact.total_kg)}</Text>
        </View>

        <View style={s.statCard}>
          <View style={[s.statIconBox, { backgroundColor: "#fefae0" }]}>
            <Text style={s.statIcon}>🌱</Text>
          </View>
          <Text style={s.statLabel}>CO₂ Dicegah</Text>
          <Text style={s.statVal}>{formatWeight(impact.total_co2)}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf7", paddingHorizontal: 20, paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#1b4332", marginBottom: 4 },
  subheading: { fontSize: 14, color: "#888", marginBottom: 24 },
  badgeCard: { backgroundColor: "#2d6a4f", borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 24 },
  badgeTitle: { color: "#95d5b2", fontSize: 13, fontWeight: "600", marginBottom: 16 },
  badgeIcon: { fontSize: 56, marginBottom: 12 },
  badgeName: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  badgeDesc: { color: "#95d5b2", fontSize: 12, textAlign: "center", lineHeight: 18 },
  statsGrid: { gap: 12 },
  statCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e8e4d4", alignItems: "center" },
  statIconBox: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  statIcon: { fontSize: 20 },
  statLabel: { fontSize: 12, color: "#888", marginBottom: 4 },
  statVal: { fontSize: 24, fontWeight: "bold", color: "#1b4332" },
});
