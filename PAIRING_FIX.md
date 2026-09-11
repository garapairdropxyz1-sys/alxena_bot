# ALXENA-BOT — Pairing Fix

## What was changed

- Pinned `@sairidev/baileys-new` to `0.3.21` so `package.json` and `package-lock.json` stay consistent.
- Increased the initial pairing wait from 500 ms to 3000 ms.
- Wrapped the pairing-code request with 3 attempts and a 3-second retry delay so a transient `428 Connection Closed` does not become an unhandled rejection.
- No AIRich/game code was removed.

## First run after replacing the project

If this bot has been paired before, remove the old authentication folder before trying again:

```bash
rm -rf session
```

Then install the exact locked dependencies:

```bash
npm ci
```

Start:

```bash
node index.js
```

Enter the WhatsApp number in international format, for example `6282319957951`.

If WhatsApp has an existing linked session for this bot, remove the old linked device from WhatsApp before pairing again.
