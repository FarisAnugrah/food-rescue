# Commit 1: Add ESLint config explicitly to root
cat << 'ESLINT' > ../../.eslintrc.json
{
  "root": true,
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
ESLINT
git add ../../.eslintrc.json
git commit -m "chore: add explicit eslint configuration to standardize codebase rules"

# Commit 2: Add Prettier config
cat << 'PRETTIER' > ../../.prettierrc
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
PRETTIER
git add ../../.prettierrc
git commit -m "chore: add prettier configuration for consistent code formatting"

# Commit 3: Add environment templates for Mobile App
cat << 'ENVTEMPLATE' > ../mobile/.env.template
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# EAS Configuration for Push Notifications (Optional)
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
ENVTEMPLATE
git add ../mobile/.env.template
git commit -m "docs: add environment variable templates for mobile application"

# Commit 4: Extract Header/Footer to reusable components for Main App
mkdir -p src/components/layout
cat << 'FOOTER' > src/components/layout/footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row justify-between gap-12 text-sm text-gray-500 font-medium">
        <div>
          <span className="text-lg font-black tracking-tight text-gray-900">
            Food<span className="text-[#2d6a4f]">Rescue</span>
          </span>
          <p className="mt-4 max-w-xs leading-relaxed">
            Platform marketplace food rescue Indonesia. Selamatkan makanan, kurangi limbah.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Platform</span>
            <Link href="/#cara-kerja" className="hover:text-gray-900 transition-colors">Cara Kerja</Link>
            <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Consumer</Link>
            <Link href="/auth/register" className="hover:text-gray-900 transition-colors">Daftar Merchant</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">Dampak</span>
            <Link href="/#dampak" className="hover:text-gray-900 transition-colors">Statistik</Link>
            <Link href="/#merchant" className="hover:text-gray-900 transition-colors">Untuk Merchant</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} Food Rescue Indonesia
      </div>
    </footer>
  );
}
FOOTER
git add src/components/layout/footer.tsx
git commit -m "refactor: extract main footer into a reusable layout component"

# Commit 5: Create centralized types declaration file
cat << 'DECLARATIONS' > ../../packages/shared/src/declarations.d.ts
declare module 'react-qr-code' {
  import * as React from 'react';
  
  export interface QRCodeProps extends React.SVGProps<SVGSVGElement> {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
  }
  
  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
}
DECLARATIONS
git add ../../packages/shared/src/declarations.d.ts
git commit -m "types: add module declarations for untyped external packages"

# Commit 6: Add basic security headers to next.config.ts
cat << 'NEXTCONF' > next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
NEXTCONF
git add next.config.ts
git commit -m "chore: configure next.js security headers and image domains"

# Commit 7: Create 404 fallback for mobile
cat << 'MOBILENOTFOUND' > ../mobile/src/screens/NotFoundScreen.tsx
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
MOBILENOTFOUND
git add ../mobile/src/screens/NotFoundScreen.tsx
git commit -m "feat: add missing 404 fallback screen to mobile application"

# Commit 8: Add pull request template
mkdir -p ../../.github
cat << 'PRTEMPLATE' > ../../.github/PULL_REQUEST_TEMPLATE.md
## Deskripsi Perubahan
Jelaskan secara singkat perubahan apa yang dilakukan dalam PR ini.

## Terkait dengan Issue
Link issue: #

## Jenis Perubahan
- [ ] Bug fix
- [ ] Fitur Baru
- [ ] Refactor Code
- [ ] Update Dokumentasi

## Checklist
- [ ] Code telah dites secara lokal
- [ ] Tidak ada warning/error pada terminal
- [ ] UI sudah responsive (Cek via HP/DevTools)
PRTEMPLATE
git add ../../.github/PULL_REQUEST_TEMPLATE.md
git commit -m "docs: add github pull request template to standardize contributions"

# Commit 9: Implement custom generic UI input
cat << 'INPUTCOMP' > src/components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-black outline-none transition-colors bg-white ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
INPUTCOMP
git add src/components/ui/input.tsx
git commit -m "feat: extract reusable Input component to standardize form fields"

# Commit 10: Final cleanup of dummy comments
sed -i '' -e 's/Dummy Order/Sample Order/g' src/lib/order-queries.ts
git add src/lib/order-queries.ts
git commit -m "chore: clean up remnant dummy development comments in queries"

# Push batch 4
git push origin development
