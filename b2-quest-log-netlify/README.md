# B2 Quest Log

A German B2 consolidation tracker: 8-week task schedule, 1,361-word vocab
trainer with spaced repetition + exam mode, an AI-checked writing log,
a speaking log, a listening log, a grammar drill section, and a dashboard —
all in one static site, with optional cross-device sync.

## Deploying to Netlify (recommended: via GitHub)

1. Create a new GitHub repository and push this entire folder to it
   (keep the folder structure exactly as-is — `index.html`, `netlify.toml`,
   `package.json`, and `netlify/functions/sync.js` all need to stay where they are).
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → connect GitHub → pick the repo.
3. Netlify will auto-detect `netlify.toml`. Leave the build settings as
   detected and click **Deploy**. It will run `npm install` for you and
   bundle the sync function automatically.
4. Once deployed, you'll get a URL like `https://your-site.netlify.app`.
   Open it on any device.

### Alternative: Netlify CLI (no GitHub needed)

```bash
npm install
npm install -g netlify-cli
netlify deploy --prod
```

Follow the prompts (log in / create a site). The CLI bundles the function
correctly, unlike a plain drag-and-drop of the folder into the Netlify
dashboard — drag-and-drop only works for the static `index.html` and won't
set up the serverless function, so cross-device sync won't work that way.

## Using cross-device sync

Once deployed with the function live, open **Home → Cross-Device Sync**
in the app. Enter any sync code (4+ characters, something only you'd
guess) on one device, hit Connect. Enter the *same* code on your other
devices. Each device automatically pushes changes to the cloud a couple
seconds after you make them, and pulls the newer version on load if the
cloud copy is more recent than what's stored locally.

This is last-write-wins, not real-time collaborative sync — fine for one
person using several devices, not designed for two people editing
simultaneously.

**No accounts, no passwords.** Anyone who knows your exact sync code could
read or overwrite your data via the API, so don't use something guessable.

## Local-only use (no sync)

The app works fully offline with just browser storage if you never set
up a sync code — Export/Import backup buttons on the homepage let you
move data between devices manually instead.
