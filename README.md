# Music Room v5 — Friends and playlist improvements

Replace the repository root `index.html` with this file, commit, then hard-refresh the site on every device.

## Features
- Saved friend-room bookmarks with nickname and one-tap Join. Stored in browser localStorage, not cloud accounts.
- PeerJS presence probe to show if a saved room has an active host, participant count and current track (when available). Updates approximately every 18 seconds; room host must be online. These are public room-link identities, not verified users.
- YouTube thumbnail for individual queued videos; current track's actual YouTube title is updated when its video starts playing and propagated to the room.
- YouTube playlists can expand into individual video IDs only if the YouTube IFrame Player API exposes them. Full playlist names, complete track metadata, and reliable enumeration are not available from this API for all YouTube Music playlists. No untrusted scraping or secret API keys were added.

## Test
1. In one browser open room A; in another open room B.
2. In A save `Friend B | <full room B URL>` and verify the friend appears online.
3. Close B and wait for next presence refresh. Reopen B and join from A.
4. Add a public YouTube video and check thumbnail/title; test playlist and whether it expands.
5. Test with two devices and autoplay permissions.

## Limitations
- Saved friends are room bookmarks only; no authentication, cross-device contact sync, or offline messaging.
- When you navigate to an offline room, the first visitor can become the host (existing PeerJS design).
- The playback and presence code was syntax-checked but has not been verified against live YouTube/PeerJS on two phones.
