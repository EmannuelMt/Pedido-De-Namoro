import fs from 'fs';

const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startTag = ") : view === 'home' ? (";
const endTag = ") : view === 'historia' ? (";

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex + startTag.length);
  const after = content.substring(endIndex);
  const insertion = `\n          <HomeView \n            user={user} \n            setView={setView} \n            GALLERY_DATA={GALLERY_DATA} \n            PLAYLIST_DATA={PLAYLIST_DATA} \n            LETTERS_DATA={userLetters} \n          />\n        `;
  content = before + insertion + after;
  fs.writeFileSync(filePath, content);
  console.log('Successfully updated App.tsx via node script');
} else {
  console.error('Tags not found', { startIndex, endIndex });
  process.exit(1);
}
