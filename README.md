# Music Room v2 — Playlists, independent listening & shared controls

## Update your existing GitHub Pages site from your phone

1. Download the ZIP and tap it in Files to extract it.
2. In Safari, open https://github.com/binayakkshetri/music-room/upload/main
3. Choose files → Browse. Select these FOUR files from the extracted folder:
   - index.html
   - manifest.webmanifest
   - icon-192.png
   - icon-512.png
4. Commit directly to main. The existing index.html is replaced; icons and manifest are added. Upload at the repository root, not inside a subfolder. Do not upload the ZIP itself.
5. Your Pages settings already use main / (root). No settings change or paid service is needed.
6. Wait for the Pages deployment to finish, then reload your site. Footer should read **v2 playlists**. Close/reopen the tab if your browser still shows the old page.

Only index.html is needed for playback. The manifest and icons add Home Screen presentation. LICENSE and README are optional uploads. No npm, build, database, API key, or Google account setup is needed. All app code and CSS are in index.html; it loads YouTube, PeerJS and Google Fonts from their services.

## Recommended for your partner / bedtime listening

1. Open Music Room and choose **Listen independently · playlist**.
2. Paste your public playlist link:
   https://music.youtube.com/playlist?list=PLJ049F55CgeQ
3. Tap **Play playlist**. If the browser blocks sound, tap Play inside the visible YouTube video.
4. Choose your song and position. Enable **Repeat playlist** if you want the list to repeat.
5. Tap **Share playlist → Copy playlist link**. This does not pause or reload your own player.
6. Send that link yourself to your partner. She opens it in Brave and taps **Join & listen**. The app requests playback at the song and position captured when you copied the link; it does not chase elapsed time or synchronize afterward.
7. She gets her own play/pause, previous/next track, rewind/forward 10 seconds, seek timeline, volume and repeat controls. She can pick another song in the list.
8. Once loaded, your browser/host tab can close. This mode has NO peer/host connection to maintain. Her device still needs an internet connection to YouTube.

A short first-use tour appears above the player. Tap **Got it**; it stays dismissed in that browser/profile until site data is cleared.

## Shared room mode

- **Create a room** resumes or creates the persistent host room.
- Add individual video links and invite one listener.
- BOTH people can use the app’s play/pause, previous/next, 10-second jumps, seek timeline and track-selection controls. Listener commands go to the host and state is sent back to both.
- Each person’s volume remains local. Queue adding/clearing remains host-only.
- A fresh state is sent when the listener joins. Playback is requested if the host is playing; a paused host remains paused.
- Invite sharing does not stop your player.
- The host must remain online for live shared control and synchronization.
- If an established listener connection closes after songs have loaded, the listener switches to independent playback of the received queue. When possible the already loaded native playlist is retained; otherwise the queue is loaded at the current position and can require another tap to resume.
- Before a queue arrives, failed connections retry rather than inventing songs.
- **Listen independently** also manually leaves a shared room and keeps the received queue. You can share that independent queue (up to 100 tracks) without requiring a host afterward.
- Independent playback does not automatically rejoin the room. Reload the original room invite to join again.
- Shared mode accepts individual videos. Pasting a public playlist offers a clear switch to independent native playlist mode. Synchronized public-playlist rooms are not implemented in v2.

## Public playlist playback

The YouTube IFrame API natively supports loadPlaylist/cuePlaylist and playlist navigation; no YouTube Data API key is required for this use. The app reads video IDs from the embedded player after loading. Titles are filled as tracks are loaded; unvisited songs may show their IDs. This is not a full account/library import.

Public and some unlisted playlists can play if YouTube permits embedding and the videos are accessible. Private playlists and your private account library are not supported. Video/playlist availability can differ by region, account and age restrictions.

## Home Screen option

Tap **Home Screen** in the header for instructions. On iPhone, use the browser Share menu → **Add to Home Screen**. If Brave does not offer this, use Safari to add the shortcut.

The manifest uses standalone display and supplied icons. This is a website shortcut, not a native iOS music app. There is no service worker/offline audio cache. The shortcut does not guarantee background execution. If Brave already keeps music playing for you, keep using the listening link in Brave; a Safari/Home Screen session may behave differently and uses different browser storage.

## Background playback: what this update fixes and what it cannot guarantee

**Fixed at the application level:** independent playlist mode removes the peer connection requirement. Your partner does not have to keep YOUR browser online. YouTube’s native playlist handles advancing instead of waiting for host commands. The app does not pause a player just because an invite is shared or a peer disconnects.

**Not guaranteed:** uninterrupted audio while an iPhone is locked, advancing to the next track while locked, zero-tap autoplay, uninterrupted overnight playback, or recovery without a user gesture. Brave/iOS, YouTube restrictions, ads, buffering and network changes can still stop playback. The visible embedded player remains intact. No silent-audio hacks, audio extraction, hidden YouTube background player or fake background toggle are implemented.

You may need the initial **Join & listen** tap AND a tap inside YouTube if autoplay is blocked. An app cannot reliably remove those browser requirements.

If the embedded playlist stops while locked, use **Open on YouTube** to try the playlist directly in Brave or your YouTube app. This leaves Music Room’s custom controls. Official YouTube Music background music playback requires an appropriate subscription; browser behavior varies.

## Connection, persistence & privacy

- Static HTTPS hosting; no backend/database of our own. PeerJS Cloud signaling and public STUN are external services.
- Some networks require a TURN relay, not included. Direct P2P connectivity is not guaranteed. Independent mode does not use PeerJS connections.
- Room ID, host manual queue and approximate position persist in that browser’s local storage. Changing browser/profile/domain or clearing data can change the host room.
- Room invite links allow anyone possessing the link to attempt the free listener seat. Share with trusted people only. No account authentication/moderation or host migration.
- WebRTC peers can learn network-address information. Playlist/queue share links include the playlist or video IDs and captured index/time in the URL fragment.
- Independent mode does not download media. Both devices stream from YouTube. Third-party service terms and library licenses apply.

## Testing completed

- Automated checks: URL parsing, deceptive-domain rejection, public playlist parsing, state validation, stale-message rejection, clock compensation, drift threshold, native playlist commands, shared-control commands, command replay rejection, seek range validation/clamping, syntax and ZIP integrity.
- Browser: your public playlist loaded 9 tracks; Next changed to the second song. Independent invite, own controls and first-use tour were inspected.
- Real iPhone/Brave overnight playback, locked-screen transitions and cross-network shared controls are NOT verified. Earlier two-tab cloud P2P testing did not establish a full data-channel session. Browser testing of playlist loading is not proof of continuous audible playback.

## Dependencies

PeerJS 1.5.5 from unpkg.com (MIT); YouTube IFrame API from youtube.com; Google Fonts Manrope with system fallback; thumbnails from i.ytimg.com. No service credentials are bundled. Application code uses LICENSE; external services retain their own terms.

## Official references

https://developers.google.com/youtube/iframe_api_reference
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
https://peerjs.com/client/faq
