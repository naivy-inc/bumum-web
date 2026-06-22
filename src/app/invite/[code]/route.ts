import { NextRequest, NextResponse } from "next/server";

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

const redirectToPlatformStore = (request: NextRequest) =>
  NextResponse.redirect(
    getStoreRedirectUrl(request.headers.get("user-agent") ?? ""),
    307,
  );

export const GET = redirectToPlatformStore;
export const HEAD = redirectToPlatformStore;
