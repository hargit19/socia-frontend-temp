import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveGoLink } from '../api/api';
import { SocialLogo } from '../components/ui';

const S = `
:root{
  --blue:#1565C0;--blue-mid:#1E88E5;--navy:#1A2B4A;--slate:#64748B;
  --green-mid:#43A047;--border:#E2E8F0;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;}
.go-page{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#10213f,#1565C0);}
.go-card{width:min(100%,460px);background:#fff;border-radius:20px;padding:44px 38px;text-align:center;box-shadow:0 24px 65px rgba(0,0,0,.3);}
.go-logo{display:flex;justify-content:center;margin-bottom:20px;}
.go-emoji{font-size:40px;margin-bottom:10px;}
.go-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:800;color:var(--navy);margin-bottom:8px;}
.go-sub{font-size:13.5px;color:var(--slate);line-height:1.6;margin-bottom:22px;}
.go-sub strong{color:var(--navy);}
.go-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;border:none;background:var(--blue);color:#fff;text-decoration:none;transition:background .15s;}
.go-btn:hover{background:var(--navy);}
.go-countdown{font-size:12px;color:var(--slate);margin-top:14px;}
.go-error{font-size:14px;color:#C62828;}
.go-platform{display:inline-block;margin-top:6px;padding:3px 10px;border-radius:20px;background:#E3F2FD;color:var(--blue);font-size:11.5px;font-weight:700;}
`;

export default function GoRedirect() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    resolveGoLink(slug)
      .then(r => setData(r.data))
      .catch(() => setError('This link is invalid or has expired.'));
  }, [slug]);

  useEffect(() => {
    if (!data?.external_url) return;
    if (seconds <= 0) {
      window.location.href = data.external_url;
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [data, seconds]);

  return (
    <>
      <style>{S}</style>
      <main className="go-page">
        <section className="go-card">
          <div className="go-logo"><SocialLogo /></div>
          {error && <div className="go-error">{error}</div>}
          {!error && !data && <div className="go-sub">Loading your campaign link…</div>}
          {!error && data && (
            <>
              <div className="go-emoji">{data.emoji || '🌍'}</div>
              <div className="go-title">{data.title}</div>
              <div className="go-sub">
                Brought to you by <strong>{data.influencer_name}</strong> in support of <strong>{data.organization}</strong>.
                <div className="go-platform">{data.platform}</div>
              </div>
              {data.external_url ? (
                <>
                  <a className="go-btn" href={data.external_url}>Continue to Campaign →</a>
                  <div className="go-countdown">Redirecting to crowdfunding platform website{seconds > 0 ? ` in ${seconds}s…` : '…'}</div>
                </>
              ) : (
                <div className="go-sub">This campaign's external link isn't available yet. Please check back soon.</div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
