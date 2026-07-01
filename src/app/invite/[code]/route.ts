import { NextRequest, NextResponse } from "next/server";

const SITE_ORIGIN = "https://bumum.vercel.app";
const KAKAO_APP_SCHEME = "kakao1aac84c9cbd5bf3308a437ae9f57d079";
const OPEN_GRAPH_TITLE = "부맘 가족 초대";
const OPEN_GRAPH_DESCRIPTION =
  "가족에게 초대장이 왔어요! 같이 마음을 나누어 볼래요?";
const OPEN_GRAPH_IMAGE_URL = `${SITE_ORIGIN}/images/opengraph.jpg`;

const DEFAULT_IOS_APP_STORE_URL =
  "https://apps.apple.com/kr/search?term=%EB%B6%80%EB%A7%98";
const DEFAULT_ANDROID_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.naivy.bumum.app";
const DEFAULT_DESKTOP_STORE_URL = DEFAULT_IOS_APP_STORE_URL;

const iosAppStoreUrl =
  process.env.IOS_APP_STORE_URL ??
  process.env.NEXT_PUBLIC_IOS_APP_STORE_URL ??
  DEFAULT_IOS_APP_STORE_URL;
const androidPlayStoreUrl =
  process.env.ANDROID_PLAY_STORE_URL ??
  process.env.NEXT_PUBLIC_ANDROID_PLAY_STORE_URL ??
  DEFAULT_ANDROID_PLAY_STORE_URL;

const openGraphCrawlerPattern =
  /bot|crawler|spider|crawling|facebookexternalhit|facebot|twitterbot|slackbot|discordbot|linkedinbot|telegrambot|whatsapp|line|naver|skypeuripreview|pinterest|embedly/i;

