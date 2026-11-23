# Code Cemetery — Pre Alpha R5 (`v0.0.5-pre-alpha`)

**Where ideas rest. Where second chances begin.**

Code Cemetery is a React/TypeScript + Firebase + Vercel project with two visual worlds: **Heaven Mode** (warm marble, sunrise, lavender) and **Hell Mode** (dark stone, moonlight, bats, ember highlights).

This README covers **Windows 10/11**, **macOS**, and general running instructions. You do **not** need NVM to run the project.

> **R5 auth-fix update:** Google/GitHub OAuth errors now show their Firebase error codes instead of a generic alert; compile-time issues in the navigation and archive downloads are corrected. `npm run verify:firebase` checks your local Firebase configuration syntax without sending credentials anywhere. The existing `.env.local` is preserved when distributing this repair ZIP. See [AUTH_FIX_NOTES.md](AUTH_FIX_NOTES.md).

> **R5 update:** Project-owner star visuals are now completely distinct: **Purple / Silver** uses a shield with a five-point star (1–14 published projects), while **Purple / Gold** uses a crowned medallion with an eight-point star (15+). Both tiers have explicit rank and threshold labels on profile badges, the developer directory, the Star Atlas, and its interactive simulator. See [PRE_ALPHA_R5_RELEASE.md](PRE_ALPHA_R5_RELEASE.md).

> **Earlier R4 update:** The original operating-system dropdown menus (white backgrounds / Windows-blue highlights) have been replaced throughout the app with branded Heaven/Hell controls. The star simulator, graveyard filters, GitHub sorting, project burial, reporting, and admin tier selection use these controls. This design is retained in the repaired release.

## Requirements (both platforms)

- **Node.js 24.12.0 or newer**. Install the latest suitable Node 24 from <https://nodejs.org/en/download> if needed.
- **npm 11 or newer** (ships with recent Node releases).
- Internet access to download packages on the first run.
- VS Code or another editor, and a terminal.

Verify your installation:

```text
node -v
npm -v
```

**Important:** `npm install 24` does *not* upgrade Node.js. It installs a separate npm package named `24`. Do not run `nvm` on Windows unless you deliberately installed a Windows-specific Node Version Manager; on macOS, NVM is optional.

## Run on Windows (VS Code PowerShell)

1. Extract the ZIP and open the **Code-Cemetery-Pre-Alpha** folder in VS Code (the folder containing `package.json`).
2. Choose **Terminal → New Terminal**, then run the following **one command at a time**:

```powershell
node -v
npm -v
npm install
npm run verify:firebase
npm run dev
```

3. Open the **Local** URL printed by Vite, normally **http://localhost:5173/**.
4. To stop the server, press **Ctrl+C** in that terminal.

If you previously ran `npm install 24` by mistake, remove that unrelated package first:

```powershell
npm uninstall 24
npm install
```

If PowerShell prevents running `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev` instead, or use the VS Code **Command Prompt** terminal. You do not need to lower your system-wide PowerShell execution policy.

For a clean reinstall **only when troubleshooting a failed installation**:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run verify:firebase
npm run dev
```

## Run on macOS (Terminal / VS Code)

1. Extract the ZIP and open **Code-Cemetery-Pre-Alpha** (the folder containing `package.json`).
2. Check Node.js and install the dependencies:

```bash
node -v
npm -v
npm install
npm run verify:firebase
npm run dev
```

3. Open the **Local** URL printed by Vite, normally **http://localhost:5173/**.
4. To stop the server, press **Control+C**.

On macOS, **if NVM is already installed** and Node.js is older than 24.12, you can run `nvm install 24` and `nvm use 24`. Alternatively, install Node.js from its official website. NVM is not a prerequisite.

For a clean reinstall only when needed:

```bash
rm -rf node_modules
npm install
npm run verify:firebase
npm run dev
```

## Understand which features work with which server

| How you start | What runs | What is available |
|---|---|---|
| `npm run dev` | Vite frontend | UI, Heaven/Hell themes, star guide and public GitHub browser; Firebase client features when configured |
| `npx vercel dev` | Frontend plus Vercel `api/` routes | Adds private GitHub imports, server-side newsletter/admin/AI workflows, and other privileged APIs **after** credentials are configured |
| Deployed Vercel project | Build + hosted `api/` routes | Full configured staging environment, subject to correct Firebase rules, secrets and tests |

Without real Firebase configuration, the app deliberately starts in **read-only showcase mode**. It does **not** create sample records in Firestore. The public GitHub username explorer can query public repositories, but **verified imports** need the backend and a linked account.

## Connect Firebase (Windows and macOS)

1. Create or select your own Firebase project in <https://console.firebase.google.com/>.
2. Firebase Console → **Project Settings → General → Your apps → Web app**: copy the web-app values to `.env.local`.
3. Start from the included `.env.example` file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and fill in your own `VITE_FIREBASE_*` settings. **This repair ZIP already contains the original `.env.local` from your upload; do not overwrite it with `.env.example` when upgrading.** These identify your Firebase client app; **do not** put a Firebase private key or GitHub OAuth secret in any `VITE_` variable.
5. Enable **Email/Password, Google, and GitHub** in Firebase Authentication → Sign-in method. For GitHub OAuth, configure the GitHub OAuth App and Firebase-provided callback URL. See [SOCIAL_LOGIN_SETUP.md](SOCIAL_LOGIN_SETUP.md).
6. Add local and deployed domains as authorized domains in Firebase Authentication, as appropriate.
7. Restart the dev server after editing `.env.local`.

The account that owns the Firebase project cannot be determined from the downloaded source; check the Firebase Console's project settings and access control.

## Run the full backend (Windows and macOS)

From the project root, after `npm install`:

```text
npx vercel login
npx vercel link
npx vercel dev
```

Configure the linked Vercel project's **server-only environment variables** (see `.env.server.example`):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_UIDS` for moderator/admin functions
- Optional `GITHUB_TOKEN` for public API rate limits, and `AI_API_URL`, `AI_API_KEY`, `AI_MODEL` for AI explanations

