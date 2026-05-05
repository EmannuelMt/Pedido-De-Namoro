const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let startStr = '{/* Enchanted Night Garden Background */}';
let endStr = '<AnimatePresence mode="wait">';
let start = content.indexOf(startStr);
let end = content.indexOf(endStr, start);
console.log("Start:", start, "End:", end);
if (start !== -1 && end !== -1) {
  content = content.substring(0, start) + '{/* Theme System Background */}\n      <ThemeBackground themeMode={themeMode} />\n\n      ' + content.substring(end);
  let importStr = "import { ThemeBackground } from './components/ThemeBackground';\n";
  if (!content.includes(importStr)) {
    content = importStr + content;
  }
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully updated App.tsx');
} else {
  console.log('Could not find strings');
}
