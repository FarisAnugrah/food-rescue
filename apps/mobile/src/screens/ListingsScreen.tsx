import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Listing } from "@food-rescue/shared";
import { formatCurrency, calculateDiscount } from "@food-rescue/shared";

const CATEGORIES = ["Semua", "Bakery", "Restoran", "Japanese", "Western", "Healthy"];

const DUMMY: (Listing & { merchant_name: string })[] = [
  {
    id: "1", merchant_id: "m1", title: "Surprise Bag — Roti & Pastry", description: "", photo_url: null, category: "Bakery",
    is_halal: true, original_price: 75000, discounted_price: 25000, weight_kg: 1.5, quantity: 5, quantity_sold: 2,
    pickup_start: "2026-09-17T16:00:00", pickup_end: "2026-09-17T19:00:00", type: "surprise_bag", status: "active",
    created_at: "", merchant_name: "Bakery Makmur",
  },
  {
    id: "2", merchant_id: "m2", title: "Nasi Campur Komplit", description: "", photo_url: null, category: "Restoran",
    is_halal: true, original_price: 35000, discounted_price: 15000, weight_kg: 0.8, quantity: 10, quantity_sold: 7,
    pickup_start: "2026-09-17T17:00:00", pickup_end: "2026-09-17T20:00:00", type: "specific", status: "active",
    created_at: "", merchant_name: "Warung Bu Sari",
  },
  {
    id: "3", merchant_id: "m3", title: "Surprise Bag — Sushi & Bento", description: "", photo_url: null, category: "Japanese",
    is_halal: false, original_price: 120000, discounted_price: 40000, weight_kg: 1.0, quantity: 3, quantity_sold: 1,
    pickup_start: "2026-09-17T19:00:00", pickup_end: "2026-09-17T21:00:00", type: "surprise_bag", status: "active",
    created_at: "", merchant_name: "Sushi Tei Express",
  },
];

interface Props {
  onSelect: (id: string) => void;
}

export default function ListingsScreen({ onSelect }: Props) {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = DUMMY.filter((l) => {
    if (category !== "Semua" && l.category !== category) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.heading}>Rescue Makanan</Text>
        <TouchableOpacity style={s.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1b4332" />
          <View style={s.redDot} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={s.search}
        placeholder="Cari makanan..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        horizontal
        data={CATEGORIES}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.cats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item)}
            style={[s.cat, category === item && s.catActive]}
          >
            <Text style={[s.catText, category === item && s.catTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(i) => i}
      />

      <FlatList
        data={filtered}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const disc = calculateDiscount(item.original_price, item.discounted_price);
          const remaining = item.quantity - item.quantity_sold;
          return (
            <TouchableOpacity style={s.card} onPress={() => onSelect(item.id)}>
              <View style={s.cardImg}>
                <View style={s.badge}>
                  <Text style={s.badgeText}>-{disc}%</Text>
                </View>
                {item.is_halal && (
                  <View style={s.halalBadge}>
                    <Text style={s.halalText}>Halal</Text>
                  </View>
                )}
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardCat}>{item.category}</Text>
                <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={s.cardMerchant}>{item.merchant_name}</Text>
                <View style={s.cardBottom}>
                  <View>
                    <Text style={s.cardOldPrice}>{formatCurrency(item.original_price)}</Text>
                    <Text style={s.cardPrice}>{formatCurrency(item.discounted_price)}</Text>
                  </View>
                  <Text style={s.cardRemaining}>Sisa {remaining} bag</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(i) => i.id}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf7", paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#1b4332" },
  bellBtn: { position: "relative", padding: 4 },
  redDot: { position: "absolute", top: 4, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: "#e63946", borderWidth: 1, borderColor: "#fff" },
  search: { marginHorizontal: 20, borderWidth: 1, borderColor: "#e8e4d4", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, backgroundColor: "#fff", marginBottom: 12 },
  cats: { paddingHorizontal: 20, gap: 8, marginBottom: 16, height: 40 },
  cat: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#e8e4d4", backgroundColor: "#fff" },
  catActive: { backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" },
  catText: { fontSize: 13, color: "#555", fontWeight: "500" },
  catTextActive: { color: "#fff" },
  list: { paddingHorizontal: 20, gap: 12, paddingBottom: 40 },
  card: { borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e8e4d4", overflow: "hidden" },
  cardImg: { height: 140, backgroundColor: "#f0ede0", justifyContent: "flex-start", padding: 10, flexDirection: "row", alignItems: "flex-start" },
  badge: { backgroundColor: "#2d6a4f", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  halalBadge: { backgroundColor: "#d8f3dc", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginLeft: "auto" },
  halalText: { color: "#2d6a4f", fontSize: 11, fontWeight: "600" },
  cardBody: { padding: 14, gap: 2 },
  cardCat: { fontSize: 11, color: "#52b788", fontWeight: "600" },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#1b4332" },
  cardMerchant: { fontSize: 12, color: "#888" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 },
  cardOldPrice: { fontSize: 11, color: "#bbb", textDecorationLine: "line-through" },
  cardPrice: { fontSize: 18, fontWeight: "bold", color: "#1b4332" },
  cardRemaining: { fontSize: 11, color: "#52b788", fontWeight: "500" },
});
