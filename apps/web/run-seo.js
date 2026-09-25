const fs = require('fs');

const layoutPath = 'src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('keywords:')) {
  layoutContent = layoutContent.replace(
    'description:\n    "Selamatkan makanan surplus dari merchant, dapatkan harga diskon hingga 70%.",',
    'description:\n    "Selamatkan makanan surplus dari merchant, dapatkan harga diskon hingga 70%.",\n  keywords: ["food rescue", "makanan murah", "surplus makanan", "diskon makanan"],\n  openGraph: {\n    title: "Food Rescue",\n    description: "Beli makanan sisa berkualitas dengan diskon hingga 70%.",\n    locale: "id_ID",\n    type: "website",\n  },'
  );
  fs.writeFileSync(layoutPath, layoutContent);
  console.log("Added SEO metadata to layout");
}
