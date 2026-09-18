"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { verifyOrderByQr } from "@/lib/order-actions";

export default function MerchantScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  async function handleScan(data: string) {
    if (loading) return;
    setLoading(true);
    setResult("Verifikasi...");

    // data is expected to be the QR code string (e.g., FR-QRIS-...)
    const res = await verifyOrderByQr(data);
    
    if (res?.error) {
      setResult(`Gagal: ${res.error}`);
      setTimeout(() => {
        setResult(null);
        setLoading(false);
      }, 3000);
    } else {
      setResult("Sukses! Order berhasil di-pickup.");
      setTimeout(() => {
        setIsOpen(false);
        setResult(null);
        setLoading(false);
        router.refresh(); // Refresh the page to update order list
      }, 2000);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full bg-[#1b4332] px-6 py-3 text-sm font-bold text-white hover:bg-[#2d6a4f] transition-colors"
      >
        <Camera className="w-5 h-5" />
        Scan QR Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden relative shadow-2xl">
            <div className="bg-[#1b4332] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Scan QR Konsumen</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="aspect-square w-full bg-black relative">
              {!loading && !result ? (
                <Scanner 
                  onScan={(r) => {
                    if (r && r.length > 0) handleScan(r[0].rawValue);
                  }} 
                  onError={(err) => console.log(err)}
                  components={{ zoom: false }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-white p-6 text-center">
                  <p className="font-bold text-lg text-[#1b4332]">{result}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}