const getStoreRedirectUrl = (userAgent: string) => {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (/android/.test(normalizedUserAgent)) {
    return androidPlayStoreUrl;
  }

  if (/(iphone|ipad|ipod)/.test(normalizedUserAgent)) {
    return iosAppStoreUrl;
  }

  return DEFAULT_DESKTOP_STORE_URL;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const isOpenGraphCrawler = (request: NextRequest) =>
  openGraphCrawlerPattern.test(request.headers.get("user-agent") ?? "");

const getCanonicalUrl = (request: NextRequest) =>
  `${SITE_ORIGIN}${request.nextUrl.pathname}`;

const getInvitationCode = (request: NextRequest) =>
  decodeURIComponent(request.nextUrl.pathname.split("/").filter(Boolean)[1] ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const buildAppLinkUrl = (request: NextRequest) => {
  const invitationCode = getInvitationCode(request);
  const searchParams = new URLSearchParams();

  if (invitationCode) {
    searchParams.set("invitationCode", invitationCode);
  }

  return `${KAKAO_APP_SCHEME}://kakaolink${
    searchParams.size ? `?${searchParams.toString()}` : ""
  }`;
};

const buildFallbackHtml = (request: NextRequest) => {
  const canonicalUrl = getCanonicalUrl(request);
  const appLinkUrl = buildAppLinkUrl(request);
  const storeUrl = getStoreRedirectUrl(request.headers.get("user-agent") ?? "");
  const invitationCode = getInvitationCode(request);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(OPEN_GRAPH_TITLE)}</title>
  <meta name="description" content="${escapeHtml(OPEN_GRAPH_DESCRIPTION)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="부맘">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta property="og:description" content="${escapeHtml(
    OPEN_GRAPH_DESCRIPTION,
  )}">
  <meta property="og:image" content="${escapeHtml(OPEN_GRAPH_IMAGE_URL)}">
  <meta property="og:image:secure_url" content="${escapeHtml(
    OPEN_GRAPH_IMAGE_URL,
  )}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta name="twitter:description" content="${escapeHtml(
    OPEN_GRAPH_DESCRIPTION,
  )}">
  <meta name="twitter:image" content="${escapeHtml(OPEN_GRAPH_IMAGE_URL)}">
  <style>
    :root {
      color-scheme: light;
      --background: #faf9f4;
      --surface: #ffffff;
      --foreground: #202124;
      --muted: #686057;
      --border: #e7ded2;
      --primary: #1f7a68;
      --primary-pressed: #176455;
      --shadow: 0 18px 42px rgba(48, 39, 30, 0.12);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; margin: 0; }
    body {
      display: grid;
      place-items: center;
      padding: 32px 18px;
      background: var(--background);
      color: var(--foreground);
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(100%, 440px);
      padding: 28px 24px 24px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .eyebrow {
      margin: 0 0 8px;
      color: var(--primary);
      font-size: 13px;
      font-weight: 700;
    }
    h1 {
      margin: 0;
      font-size: 26px;
      line-height: 1.28;
      letter-spacing: 0;
    }
    p {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.55;
    }
    .code {
      margin-top: 18px;
      padding: 14px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fffaf6;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.1;
      text-align: center;
    }
    .actions {
      display: grid;
      gap: 10px;
      margin-top: 22px;
    }
    a {
      display: inline-flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 0 16px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 800;
      -webkit-tap-highlight-color: transparent;
    }
    .primary {
      background: var(--primary);
      color: #ffffff;
    }
    .primary:active { background: var(--primary-pressed); }
    .secondary {
      border: 1px solid var(--border);
      background: #ffffff;
      color: var(--foreground);
    }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">BUMUM</p>
    <h1>부맘 초대 링크를 열어주세요.</h1>
    <p>앱이 설치되어 있다면 앱에서 가족 연결을 이어갈 수 있습니다.</p>
    ${
      invitationCode
        ? `<div class="code" aria-label="초대코드">${escapeHtml(
            invitationCode,
          )}</div>`
        : ""
    }
    <div class="actions">
      <a class="primary" href="${escapeHtml(appLinkUrl)}">앱에서 열기</a>
      <a class="secondary" href="${escapeHtml(storeUrl)}">스토어로 이동</a>
    </div>
  </main>
  <script>
    (function () {
      var appLinkUrl = ${JSON.stringify(appLinkUrl)};
      var storeUrl = ${JSON.stringify(storeUrl)};
      var startedAt = Date.now();

      setTimeout(function () {
        if (Date.now() - startedAt < 1800 && !document.hidden) {
          window.location.href = storeUrl;
        }
      }, 1200);

      window.location.href = appLinkUrl;
    })();
  </script>
</body>
</html>`;
};

const buildOpenGraphHtml = (request: NextRequest) => {
  const canonicalUrl = getCanonicalUrl(request);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(OPEN_GRAPH_TITLE)}</title>
  <meta name="description" content="${escapeHtml(OPEN_GRAPH_DESCRIPTION)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="부맘">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta property="og:description" content="${escapeHtml(
    OPEN_GRAPH_DESCRIPTION,
  )}">
  <meta property="og:image" content="${escapeHtml(OPEN_GRAPH_IMAGE_URL)}">
  <meta property="og:image:secure_url" content="${escapeHtml(
    OPEN_GRAPH_IMAGE_URL,
  )}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(OPEN_GRAPH_TITLE)}">
  <meta name="twitter:description" content="${escapeHtml(
    OPEN_GRAPH_DESCRIPTION,
  )}">
  <meta name="twitter:image" content="${escapeHtml(OPEN_GRAPH_IMAGE_URL)}">
</head>
<body></body>
</html>`;
};

const openGraphHeaders = {
  "cache-control": "public, max-age=300, s-maxage=86400",
  "content-type": "text/html; charset=utf-8",
};

const redirectToPlatformStore = (request: NextRequest) =>
  NextResponse.redirect(
    getStoreRedirectUrl(request.headers.get("user-agent") ?? ""),
    307,
  );

export const GET = (request: NextRequest) => {
  if (isOpenGraphCrawler(request)) {
    return new NextResponse(buildOpenGraphHtml(request), {
      headers: openGraphHeaders,
    });
  }

  return new NextResponse(buildFallbackHtml(request), {
    headers: openGraphHeaders,
  });
};

export const HEAD = (request: NextRequest) => {
  if (isOpenGraphCrawler(request)) {
    return new NextResponse(null, {
      headers: openGraphHeaders,
      status: 200,
    });
  }

  return redirectToPlatformStore(request);
};
