# Music Room v6 — Mayalu 💋

This builds on the existing v5 PeerJS / YouTube player. Social accounts, friendships, chat, and playback history are stored in **Supabase**; GitHub Pages remains the frontend host. The original PeerJS room controls still run separately.

## One-time setup (required)

1. Create a Supabase project at https://supabase.com . Use a project only you control.
2. In **Authentication → Providers → Email**, enable Email signups and **disable Confirm email** (this username-only design uses internal placeholder email addresses, not real inboxes). Set minimum password length to **at least 6**. Do not use one-character passwords. Turn on CAPTCHA/rate limits if available. Since placeholder emails cannot receive recovery messages, forgotten passwords need admin intervention; do not use important passwords or sensitive personal messages in this experimental app.
3. Open **SQL Editor** and run the complete `supabase.sql` once. It creates tables and row-level access rules.
4. In **Project Settings → API**, copy your project URL and **publishable / anon key** into `social-config.js`. **Never use the service_role key** in browser files.
5. In **Database → Publications**, enable `messages` and `friendships` for `supabase_realtime` if you want immediate updates. The app also polls for messages and friend updates, so Realtime isn't mandatory.
6. Upload **all three files** (`index.html`, `social.js`, `social-config.js`) to the root of your GitHub Pages `music-room` repository. `supabase.sql` stays local. Commit and wait for Pages to deploy. Hard-refresh both devices.
7. Register two separate usernames on different devices. Add the other by username; accept the request; open Chat and click **Send room invite**. The friend can join from the saved message. Online room presence is refreshed roughly every 20 seconds.

## Features

- Username + password accounts (passwords handled by Supabase Auth, not by JavaScript or your database tables)
- Friend requests, acceptance, online / room presence and one-click Join
- Persistent private 1:1 messages between accepted friends, including clickable room invitations
- Last 15 distinct video IDs from recent playback, with **+ Queue** to replay; history is recorded per signed-in device that plays the track
- Romantic banner: **This is for you, Mayalu 💋💗**
- Existing music player, group PeerJS sync, playlist queue and Aurora UI remain

## Limitations / important notes

- This is a **test build**. It passed JavaScript syntax checks, but **has not been tested live against a Supabase project or across two phones**. Do not treat it as a verified production deployment.
- **Not end-to-end encrypted:** messages are stored in Supabase; RLS restricts ordinary client access, but the project administrator can access them. Do not send sensitive information.
- No self-service password reset with placeholder emails. A real account system should collect a verified recovery email, or use a trusted OAuth provider.
- The current PeerJS room remains a peer-to-peer, link-based room: login protects stored messages, **not the room itself**. Anyone with a room URL can join while the host is online. Do not mistake room links for private access controls.
- YouTube Music playlist titles and contents may still be unavailable through the embedded player. This update does not solve the YouTube metadata limitation.
- Browser autoplay and phone-lock restrictions remain; switching tracks can still require a user gesture on some mobile browsers.
- The history stores the most recently played distinct video IDs, not a complete synchronized group listening audit.
- Presence is approximate and may remain online for up to a minute after a crash.
- Supabase free-tier limits, availability and inactivity policies may change.

## Troubleshooting

- **Setup required:** replace placeholders in `social-config.js` and confirm the Supabase JS library loads.
- **Sign up says confirm email:** disable email confirmation as described above.
- **Permission denied:** run `supabase.sql` and confirm RLS policies and function grants exist.
- **Friend not found:** username is case-insensitive; it must already be registered.
- **Messages missing:** both users must accept friendship. Messages also refresh periodically.
- **History empty:** play a YouTube video; the app reads the embedded player's current video ID when available.
