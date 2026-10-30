# Music Room

Different places. Same song.

A static, two-person YouTube listening room with a dark lavender interface. No installation, build command, account system, database, or API key is required by this app. Internet access and an HTTPS host are required. YouTube and PeerJS remain external services; “static” does not mean independent of servers.

## Publish from an iPhone — GitHub Pages

1. Download Music_Room_GitHub_Ready.zip. Save it to Files.
2. In Files, tap the ZIP once to extract it. Open the extracted folder. The important file is **index.html**.
3. Open **https://github.com/new** in Safari. Sign in, create a repository named **music-room**, choose **Public**, and initialize it with a README so the main branch exists. A public repository is the simple free GitHub Pages route.
4. Open the new repository. Choose **Add file → Upload files**. If these controls are missing on mobile, use Safari’s page menu → **Request Desktop Website**. The GitHub mobile app may not expose all website controls.
5. Choose files from Files and upload **index.html** to the repository root. Commit the upload to **main**. You may upload LICENSE as well. The included README is optional; it does not need to replace GitHub’s initial README.
6. Open repository **Settings → Pages**. You may need to scroll the settings sidebar or use desktop mode.
7. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
8. Wait for the Pages deployment to finish. GitHub will show the actual site URL and **Visit site** link. Open that link in Safari or Brave, not the HTML file in Files and not the github.com source-code page.
9. No domain or DNS configuration is needed. A project normally appears at `https://YOUR_USERNAME.github.io/music-room/`; use GitHub’s displayed URL as authoritative.

**Do not upload only the ZIP.** GitHub Pages does not extract it. **index.html must be directly at the publishing root**, not inside another music-room folder. Only index.html is necessary to run this app. All styles and application code are inside it.

## Start listening

1. Host opens the deployed site and taps **Create a room**.
2. Paste a YouTube or YouTube Music *video* link, then tap **+**. Playlist-only links are not supported. Individual videos inside a playlist can be added.
3. Tap **Play** in the visible YouTube player if playback does not start.
4. Tap **Invite someone**, then **Copy link**. Send that room link yourself to your partner.
5. Partner opens the link in a normal browser, taps **Join & listen**, and, if needed, taps Play inside the YouTube player.
6. Host controls song selection, pausing, and seeking. Partner controls their own volume. **Resync** requests the latest host position.
7. Keep both tabs open and devices awake for the most reliable experience. Use a quiet room to compare timing; do not assume exact lockstep.

## What is implemented

- Responsive welcome screen, host/listener rooms, queue, invite modal, connection status, and error messages.
- Real YouTube IFrame playback using its supported visible player.
- YouTube watch, Music watch, youtu.be, shorts, live, and embed video URL parsing.
- One host and one listener over a PeerJS WebRTC data channel; extra listeners are rejected.
- Full state on joining, three-second heartbeat, play/pause propagation, track changes, and seek correction beyond 1.5 seconds of drift.
- Clock-offset estimation using round-trip ping samples. This helps compensate for transport delay; it does not remove buffering or player startup delay.
- Ordered sequence checks to ignore stale state packets, fresh host-session epochs, and no listener-to-host playback echo.
- Queue up to 100 videos; host can choose tracks, clear the queue, or advance to the next track. Next queued track loads when a video ends.
- Automatic listener reconnection attempts and a manual reconnect button.
- Host room ID, queue, current selection, and approximate position saved in this browser’s local storage. Reopening the plain app URL and pressing Create a room resumes that host room paused. Press Play to resume.
- The room invite link remains unchanged across songs in the same host browser/profile. Clearing site data, private browsing, changing domains, or switching browser/profile creates a different host room. This is not cross-device account persistence.

## Limits you should know

- No promise of sample-accurate sync, guaranteed ad blocking, guaranteed background audio, or uninterrupted mobile playback. Brave Shields is the browser’s behavior, not an app feature.
- YouTube separately streams to both devices. Ads, restrictions, buffering, region differences, age gates, and videos that prohibit embedding can interrupt playback. Try another video when one cannot embed.
- The app does not download, extract, proxy, or rebroadcast YouTube audio. Native player controls/branding remain visible.
- Free PeerJS Cloud handles signaling; default app settings use public STUN servers for connectivity. They are third-party services with no availability guarantee.
- Some cellular, corporate, VPN, and restrictive NAT networks need a TURN relay, which is not included. If the connection repeatedly fails, try a different network. Running a relay or using a relay provider can add cost and needs configuration.
- To configure an optional relay, edit `ICE_SERVERS` near the start of the application script in index.html. Do not commit permanent private credentials to a public repository. A production relay with short-lived credentials generally needs a credential-issuing backend, outside this static-only package.
- Room links are bearer invitations: anyone who knows one can attempt to take the free listener seat. No account authentication or moderation is implemented. WebRTC may expose network address information to the other participant. Share only with someone you trust. Do not publish an invite publicly.
- The host must remain online. One host tab per room. If the host room is already open in another tab/device, close that instance before reopening it. There is no host migration or offline room server.
- Listener native YouTube controls can temporarily change local playback; incoming host state restores it. Use the local volume slider for independent volume.
- Video titles are read from the host player after loading; until then, the queue displays the video ID. No search catalog, automatic playlist import, chat, or music-service account integration is included.

## Troubleshooting

**I see source code or the file preview:** use the GitHub Pages site URL, not the repository file URL.

**404:** ensure index.html is in the root selected in Pages settings; wait until deployment finishes. A project URL includes the repository name.

**Silent player:** tap the native YouTube Play button. Then press Resync. Browser user activation can expire while the app is loading.

**Finding host / host not here yet:** host must press Create a room and keep that tab open. Check both devices use the latest copied invite link. Try mobile data vs Wi-Fi if direct WebRTC fails. Hosting on GitHub does not solve NAT connectivity.

**Room already open elsewhere:** close the other host tab, wait briefly, then reload the original host site. Do not share your host browser’s local storage.

**Waiting for host updates:** reopen/foreground the host tab. Mobile operating systems can suspend background pages.

**Video unavailable:** use a different embeddable video. An active YouTube login in another tab does not guarantee that a restricted video will play in an iframe.

**YouTube or PeerJS fails to load:** check connectivity or site-specific browser restrictions. The app does not require globally disabling browser protections.

## Dependencies and hosting

- PeerJS 1.5.5 loaded from https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js (MIT licensed; not bundled).
- YouTube IFrame API loaded from https://www.youtube.com/iframe_api (YouTube terms apply).
- Manrope font loaded from Google Fonts, with a system-font fallback.
- Video thumbnails load from i.ytimg.com.
- No private keys, hosting credentials, tokens, package manager, npm install, or Node runtime are required for deployment.
- Application code is supplied under LICENSE. Third-party services and libraries keep their own terms/licenses.

## Validation performed

JavaScript syntax and automated tests passed for video URL parsing, rejection of deceptive domains, state validation, clock compensation, drift threshold, play/pause/load/cue commands, and stale message rejection. The host UI, real YouTube iframe initialization, queue entry, and invite generation were checked in a browser. A second browser tab joined the flow, but a complete peer data-channel connection and synchronized audible playback could not be verified in the cloud test environment. Real two-device testing, particularly on iPhone/Brave and across different networks, is still required. This package is an initial implementation, not a guarantee of cross-network playback reliability.

## Official references

- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://developers.google.com/youtube/iframe_api_reference
- https://peerjs.com/client/faq
