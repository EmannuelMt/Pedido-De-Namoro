#!/bin/bash
# delete lines 1928 to 2134 and insert new HomeView
sed -i '1928,2134d' src/App.tsx
# now insert the new content after line 1927
sed -i '1927a\          <HomeView user={user} setView={setView} GALLERY_DATA={GALLERY_DATA} PLAYLIST_DATA={PLAYLIST_DATA} LETTERS_DATA={userLetters} />' src/App.tsx
