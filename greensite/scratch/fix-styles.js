const fs = require('fs');
const path = 'components/home/FeaturesSection.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/background: '#1A1B1E'/g, "background: '#0a0a0a'");
content = content.replace(/border: '1px solid rgba\(255,255,255,0.05\)'/g, "border: '1px solid rgba(255,255,255,0.2)'");
fs.writeFileSync(path, content);
console.log('Successfully updated FeaturesSection.tsx');
