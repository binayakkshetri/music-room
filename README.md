# Music Room v4 — Aurora

Replace the GitHub Pages repository root `index.html` with this file and commit.

## Changes
- Aurora/glass animated UI (respects reduced-motion setting).
- Nickname and last room saved locally in the browser. Bookmark the same room URL for repeat access.
- Playlist expansion: when the host's YouTube IFrame player returns `getPlaylist()` IDs, the host replaces the playlist queue item with individually editable video entries. If YouTube does not expose the list, the playlist stays as one entry; there is no YouTube Data API key or backend.
- Host-only automatic next-track transitions. Listener ENDED events no longer issue NEXT commands.
- Drift correction is less aggressive, reducing repeated seeks while buffering.
- Existing copy feedback and queue controls preserved.

## Known limitations
- The IFrame API does not reliably expose playlist contents for all YouTube Music playlists, private playlists, or restricted videos. Song titles may remain video IDs without an API/backend.
- This is NOT a cross-device account system. Browser localStorage stores nickname and room link on that browser only; users joining from another device need the same bookmarked link once.
- A room requires a host browser tab online. No persistent queue when everyone disconnects.
- Autoplay and background/locked-phone playback depend on YouTube and browser policy.
- The new behavior passed JavaScript syntax validation, but has not been tested live across phones or against a real playlist.

## Acceptance test
1. Host on phone A, listener on phone B (not two tabs on the same phone).
2. Add a public playlist. Wait a few seconds for playlist expansion. If it does not expand, report playlist URL and whether playback works.
3. On both devices, verify same first video; let it end; verify both advance once and do not loop at 1 second.
4. Reorder/remove a playlist song from listener; verify host queue updates.
5. Refresh listener; verify same nickname and room link; tap play if browser blocks autoplay.
