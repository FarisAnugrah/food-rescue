import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen({ goHome }: { goHome: () => void }) {
  return (
    <View style={s.container}>
      <Text style={s.title}>404</Text>
      <Text style={s.subtitle}>Halaman tidak ditemukan.</Text>
      <TouchableOpacity onPress={goHome} style={s.btn}>
        <Text style={s.btnText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: 24 },
  title: { fontSize: 36, fontWeight: "900", color: "#15803d", marginBottom: 8 },
  subtitle: { color: "#4b5563", marginBottom: 24, textAlign: "center" },
  btn: { backgroundColor: "black", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  btnText: { color: "white", fontWeight: "bold" },
});
