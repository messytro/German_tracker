# B2 Quest Log

A German B2 consolidation tracker: 8-week task schedule, 1,361-word vocab
trainer with spaced repetition + exam mode, an AI-checked writing log,
a speaking log, a listening log, a grammar drill section, and a dashboard —
all in one static site, with optional cross-device sync.

**This version syncs via Supabase and runs on GitHub Pages (free forever,
no serverless functions, no credits).** It reuses the same Supabase
project as your day planner — you just need one extra table in it.

## Deploying to GitHub Pages

1. Push this whole folder to a GitHub repo — `index.html`, `config.js`,
   `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` all sitting
   directly at the repo root (not nested in a subfolder).
2. Repo Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)` → Save.
3. Also add an empty file named `.nojekyll` at the root (Add file → Create
   new file) so GitHub serves the files as-is.
4. You'll get a URL like `https://yourusername.github.io/your-repo/`.

The old `netlify.toml`, `package.json`, and `netlify/functions/sync.js`
are no longer used — safe to delete them from the repo, or just leave
them, GitHub Pages ignores anything it doesn't recognize.

## Setting up sync (reuses your day planner's Supabase project)

1. Open `config.js` and paste in the **exact same** `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` you already used for the day planner's `config.js`.
2. In that Supabase project's **SQL Editor**, run this once:

   ```sql
   create table b2quest_sync (
     code text primary key,
     data jsonb not null,
     updated_at timestamptz not null default now()
   );

   alter table b2quest_sync enable row level security;

   -- No accounts here, by design — same trust model as before:
   -- anyone who knows your exact sync code can read/write this table.
   -- Keep the code unguessable, same as always.
   create policy "open_by_code" on b2quest_sync for all
     using (true) with check (true);
   ```

3. Push these files to GitHub (Pages auto-redeploys), open the app, go to
   **Home → Cross-Device Sync**, enter any sync code (4+ characters,
   something only you'd guess), hit Connect. Enter the *same* code on
   your other devices.

Everything else about how sync behaves is unchanged: each device pushes
changes to the cloud a couple seconds after you make them, and pulls the
newer version on load if the cloud copy is more recent than what's
stored locally. Last-write-wins, not real-time collaborative — fine for
one person on several devices.

**No accounts, no passwords.** Anyone who knows your exact sync code
could read or overwrite your data via this table, so don't use something
guessable.

## Local-only use (no sync)

The app works fully offline with just browser storage if you never set
up a sync code — Export/Import backup buttons on the homepage let you
move data between devices manually instead.
