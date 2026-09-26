"use client";

import { Download } from "lucide-react";
import QRCode from "react-qr-code";

export default function QRDownload({ qrString, filename }: { qrString: string, filename: string }) {
  function downloadQR() {
    const svg = document.getElementById("qris-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 200, 200);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${filename}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 border-4 border-orange-200 rounded-xl bg-white inline-flex items-center justify-center mx-auto w-fit mb-3">
        <QRCode id="qris-svg" value={qrString} size={160} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
      </div>
      <button 
        onClick={downloadQR}
        className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm ring-1 ring-orange-200"
      >
        <Download className="w-3.5 h-3.5" /> Download QR
      </button>
    </div>
  );
}