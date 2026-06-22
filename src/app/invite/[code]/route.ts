import { NextRequest, NextResponse } from "next/server";

const SITE_ORIGIN = "https://bumum.vercel.app";
const OPEN_GRAPH_TITLE = "부맘 가족 초대";
const OPEN_GRAPH_DESCRIPTION =
  "가족에게 초대장이 왔어요! 같이 마음을 나누어 볼래요?";
const OPEN_GRAPH_IMAGE_URL = `${SITE_ORIGIN}/images/opengraph.jpg`;

const DEFAULT_IOS_APP_STORE_URL =
  "https://apps.apple.com/kr/search?term=%EB%B6%80%EB%A7%98";
const DEFAULT_ANDROID_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.naivy.bumum";
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
  /bot|crawler|spider|crawling|facebookexternalhit|facebot|twitterbot|slackbot|discordbot|linkedinbot|telegrambot|whatsapp|kakaotalk|kakao|line|naver|skypeuripreview|pinterest|embedly/i;

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

  return redirectToPlatformStore(request);
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
