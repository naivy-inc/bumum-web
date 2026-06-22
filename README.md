# Bumum Web

Small web surface for Bumum invitation links.

## Routes

- `/invite/[code]`: redirects users without the app to the platform store
- `/.well-known/apple-app-site-association`: iOS Universal Links verification
- `/.well-known/assetlinks.json`: Android App Links verification

## Vercel

1. Import `https://github.com/naivy-inc/bumum-web` in Vercel.
2. Use the Vercel production domain `bumum.vercel.app`.
3. Set store URL environment variables when the public store pages are ready:
   - `IOS_APP_STORE_URL`
   - `ANDROID_PLAY_STORE_URL`

If Google Play App Signing is enabled, replace the Android fingerprint in `public/.well-known/assetlinks.json` with the Play Console app signing certificate SHA-256 fingerprint.