These are **server secrets**, not public `VITE_` variables. Vercel linking and login require an account, and Firebase/Google/GitHub OAuth and cloud permissions must be set up before those features can operate.

After reviewing and backing up existing security rules, deploy the supplied Firestore indexes, Firestore rules, and Storage rules **only to the intended Firebase project**:

```text
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage --project YOUR_REAL_FIREBASE_PROJECT_ID
```

**Warning:** Deploying security rules overwrites rules in the target project. Do not run this on a production database without verifying changes and existing data access.

## How projects are shown

- The **Graveyard** displays multiple tombstone cards in a responsive grid (typically three per row on desktop; fewer on smaller displays).
- The **page scrolls vertically** when there are more projects; this is intentional. Click **Venture deeper** to load more results.
- Clicking a tombstone or **Read the epitaph** opens that **single project's details page**. All project details are not squeezed into a single viewport.
- The **Star Guide** is also an ordinary vertically scrolling page: reputation, membership, and owner explanations are separate sections, not a horizontal carousel.
- All project menus use the same Heaven/Hell dropdown design; project data and existing IDs are preserved.

## Build and validation

```text
npm run build
npm run lint
npm run test:badges
npm run test:github
npm run test:release
```

The repaired source ZIP intentionally **excludes `node_modules`** but **includes a synchronized `package-lock.json` and your original `.env.local`**. Run `npm ci` for a reproducible install (or `npm install` if you need to update dependencies). Do not overwrite `.env.local`; do not commit it to GitHub.

See [AUTH_FIX_NOTES.md](AUTH_FIX_NOTES.md) for this repair and [PRE_ALPHA_R5_RELEASE.md](PRE_ALPHA_R5_RELEASE.md) for the earlier Pre-Alpha release. Windows/macOS installation instructions are included above.

**Release status:** Pre-Alpha / development. A complete live authentication and Vercel backend integration test is still required before production deployment; the checkout and project-transfer flows are not implemented.

## Authentication troubleshooting (local setup, no Vercel required)

1. Open **http://localhost:5173/login** and select **Continue with Google**.
2. If the popup closes or sign-in fails, read the **Firebase error code** shown inside the red form message.
3. In Chrome, press **Option+Command+J** on macOS or **Ctrl+Shift+J** on Windows and check the browser Console. This is *not* the VS Code terminal.
4. Use `npm run verify:firebase` to confirm all six `.env.local` fields are present. The check cannot determine whether the API key is accepted by Firebase.
5. Verify Google is enabled in **Firebase Authentication → Sign-in method**, and `localhost` is listed in **Settings → Authorized domains**.
6. The **Backend API offline** banner is unrelated to client-side Google sign-in; running `npm run dev` is sufficient for this test.
7. If the error says **Firestore profile setup failed**, Google OAuth succeeded but the `users/{uid}` write was denied; verify the deployed rules and user fields.

When publishing to GitHub, **do not commit `.env.local`**. Although web config fields are not service-account secrets, keep each environment's configuration separately managed. Do not add Firebase service-account JSON or GitHub client secrets to the repository.
