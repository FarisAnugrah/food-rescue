// Generate some small cleanups across files
const fs = require('fs');

const loginPath = 'src/app/auth/login/page.tsx';
let loginContent = fs.readFileSync(loginPath, 'utf8');
loginContent = loginContent.replace('Lanjutkan dengan Google', 'Masuk dengan Google');
fs.writeFileSync(loginPath, loginContent);

const registerPath = 'src/app/auth/register/page.tsx';
let registerContent = fs.readFileSync(registerPath, 'utf8');
registerContent = registerContent.replace('Lanjutkan dengan Google', 'Daftar dengan Google');
fs.writeFileSync(registerPath, registerContent);

console.log("Improved Auth UI text copy");
