import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: { name: string };
}

export default function MerchantReviews({ merchantId }: { merchantId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, users(name)")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data as any);
      }
      setLoading(false);
    }
    if (merchantId) fetchReviews();
  }, [merchantId]);

  if (loading) return <ActivityIndicator style={{ padding: 20 }} color="#2d6a4f" />;

  if (reviews.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyText}>Belum ada review untuk toko ini.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(i) => i.id}
      contentContainerStyle={s.list}
      renderItem={({ item }) => (
        <View style={s.card}>
          <View style={s.header}>
            <Text style={s.name}>{item.users?.name || "User"}</Text>
            <View style={s.ratingRow}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={s.ratingText}>{item.rating}</Text>
            </View>
          </View>
          {item.comment ? <Text style={s.comment}>{item.comment}</Text> : null}
          <Text style={s.date}>
            {new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </Text>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  empty: { padding: 20, alignItems: "center" },
  emptyText: { color: "#888", fontStyle: "italic" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e4d4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: { fontWeight: "bold", color: "#1b4332", fontSize: 14 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontWeight: "bold", color: "#f59e0b", fontSize: 14 },
  comment: { color: "#555", fontSize: 14, marginBottom: 8, lineHeight: 20 },
  date: { color: "#bbb", fontSize: 11 },
});
