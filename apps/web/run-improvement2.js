const fs = require('fs');

const adminPath = 'src/app/admin/page.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');
if(adminContent.includes('Buka Foto KTP')) {
   adminContent = adminContent.replace('Buka Foto KTP', 'Lihat Foto KTP');
   fs.writeFileSync(adminPath, adminContent);
}

const listingsPath = 'src/app/merchant/listings/page.tsx';
let listingsContent = fs.readFileSync(listingsPath, 'utf8');
if(listingsContent.includes('+ Listing Baru')) {
  listingsContent = listingsContent.replace('+ Listing Baru', '+ Tambah Makanan');
  fs.writeFileSync(listingsPath, listingsContent);
}

console.log("Improved UI text strings for better context");
