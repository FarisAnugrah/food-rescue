import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen({ goHome }: { goHome: () => void }) {
  return (
    <div className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-4xl font-black text-green-700 mb-2">404</Text>
      <Text className="text-gray-600 mb-6 text-center">Halaman tidak ditemukan.</Text>
      <TouchableOpacity onPress={goHome} className="bg-black px-6 py-3 rounded-full">
        <Text className="text-white font-bold">Kembali</Text>
      </TouchableOpacity>
    </div>
  );
}
