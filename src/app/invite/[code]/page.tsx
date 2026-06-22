import type { Metadata } from "next";
import Image from "next/image";

type InvitationPageProps = {
  params: Promise<{
    code: string;
  }>;
};

const INVITATION_CODE_MAX_LENGTH = 32;
const iosStoreUrl = process.env.NEXT_PUBLIC_IOS_APP_STORE_URL;
const androidStoreUrl = process.env.NEXT_PUBLIC_ANDROID_PLAY_STORE_URL;

const normalizeInvitationCode = (code: string) =>
  decodeURIComponent(code)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, INVITATION_CODE_MAX_LENGTH);

export const metadata: Metadata = {
  title: "가족 초대",
  description: "부맘 가족 초대를 확인해 주세요.",
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { code } = await params;
  const invitationCode = normalizeInvitationCode(code);
  const inviteUrl = `https://bumom.xyz/invite/${encodeURIComponent(
    invitationCode,
  )}`;
  const hasStoreLink = Boolean(iosStoreUrl || androidStoreUrl);

  return (
    <main className="page-shell">
      <section className="invite-panel" aria-labelledby="invite-title">
        <div className="visual-band">
          <Image
            className="app-icon"
            src="/images/app-icon.png"
            alt=""
            width={48}
            height={48}
            priority
          />
          <div className="family-visual" aria-hidden="true">
            <Image
              src="/images/family-parent-dad.svg"
              alt=""
              width={118}
              height={142}
            />
            <Image
              src="/images/family-children-left.svg"
              alt=""
              width={118}
              height={142}
            />
            <Image
              src="/images/family-parent-mom.svg"
              alt=""
              width={118}
              height={142}
            />
          </div>
        </div>
        <div className="content">
          <p className="eyebrow">가족 초대</p>
          <h1 id="invite-title">부맘에서 가족 초대가 도착했어요.</h1>
          <p className="description">
            앱이 설치되어 있다면 아래 버튼으로 초대 수락을 이어가세요. 앱이
            열리지 않으면 초대코드를 앱에서 직접 입력할 수 있습니다.
          </p>

          <div className="code-box" aria-label="초대코드">
            <p className="code-label">초대코드</p>
            <p className="code-value">{invitationCode || "확인 필요"}</p>
          </div>

          <div className="actions">
            {invitationCode ? (
              <a className="button button-primary" href={inviteUrl}>
                앱에서 초대 열기
              </a>
            ) : null}
            {iosStoreUrl ? (
              <a className="button button-secondary" href={iosStoreUrl}>
                App Store에서 설치
              </a>
            ) : null}
            {androidStoreUrl ? (
              <a className="button button-secondary" href={androidStoreUrl}>
                Google Play에서 설치
              </a>
            ) : null}
            {!hasStoreLink ? (
              <p className="support-text">
                앱 설치 링크는 스토어 공개 후 이 페이지에 연결됩니다.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
