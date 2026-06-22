import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="invite-panel" aria-labelledby="home-title">
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
          <p className="eyebrow">BUMUM</p>
          <h1 id="home-title">부맘 초대 링크 페이지입니다.</h1>
          <p className="description">
            가족에게 받은 초대 링크를 열면 앱에서 가족 연결을 이어갈 수
            있습니다.
          </p>
          <div className="actions">
            <Link className="button button-primary" href="/invite/ABC123">
              초대 링크 예시 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
