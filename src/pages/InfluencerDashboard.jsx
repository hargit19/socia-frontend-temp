import { useState, useEffect } from 'react';
import { registerInfluencer, updateInfluencer, enrollProject, getProjectSearch, getInfluencerActiveProjects, signInInfluencer, signUpInfluencer, getOffers, respondToOffer, getInfluencerEarnings } from '../api/api';
import { yen } from '../components/ui';

// ── Design tokens (same as influencer HTML) ──────────────────
const S = `
:root{
  --blue:#1565C0;--blue-mid:#1E88E5;--blue-light:#E3F2FD;
  --green:#2E7D32;--green-mid:#43A047;--green-light:#E8F5E9;
  --orange:#E65100;--orange-mid:#FB8C00;--orange-light:#FFF3E0;
  --navy:#1A2B4A;--navy-mid:#2C3E6B;--slate:#64748B;--slate-light:#94A3B8;
  --bg:#F4F7FB;--white:#FFFFFF;--border:#E2E8F0;--text:#1A2B4A;
  --red:#C62828;--red-light:#FFEBEE;--sidebar-w:240px;--header-h:64px;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
.layout{display:flex;min-height:100vh;}
.sidebar{width:var(--sidebar-w);background:var(--navy);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto;}
.sidebar-logo{display:flex;align-items:center;gap:10px;padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,0.08);}
.logo-text{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:20px;color:#fff;letter-spacing:0.5px;}
.sidebar-user{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);}
.user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--blue-mid),var(--green-mid));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;}
.user-name{font-size:13px;font-weight:600;color:#fff;}
.user-handle{font-size:11px;color:rgba(255,255,255,0.5);}
.sidebar-section{padding:16px 12px 8px;}
.sidebar-section-label{font-size:10px;font-weight:700;letter-spacing:1.5px;color:rgba(255,255,255,0.35);text-transform:uppercase;padding:0 8px 8px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s;color:rgba(255,255,255,0.6);font-size:13.5px;font-weight:500;margin-bottom:2px;}
.nav-item:hover{background:rgba(255,255,255,0.08);color:#fff;}
.nav-item.active{background:rgba(30,136,229,0.25);color:#fff;}
.nav-item.active .nav-icon{color:var(--blue-mid);}
.nav-icon{font-size:16px;width:18px;text-align:center;}
.nav-badge{margin-left:auto;background:var(--orange-mid);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px;}
.nav-item.locked{opacity:0.4;cursor:not-allowed;}
.nav-item.locked:hover{background:transparent;color:rgba(255,255,255,0.6);}
.nav-item.locked .nav-badge{background:rgba(255,255,255,0.18);}
.sidebar-step{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s;color:rgba(255,255,255,0.5);font-size:12.5px;margin-bottom:2px;}
.sidebar-step:hover{color:rgba(255,255,255,0.85);}
.sidebar-step.done .step-dot{background:var(--green-mid);}
.step-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);flex-shrink:0;}
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.topbar{height:var(--header-h);background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:50;}
.topbar-breadcrumb{flex:1;font-size:13px;color:var(--slate);}
.topbar-breadcrumb span{color:var(--text);font-weight:600;}
.topbar-actions{display:flex;align-items:center;gap:12px;}
.icon-btn{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--border);cursor:pointer;font-size:16px;transition:all 0.15s;position:relative;}
.icon-btn:hover{background:var(--border);}
.notif-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;background:var(--orange-mid);border-radius:50%;border:2px solid #fff;}
.page-content{padding:28px;flex:1;}
.page-header{margin-bottom:24px;}
.page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800;color:var(--navy);}
.page-subtitle{font-size:13.5px;color:var(--slate);margin-top:3px;}
.card{background:var(--white);border-radius:14px;border:1px solid var(--border);padding:22px;}
.card-title{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;color:var(--navy);margin-bottom:4px;}
.card-sub{font-size:12px;color:var(--slate);margin-bottom:16px;}
.stat-card{background:var(--white);border-radius:14px;border:1px solid var(--border);padding:20px;display:flex;align-items:flex-start;gap:16px;}
.stat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.stat-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800;color:var(--navy);}
.stat-label{font-size:12px;color:var(--slate);margin-top:2px;}
.stat-delta{font-size:12px;font-weight:600;margin-top:6px;}
.stat-delta.up{color:var(--green-mid);}
.stat-delta.down{color:var(--red);}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.grid-21{display:grid;grid-template-columns:2fr 1fr;gap:20px;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:9px;font-size:13.5px;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
.btn-primary{background:var(--blue);color:#fff;}
.btn-primary:hover{background:var(--navy-mid);}
.btn-green{background:var(--green-mid);color:#fff;}
.btn-green:hover{background:var(--green);}
.btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--navy);}
.btn-outline:hover{border-color:var(--blue-mid);color:var(--blue);}
.btn-danger{background:var(--red-light);color:var(--red);}
.btn-danger:hover{background:var(--red);color:#fff;}
.btn-sm{padding:6px 14px;font-size:12.5px;border-radius:7px;}
.form-group{margin-bottom:18px;}
.form-label{display:block;font-size:12.5px;font-weight:600;color:var(--navy);margin-bottom:6px;}
.form-input{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:9px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:var(--navy);background:var(--white);transition:border 0.15s;outline:none;}
.form-input:focus{border-color:var(--blue-mid);}
.form-select{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:9px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:var(--navy);background:var(--white);outline:none;cursor:pointer;}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;}
.badge-blue{background:var(--blue-light);color:var(--blue);}
.badge-green{background:var(--green-light);color:var(--green);}
.badge-orange{background:var(--orange-light);color:var(--orange);}
.badge-red{background:var(--red-light);color:var(--red);}
.badge-gray{background:#F1F5F9;color:var(--slate);}
.stepper{display:flex;align-items:center;gap:0;margin-bottom:32px;}
.step-item{display:flex;flex-direction:column;align-items:center;position:relative;flex:1;}
.step-item:not(:last-child)::after{content:'';position:absolute;top:18px;left:calc(50% + 18px);right:calc(-50% + 18px);height:2px;background:var(--border);}
.step-item.done:not(:last-child)::after{background:var(--blue-mid);}
.step-circle{width:36px;height:36px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--slate);background:#fff;transition:all 0.2s;position:relative;z-index:1;}
.step-item.done .step-circle{background:var(--blue-mid);border-color:var(--blue-mid);color:#fff;}
.step-item.current .step-circle{border-color:var(--blue-mid);color:var(--blue-mid);background:var(--blue-light);}
.step-label{font-size:11.5px;font-weight:600;color:var(--slate);margin-top:6px;text-align:center;}
.step-item.done .step-label,.step-item.current .step-label{color:var(--blue);}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{text-align:left;font-size:11.5px;font-weight:700;letter-spacing:0.5px;color:var(--slate);text-transform:uppercase;padding:10px 16px;border-bottom:1px solid var(--border);background:var(--bg);}
tbody td{padding:13px 16px;font-size:13.5px;border-bottom:1px solid var(--border);color:var(--text);}
tbody tr:hover{background:#F8FAFC;}
tbody tr:last-child td{border-bottom:none;}
.progress-wrap{background:var(--bg);border-radius:10px;height:8px;overflow:hidden;}
.progress-bar{height:100%;border-radius:10px;transition:width 0.5s;}
.upload-box{border:2px dashed var(--border);border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:border-color 0.15s;}
.upload-box:hover{border-color:var(--blue-mid);background:var(--blue-light);}
.upload-icon{font-size:32px;margin-bottom:8px;}
.upload-text{font-size:13px;color:var(--slate);}
.upload-text strong{color:var(--blue);}
.social-row{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border:1.5px solid var(--border);border-radius:12px;margin-bottom:10px;}
.social-row.connected{border-color:var(--green-mid);background:var(--green-light);}
.social-left{display:flex;gap:12px;align-items:center;}
.social-icon{font-size:22px;}
.social-name{font-weight:600;font-size:14px;}
.social-handle{font-size:12px;color:var(--slate);}
.platform-pill{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;border:1.5px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;margin:3px;}
.platform-pill.active{border-color:var(--blue-mid);background:var(--blue-light);color:var(--blue);}
.platform-pill:hover{border-color:var(--blue-mid);}
.timeline{position:relative;padding-left:28px;}
.timeline::before{content:'';position:absolute;left:10px;top:0;bottom:0;width:2px;background:var(--border);}
.timeline-item{position:relative;margin-bottom:20px;}
.timeline-dot{position:absolute;left:-23px;top:3px;width:12px;height:12px;border-radius:50%;border:2px solid var(--blue-mid);background:#fff;}
.timeline-dot.done{background:var(--green-mid);border-color:var(--green-mid);}
.timeline-title{font-weight:600;font-size:13.5px;color:var(--navy);}
.timeline-meta{font-size:12px;color:var(--slate);margin-top:2px;}
.notif-item{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border);}
.notif-item:last-child{border-bottom:none;}
.notif-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.notif-text{font-size:13px;line-height:1.4;}
.notif-time{font-size:11px;color:var(--slate);margin-top:3px;}
.kpi-mini{text-align:center;padding:16px;border-radius:10px;background:var(--bg);}
.kpi-val{font-size:20px;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;}
.kpi-lbl{font-size:11.5px;color:var(--slate);margin-top:3px;}
.tag{display:inline-block;padding:2px 8px;border-radius:6px;background:var(--blue-light);color:var(--blue);font-size:11.5px;font-weight:600;margin:2px;}
.proj-card{background:var(--white);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:box-shadow 0.2s,transform 0.2s;cursor:pointer;}
.proj-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.08);transform:translateY(-2px);}
.proj-card-img{height:100px;display:flex;align-items:center;justify-content:center;font-size:32px;}
.proj-card-body{padding:16px;}
.proj-card-title{font-weight:700;font-size:14px;color:var(--navy);margin-bottom:4px;}
.proj-card-brand{font-size:12px;color:var(--slate);margin-bottom:10px;}
.proj-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px;}
.verify-step{display:flex;gap:14px;align-items:flex-start;padding:16px;border:1.5px solid var(--border);border-radius:12px;margin-bottom:12px;transition:border-color 0.15s;}
.verify-step.active{border-color:var(--blue-mid);background:var(--blue-light);}
.verify-step.done{border-color:var(--green-mid);background:var(--green-light);}
.vs-num{width:28px;height:28px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--slate);flex-shrink:0;}
.verify-step.active .vs-num{background:var(--blue-mid);color:#fff;}
.verify-step.done .vs-num{background:var(--green-mid);color:#fff;}
.mt-20{margin-top:20px;}
.mt-12{margin-top:12px;}
.flex{display:flex;}
.items-center{align-items:center;}
.justify-between{justify-content:space-between;}
.gap-12{gap:12px;}
.gap-16{gap:16px;}
.alert-banner{background:var(--orange-light);border:1px solid var(--orange-mid);border-radius:10px;padding:12px 16px;font-size:12.5px;color:var(--orange);margin-bottom:18px;}
.success-banner{background:var(--green-light);border:1px solid var(--green-mid);border-radius:10px;padding:12px 16px;font-size:12.5px;color:var(--green);margin-bottom:18px;}
.auth-page{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#10213f,#1565C0);}
.auth-card{width:min(100%,880px);display:grid;grid-template-columns:.85fr 1.15fr;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 65px rgba(0,0,0,.3);}
.auth-side{padding:46px 38px;background:linear-gradient(160deg,#1A2B4A,#1565C0);color:#fff;display:flex;flex-direction:column;justify-content:space-between;}.auth-side h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:34px;line-height:1.15;margin:24px 0 12px;}.auth-side p{line-height:1.6;color:rgba(255,255,255,.8)}
.auth-panel{padding:42px;}.auth-panel h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:25px;margin-bottom:6px}.auth-panel>p{font-size:14px;color:var(--slate);margin-bottom:22px}.auth-tabs{display:flex;background:var(--bg);padding:4px;border-radius:10px;margin-bottom:20px}.auth-tabs button{flex:1;border:0;background:transparent;padding:9px;border-radius:7px;font:600 13px 'DM Sans',sans-serif;color:var(--slate);cursor:pointer}.auth-tabs button.active{background:#fff;color:var(--navy);box-shadow:0 1px 4px rgba(0,0,0,.12)}.auth-error{background:var(--red-light);color:var(--red);border-radius:8px;padding:10px 12px;font-size:12.5px;margin-bottom:14px}.auth-form{display:grid;gap:14px}.auth-form .form-group{margin:0}.auth-note{font-size:12px;color:var(--slate);line-height:1.5}.auth-form .btn{justify-content:center}@media(max-width:700px){.auth-card{grid-template-columns:1fr}.auth-side{padding:28px;min-height:190px}.auth-side h1{font-size:27px;margin:12px 0}.auth-panel{padding:28px 22px}}
`;

const STEPS_REG = ['Profile', 'Link SNS', 'KYC', 'Payment'];
const CAUSE_OPTS = ['🏫 Education','🍽️ Food Relief','🌍 Global Aid','🏥 Healthcare','♻️ Environment','🏘️ Housing','🤝 Refugees','👶 Children'];
const GATED_PAGES = ['proj-active', 'proj-search', 'proj-apply', 'post-submit', 'post-review', 'analytics', 'earnings'];
const isRegistrationComplete = (u) => Boolean(u && u.phone && u.id_number && u.bank_account);

export default function InfluencerDashboard() {
  const [page, setPage] = useState('reg-overview');
  const [regStep, setRegStep] = useState(3);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', country: 'Japan', bio: '',
    causes: [],
    snsAccounts: [],
    idType: 'Residence Card', idNumber: '',
    accountHolder: '', bankName: '', bankBranch: '', accountNumber: '',
  });
  const [snsPlatform, setSnsPlatform] = useState('instagram');
  const [snsHandle, setSnsHandle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regError, setRegError] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [postProject, setPostProject] = useState('');
  const [lockedNotice, setLockedNotice] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('socia_influencer_session')); } catch { return null; }
  });
  const [authMode, setAuthMode] = useState('signin');
  const [authFields, setAuthFields] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Influencer identity — persisted in localStorage so survives refresh
  const [influencerId, setInfluencerId] = useState(() => {
    const stored = localStorage.getItem('socia_influencer_id');
    return stored ? Number(stored) : null;
  });

  // Project enrollment state
  const [selectedProject, setSelectedProject] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollReferralSlug, setEnrollReferralSlug] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  // Active (enrolled) projects
  const [activeProjects, setActiveProjects] = useState([]);

  const fetchActiveProjects = (id) => {
    if (!id) return;
    getInfluencerActiveProjects(id)
      .then(r => setActiveProjects(r.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchActiveProjects(influencerId); }, [influencerId]);

  const [projects, setProjects] = useState([]);
  const [projLoading, setProjLoading] = useState(false);

  useEffect(() => {
    setProjLoading(true);
    getProjectSearch()
      .then(r => setProjects(r.data || []))
      .catch(() => setProjects([]))
      .finally(() => setProjLoading(false));
  }, []);

  // NPO invitations (offers)
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offerActionId, setOfferActionId] = useState(null);
  const [offerAcceptedSlug, setOfferAcceptedSlug] = useState('');

  const fetchOffers = (id) => {
    if (!id) return;
    setOffersLoading(true);
    getOffers({ influencer_id: id, status: 'pending' })
      .then(r => setOffers(r.data || []))
      .catch(() => setOffers([]))
      .finally(() => setOffersLoading(false));
  };

  useEffect(() => { fetchOffers(influencerId); }, [influencerId]);

  const respondOffer = async (offer, status) => {
    setOfferActionId(offer.id);
    try {
      const res = await respondToOffer(offer.id, status);
      if (status === 'accepted' && res.data?.referral_slug) {
        setOfferAcceptedSlug(res.data.referral_slug);
        fetchActiveProjects(influencerId);
      }
      setOffers(o => o.filter(x => x.id !== offer.id));
    } catch (e) {
      console.error(e);
    } finally {
      setOfferActionId(null);
    }
  };

  // Earnings summary
  const [earnings, setEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(false);

  useEffect(() => {
    if (!influencerId || page !== 'earnings') return;
    setEarningsLoading(true);
    getInfluencerEarnings(influencerId)
      .then(r => setEarnings(r.data))
      .catch(() => setEarnings(null))
      .finally(() => setEarningsLoading(false));
  }, [influencerId, page]);

  const registrationComplete = isRegistrationComplete(authUser);

  const nav = (p) => {
    if (GATED_PAGES.includes(p) && !registrationComplete) {
      setLockedNotice(true);
      setPage('reg-overview');
      return;
    }
    setLockedNotice(false);
    setPage(p);
  };

  const handleSignOut = () => {
    localStorage.removeItem('socia_influencer_session');
    localStorage.removeItem('socia_influencer_id');
    setAuthUser(null);
    setInfluencerId(null);
    setPage('reg-overview');
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError(''); setAuthLoading(true);
    try {
      const response = authMode === 'signin'
        ? await signInInfluencer({ name: authFields.name, password: authFields.password })
        : await signUpInfluencer({ name: authFields.name, email: authFields.email, password: authFields.password });
      const user = response.data.user;
      localStorage.setItem('socia_influencer_session', JSON.stringify(user));
      localStorage.setItem('socia_influencer_id', String(user.id));
      setInfluencerId(user.id);
      setAuthUser(user);
      setFormData(f => ({ ...f, fullName: user.full_name || user.name || '', email: user.email || '', phone: user.phone || '', country: user.country || f.country, bio: user.bio || '' }));
      setPage(authMode === 'signup' ? 'reg-profile' : 'reg-overview');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Unable to authenticate. Please try again.');
    } finally { setAuthLoading(false); }
  };

  if (!authUser) {
    return <><style>{S}</style><main className="auth-page"><section className="auth-card">
      <aside className="auth-side"><div><img src="/Socia Logo.png" alt="Socia" style={{ height: 32, width: 'auto' }} /><h1>Turn your influence into impact.</h1><p>Join campaigns that support the causes your community cares about.</p></div><small>For creators and influencers</small></aside>
      <div className="auth-panel"><h2>{authMode === 'signin' ? 'Welcome back' : 'Create your account'}</h2><p>{authMode === 'signin' ? 'Sign in to view your projects and campaign activity.' : 'Create your account, then complete the secure onboarding details.'}</p>
        <div className="auth-tabs"><button className={authMode === 'signin' ? 'active' : ''} onClick={() => { setAuthMode('signin'); setAuthError(''); }}>Sign in</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Create account</button></div>
        {authError && <div className="auth-error">{authError}</div>}
        <form className="auth-form" onSubmit={handleAuth}>
          <div className="form-group"><label className="form-label">Full name</label><input className="form-input" required value={authFields.name} onChange={e => setAuthFields(f => ({ ...f, name: e.target.value }))} autoComplete="name" /></div>
          {authMode === 'signup' && <div className="form-group"><label className="form-label">Email address</label><input className="form-input" required type="email" value={authFields.email} onChange={e => setAuthFields(f => ({ ...f, email: e.target.value }))} autoComplete="email" /></div>}
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" required type="password" minLength="8" value={authFields.password} onChange={e => setAuthFields(f => ({ ...f, password: e.target.value }))} autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'} /></div>
          {authMode === 'signup' && <p className="auth-note">Next, we’ll collect your profile, social accounts, identity, and payout details using the existing onboarding flow.</p>}
          <button className="btn btn-primary" type="submit" disabled={authLoading}>{authLoading ? 'Please wait…' : authMode === 'signin' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
    </section></main></>;
  }

  const addSNS = () => {
    if (!snsHandle) return;
    const icons = { instagram:'📸', youtube:'▶️', twitter:'𝕏', tiktok:'🎵', facebook:'📘', linkedin:'💼', threads:'🧵', blog:'🌐' };
    const labels = { instagram:'Instagram', youtube:'YouTube', twitter:'X (Twitter)', tiktok:'TikTok', facebook:'Facebook', linkedin:'LinkedIn', threads:'Threads', blog:'Personal Blog' };
    setFormData(f => ({ ...f, snsAccounts: [...f.snsAccounts, { platform: snsPlatform, handle: snsHandle, icon: icons[snsPlatform], label: labels[snsPlatform] }] }));
    setSnsHandle('');
  };

  const removeSNS = (i) => setFormData(f => ({ ...f, snsAccounts: f.snsAccounts.filter((_, idx) => idx !== i) }));

  const toggleCause = (c) => setFormData(f => ({
    ...f, causes: f.causes.includes(c) ? f.causes.filter(x => x !== c) : [...f.causes, c]
  }));

  // Estimates how well-matched this creator is for a project, based on cause overlap and platform readiness.
  const fitScore = (project) => {
    const norm = s => String(s || '').toLowerCase().replace(/[^a-z& ]/g, ' ').trim();
    const category = norm(project.category);
    const causeMatch = formData.causes.some(c => {
      const word = norm(c).split(' ').filter(Boolean)[0];
      return word && category.includes(word);
    });
    let score = 45;
    if (causeMatch) score += 35;
    if (formData.snsAccounts.length > 0) score += 15;
    let hash = 0;
    const seed = String(project.id || project.title || '');
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 97;
    score += hash % 8;
    return Math.max(35, Math.min(98, score));
  };
  const fitScoreColor = (score) => score >= 70 ? 'var(--green-mid)' : score >= 45 ? 'var(--orange-mid)' : 'var(--red)';

  // new Date('YYYY-MM-DD') parses as UTC midnight, which can render as the previous day
  // in timezones behind UTC once .toLocaleDateString() converts it back to local time.
  const parseLocalDate = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const ordinal = (n) => {
    if (n % 10 === 1 && n % 100 !== 11) return `${n}st`;
    if (n % 10 === 2 && n % 100 !== 12) return `${n}nd`;
    if (n % 10 === 3 && n % 100 !== 13) return `${n}rd`;
    return `${n}th`;
  };

  const handleSubmitRegistration = async () => {
    const missing = [];
    if (!formData.phone) missing.push('phone number');
    if (!formData.idNumber) missing.push('ID number');
    if (!formData.accountNumber || !formData.bankName || !formData.bankBranch || !formData.accountHolder) missing.push('bank account details');
    if (missing.length) {
      setRegError(`Please complete: ${missing.join(', ')} before submitting.`);
      return;
    }
    setRegError('');
    setSubmitting(true);
    try {
      const res = influencerId
        ? await updateInfluencer(influencerId, { ...formData })
        : await registerInfluencer({ ...formData });
      const id = res.data?.id;
      if (id) {
        setInfluencerId(id);
        localStorage.setItem('socia_influencer_id', String(id));
      }
      const updatedUser = {
        ...authUser,
        full_name: formData.fullName || authUser?.full_name,
        email: formData.email || authUser?.email,
        phone: formData.phone,
        country: formData.country,
        bio: formData.bio,
        causes: formData.causes,
        sns_accounts: formData.snsAccounts,
        id_type: formData.idType,
        id_number: formData.idNumber,
        bank_name: formData.bankName,
        bank_account: formData.accountNumber,
        bank_branch: formData.bankBranch,
        bank_account_name: formData.accountHolder,
      };
      setAuthUser(updatedUser);
      localStorage.setItem('socia_influencer_session', JSON.stringify(updatedUser));
      setSubmitted(true);
      setLockedNotice(false);
      setPage('reg-overview');
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleEnroll = async () => {
    if (!selectedProject || !influencerId) return;
    setEnrolling(true);
    try {
      const res = await enrollProject(selectedProject.id, influencerId);
      setEnrollSuccess(true);
      setEnrollReferralSlug(res.data?.referral_slug || '');
      fetchActiveProjects(influencerId);
    } catch (e) {
      console.error(e);
    }
    setEnrolling(false);
  };

  const openApply = (p) => {
    setSelectedProject(p);
    setEnrollSuccess(false);
    setEnrollReferralSlug('');
    nav('proj-apply');
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/go/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  };

  const GRADIENTS = [
    'linear-gradient(135deg,#1565C0,#0D9488)',
    'linear-gradient(135deg,#D97706,#FB8C00)',
    'linear-gradient(135deg,#0891B2,#0D9488)',
    'linear-gradient(135deg,#004D40,#26A69A)',
    'linear-gradient(135deg,#7C3AED,#4F46E5)',
  ];

  const breadcrumbs = {
    'reg-overview': 'Registration / Overview',
    'reg-profile': 'Registration / New Registration',
    'reg-sns': 'Registration / Link SNS',
    'reg-kyc': 'Registration / Identity (KYC)',
    'reg-tax': 'Registration / Tax & Payment',
    'proj-active': 'Projects / My Active Projects',
    'proj-search': 'Projects / Project Search',
    'proj-apply': 'Projects / Apply & Invitations',
    'post-submit': 'Post & Creative / Submit Post URL',
    'post-review': 'Post & Creative / Submission Review',
    'analytics': 'Analytics',
    'earnings': 'Earnings',
  };

  return (
    <>
      <style>{S}</style>
      <div className="layout" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src="/Socia Logo.png" alt="Socia" style={{ height:30, width:'auto', objectFit:'contain' }} />
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">{(authUser.full_name || authUser.name || 'U').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div className="user-name">{authUser.full_name || authUser.name}</div>
              <div className="user-handle">{authUser.email}</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Registration</div>
            <div className={`nav-item${page === 'reg-overview' ? ' active' : ''}`} onClick={() => nav('reg-overview')}>
              <span className="nav-icon">📋</span> Registration Overview
            </div>
            <div className={`sidebar-step${regStep > 0 ? ' done' : ''}`} onClick={() => nav('reg-profile')}>
              <div className="step-dot" /> 1. New Registration
            </div>
            <div className={`sidebar-step${regStep > 1 ? ' done' : ''}`} onClick={() => nav('reg-sns')}>
              <div className="step-dot" /> 2. Link SNS Accounts
            </div>
            <div className={`sidebar-step${regStep > 2 ? ' done' : ''}`} onClick={() => nav('reg-kyc')}>
              <div className="step-dot" /> 3. Identity (KYC)
            </div>
            <div className="sidebar-step" onClick={() => nav('reg-tax')}>
              <div className="step-dot" /> 4. Tax &amp; Payment
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Projects</div>
            {[
              { key: 'proj-active', icon: '🗂️', label: 'My Active Projects', badge: activeProjects.length || null },
              { key: 'proj-search', icon: '🔍', label: 'Project Search', badge: projects.length || null },
              { key: 'proj-apply', icon: '📤', label: 'Apply / Invitations', badge: offers.length || null },
            ].map(({ key, icon, label, badge }) => {
              const locked = !registrationComplete;
              return (
                <div key={key} className={`nav-item${page === key ? ' active' : ''}${locked ? ' locked' : ''}`} onClick={() => nav(key)} title={locked ? 'Complete registration to unlock' : undefined}>
                  <span className="nav-icon">{icon}</span> {label}
                  {locked ? <span className="nav-badge">🔒</span> : (badge && <span className="nav-badge">{badge}</span>)}
                </div>
              );
            })}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Post & Creative</div>
            {[
              { key: 'post-submit', icon: '🔗', label: 'Submit Post URL' },
              { key: 'post-review', icon: '🔎', label: 'Submission Review' },
            ].map(({ key, icon, label }) => {
              const locked = !registrationComplete;
              return (
                <div key={key} className={`nav-item${page === key ? ' active' : ''}${locked ? ' locked' : ''}`} onClick={() => nav(key)} title={locked ? 'Complete registration to unlock' : undefined}>
                  <span className="nav-icon">{icon}</span> {label}
                  {locked && <span className="nav-badge">🔒</span>}
                </div>
              );
            })}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Analytics</div>
            {[
              { key: 'analytics', icon: '📊', label: 'Analytics' },
              { key: 'earnings', icon: '💰', label: 'Earnings' },
            ].map(({ key, icon, label }) => {
              const locked = !registrationComplete;
              return (
                <div key={key} className={`nav-item${page === key ? ' active' : ''}${locked ? ' locked' : ''}`} onClick={() => nav(key)} title={locked ? 'Complete registration to unlock' : undefined}>
                  <span className="nav-icon">{icon}</span> {label}
                  {locked && <span className="nav-badge">🔒</span>}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-breadcrumb">
              {breadcrumbs[page]?.split('/').map((part, i, arr) => (
                <span key={i}>{part.trim()}{i < arr.length - 1 && <span style={{ color: '#94A3B8' }}> / </span>}{i === arr.length - 1 && <></> }</span>
              ))}
            </div>
            <div className="topbar-actions">
              <div className="icon-btn" onClick={() => nav('proj-search')}>🔍</div>
              <div className="icon-btn" onClick={() => nav('post-review')}>
                🔔<span className="notif-dot" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{authUser.full_name || authUser.name}</span>
              <div className="user-avatar" style={{ cursor: 'pointer' }} onClick={() => nav('reg-profile')}>{(authUser.full_name || authUser.name || 'U').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div className="icon-btn" title="Sign out" onClick={handleSignOut}>🚪</div>
            </div>
          </header>

          <div className="page-content fade-up" key={page}>

            {/* ── REG OVERVIEW ── */}
            {page === 'reg-overview' && (
              <>
                <div className="page-header">
                  <div className="page-title">Registration Overview</div>
                  <div className="page-subtitle">Complete all steps to start amplifying social causes and nonprofit campaigns.</div>
                </div>
                {submitted && (
                  <div className="success-banner">✅ Your registration has been submitted and is under review by the Socia admin team. You'll be notified once approved.</div>
                )}
                {!registrationComplete && lockedNotice && (
                  <div className="alert-banner">🔒 Complete your Profile, SNS, KYC, and Tax &amp; Payment details before you can access Projects, Post &amp; Creative, Analytics, or Earnings.</div>
                )}
                <div className="stepper">
                  {STEPS_REG.map((s, i) => (
                    <div key={s} className={`step-item${i < regStep ? ' done' : i === regStep ? ' current' : ''}`}>
                      <div className="step-circle">{i < regStep ? '✓' : i + 1}</div>
                      <div className="step-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid-4">
                  {[
                    { icon: '👤', bg: 'var(--blue-light)', val: '✓', lbl: 'Profile Created', delta: 'Verified', type: 'up', pg: 'reg-profile' },
                    { icon: '🔗', bg: '#F3E5F5', val: '0', lbl: 'SNS Linked', delta: 'Not linked yet', type: 'down', pg: 'reg-sns' },
                    { icon: '🪪', bg: 'var(--green-light)', val: 'Pending', lbl: 'KYC Status', delta: 'Upload docs', type: 'down', pg: 'reg-kyc' },
                    { icon: '🏦', bg: 'var(--orange-light)', val: 'Pending', lbl: 'Tax & Payment', delta: 'Action needed', type: 'down', pg: 'reg-tax' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card" onClick={() => nav(s.pg)} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div>
                        <div className="stat-value">{s.val}</div>
                        <div className="stat-label">{s.lbl}</div>
                        <div className={`stat-delta ${s.type}`}>{s.delta}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-20">
                  <div className="card">
                    <div className="card-title">Next Step Required</div>
                    <div className="card-sub">Complete your Tax & Payment details so Socia can process your creator stipends and donation-match rewards.</div>
                    <div className="flex items-center gap-12">
                      <button className="btn btn-primary" onClick={() => nav('reg-profile')}>Complete Registration →</button>
                      <button className="btn btn-outline" onClick={() => nav('proj-search')}>Browse Causes</button>
                    </div>
                  </div>
                </div>
                <div className="mt-20">
                  <div className="card">
                    <div className="card-title">Recent Activity</div>
                    {[
                      { icon: '📩', bg: 'var(--blue-light)', text: 'Welcome to Socia! Complete your registration to start enrolling in campaigns.', time: 'Just now' },
                      { icon: '⏰', bg: 'var(--orange-light)', text: '<strong>12 active projects</strong> available for you to enroll once approved.', time: 'Today' },
                    ].map((n, i) => (
                      <div key={i} className="notif-item">
                        <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                        <div>
                          <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.text }} />
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── REG PROFILE ── */}
            {page === 'reg-profile' && (
              <>
                <div className="page-header">
                  <div className="page-title">New Creator Registration</div>
                  <div className="page-subtitle">Create your Socia account. Fields marked * are required.</div>
                </div>
                <div className="stepper">
                  {STEPS_REG.map((s, i) => (
                    <div key={s} className={`step-item${i < 0 ? ' done' : i === 0 ? ' current' : ''}`}>
                      <div className="step-circle">{i + 1}</div>
                      <div className="step-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-title">Personal Information</div>
                    <div className="card-sub">Basic profile details</div>
                    {[
                      { label: 'Full Name *', key: 'fullName', placeholder: 'Your full name' },
                      { label: 'Email Address *', key: 'email', placeholder: 'you@example.com' },
                      { label: 'Phone Number *', key: 'phone', placeholder: '+1 415 555 0000' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="form-group">
                        <label className="form-label">{label}</label>
                        <input className="form-input" value={formData[key]} placeholder={placeholder}
                          onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <select className="form-select" value={formData.country} onChange={e => setFormData(f => ({ ...f, country: e.target.value }))}>
                        {['Japan','United States','United Kingdom','Canada','India','Germany'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <div className="card-title">Cause Categories</div>
                      <div className="card-sub">Select the causes you're passionate about</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 12 }}>
                        {CAUSE_OPTS.map(c => (
                          <div key={c} className={`platform-pill${formData.causes.includes(c) ? ' active' : ''}`} onClick={() => toggleCause(c)}>{c}</div>
                        ))}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Bio / Self Introduction</label>
                        <textarea className="form-input" rows={3} style={{ resize: 'vertical' }}
                          value={formData.bio} onChange={e => setFormData(f => ({ ...f, bio: e.target.value }))}
                          placeholder="Tell causes why you're a great fit..." />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline">Save Draft</button>
                  <button className="btn btn-primary" onClick={() => nav('reg-sns')}>Next: Link SNS Accounts →</button>
                </div>
              </>
            )}

            {/* ── REG SNS ── */}
            {page === 'reg-sns' && (
              <>
                <div className="page-header">
                  <div className="page-title">Link SNS Accounts</div>
                  <div className="page-subtitle">Connect your social media so nonprofits can verify your reach.</div>
                </div>
                <div className="stepper">
                  {STEPS_REG.map((s, i) => (
                    <div key={s} className={`step-item${i < 1 ? ' done' : i === 1 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 1 ? '✓' : i + 1}</div>
                      <div className="step-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid-2">
                  <div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <div className="card-title">Add a Social Account</div>
                      <div className="card-sub">Select platform and enter your handle.</div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">Platform</label>
                          <select className="form-select" value={snsPlatform} onChange={e => setSnsPlatform(e.target.value)}>
                            {[['instagram','📸 Instagram'],['youtube','▶️ YouTube'],['twitter','𝕏 X (Twitter)'],['tiktok','🎵 TikTok'],['facebook','📘 Facebook'],['linkedin','💼 LinkedIn'],['threads','🧵 Threads'],['blog','🌐 Blog']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </div>
                        <div style={{ flex: 1.4 }}>
                          <label className="form-label">Username / Handle</label>
                          <input className="form-input" value={snsHandle} placeholder="@username or URL" onChange={e => setSnsHandle(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={addSNS} style={{ height: 40 }}>+ Connect</button>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Connected Accounts</div>
                      <div className="card-sub">All linked social media accounts</div>
                      {formData.snsAccounts.length === 0 && <p style={{ fontSize: 13, color: 'var(--slate)', textAlign: 'center', padding: '20px 0' }}>No accounts linked yet</p>}
                      {formData.snsAccounts.map((acc, i) => (
                        <div key={i} className="social-row connected" style={{ marginBottom: 8 }}>
                          <div className="social-left">
                            <div className="social-icon">{acc.icon}</div>
                            <div>
                              <div className="social-name">{acc.label}</div>
                              <div className="social-handle">{acc.handle}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="badge badge-green">Connected ✓</span>
                            <button className="btn btn-danger btn-sm" onClick={() => removeSNS(i)}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">Audience Stats</div>
                    <div className="card-sub">Link at least 1 account to apply for campaigns</div>
                    <div className="grid-2" style={{ marginBottom: 16 }}>
                      {[
                        { val: `${formData.snsAccounts.length}`, lbl: 'Accounts Linked', color: 'var(--navy)' },
                        { val: formData.snsAccounts.length >= 1 ? '✓ Ready' : '⚠ Need 1+', lbl: 'Campaign Eligibility', color: formData.snsAccounts.length >= 1 ? 'var(--green-mid)' : 'var(--orange-mid)' },
                      ].map(k => (
                        <div key={k.lbl} className="kpi-mini">
                          <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
                          <div className="kpi-lbl">{k.lbl}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--slate)', background: 'var(--bg)', borderRadius: 10, padding: 14 }}>
                      💡 Tip: Link multiple accounts to increase your chances of being matched with campaigns. NPOs look for creators with diverse platform presence.
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={() => nav('reg-profile')}>← Back</button>
                  <button className="btn btn-primary" onClick={() => nav('reg-kyc')}>Next: Identity Verification →</button>
                </div>
              </>
            )}

            {/* ── REG KYC ── */}
            {page === 'reg-kyc' && (
              <>
                <div className="page-header">
                  <div className="page-title">Identity Verification (KYC)</div>
                  <div className="page-subtitle">Submit government-issued ID for account verification. Reviewed within 24 hours.</div>
                </div>
                <div className="stepper">
                  {STEPS_REG.map((s, i) => (
                    <div key={s} className={`step-item${i < 2 ? ' done' : i === 2 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 2 ? '✓' : i + 1}</div>
                      <div className="step-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ maxWidth: 460 }}>
                  <div className="card-title">Identity Details</div>
                  <div className="card-sub">Enter your government-issued ID details</div>
                  <div className="form-group">
                    <label className="form-label">ID Type</label>
                    <select className="form-select" value={formData.idType} onChange={e => setFormData(f => ({ ...f, idType: e.target.value }))}>
                      {['Residence Card','My Number Card','Passport','Driver\'s Licence'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ID Number</label>
                    <input className="form-input" value={formData.idNumber} placeholder="Enter ID number"
                      onChange={e => setFormData(f => ({ ...f, idNumber: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={() => nav('reg-sns')}>← Back</button>
                  <button className="btn btn-primary" onClick={() => nav('reg-tax')}>Next: Tax &amp; Payment →</button>
                </div>
              </>
            )}

            {/* ── REG TAX ── */}
            {page === 'reg-tax' && (
              <>
                <div className="page-header">
                  <div className="page-title">Payment Registration</div>
                  <div className="page-subtitle">Add your bank account to receive creator stipends from Socia.</div>
                </div>
                <div className="stepper">
                  {STEPS_REG.map((s, i) => (
                    <div key={s} className={`step-item${i < 3 ? ' done' : i === 3 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 3 ? '✓' : i + 1}</div>
                      <div className="step-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-title">Bank Account for Payouts</div>
                    <div className="card-sub">All creator stipends will be deposited here</div>
                    {[
                      { label: 'Account Holder Name *', key: 'accountHolder', placeholder: 'Exactly as registered with your bank' },
                      { label: 'Account Number *', key: 'accountNumber', placeholder: 'Enter account number' },
                      { label: 'Bank Name *', key: 'bankName', placeholder: 'Enter your bank name' },
                      { label: 'Bank Branch Name *', key: 'bankBranch', placeholder: 'Enter your bank branch name' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="form-group">
                        <label className="form-label">{label}</label>
                        <input className="form-input" value={formData[key]} placeholder={placeholder}
                          onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <div className="card-title">Payout Summary</div>
                      <div className="card-sub">How stipends are calculated and paid</div>
                      <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, fontSize: 13, lineHeight: 1.7 }}>
                        A fixed amount will be provided on raising a pre-decided amount for the project (raise amount X → get amount Y). The amount will be paid on a fixed date of the month following project completion. The date will be decided by the Socia team.
                      </div>
                    </div>
                  </div>
                </div>
                {regError && <div className="auth-error mt-20">{regError}</div>}
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={() => nav('reg-kyc')}>← Back</button>
                  <button className="btn btn-green" onClick={handleSubmitRegistration} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Save & Submit Registration ✓'}
                  </button>
                </div>
              </>
            )}

            {/* ── PROJ SEARCH ── */}
            {page === 'proj-search' && (
              <>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="page-title">Project Search</div>
                    <div className="page-subtitle">Browse approved campaigns and enroll to start promoting social causes.</div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <input className="form-input" style={{ maxWidth: 400 }} placeholder="🔍 Search projects by name, cause, or organization..." />
                </div>
                {projLoading && <div style={{ color:'var(--slate)', fontSize:13, padding:'20px 0' }}>Loading approved projects…</div>}
                {!projLoading && projects.length === 0 && (
                  <div style={{ color:'var(--slate)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No approved projects available yet. Check back soon.</div>
                )}
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  {projects.map((p, i) => {
                    const alreadyEnrolled = activeProjects.some(a => a.id === p.id);
                    const score = fitScore(p);
                    const isClosed = p.deadline ? new Date(p.deadline) < new Date() : false;
                    return (
                      <div key={p.id} className="proj-card" onClick={() => !isClosed && openApply(p)} style={isClosed ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}>
                        <div className="proj-card-img" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>{p.emoji || '🌍'}</div>
                        <div className="proj-card-body">
                          <div className="proj-card-title">{p.title}</div>
                          <div className="proj-card-brand">{p.organization} · {p.platform}</div>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                            {p.category && <span className="tag">{p.category}</span>}
                            {isClosed
                              ? <span className="tag" style={{ background: 'var(--red-light, #FFEBEE)', color: 'var(--red, #C62828)' }}>Closed</span>
                              : <span className="tag" style={{ background: 'transparent', border: `1px solid ${fitScoreColor(score)}`, color: fitScoreColor(score) }}>🎯 Fit Score: {score}%</span>
                            }
                          </div>
                          {Number(p.goal_amount) > 0 && Number(p.stipend_amount) > 0 && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)', background: 'var(--bg)', borderRadius: 6, padding: '4px 8px', display: 'inline-block', marginBottom: 10 }}>
                              Raise {yen(p.goal_amount)} → Paid {yen(p.stipend_amount)}
                            </div>
                          )}
                          <div className="proj-card-footer">
                            <div><div style={{ fontSize: 11, color: 'var(--slate)' }}>Goal</div><div style={{ fontWeight: 700, fontSize: 13, color: 'var(--green-mid)' }}>{p.goal_amount ? yen(p.goal_amount) : (p.goal || '—')}</div></div>
                            <div><div style={{ fontSize: 11, color: 'var(--slate)' }}>Deadline</div><div style={{ fontWeight: 700, fontSize: 13 }}>{p.deadline ? new Date(p.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—'}</div></div>
                            {isClosed
                              ? <span style={{ fontSize:12, fontWeight:700, color:'var(--red, #C62828)' }}>Closed</span>
                              : alreadyEnrolled
                                ? <span style={{ fontSize:12, fontWeight:700, color:'var(--green-mid)' }}>✓ Enrolled</span>
                                : <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); openApply(p); }}>Apply →</button>
                            }
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── PROJ APPLY ── */}
            {page === 'proj-apply' && (
              <>
                <div className="page-header">
                  <div className="page-title">Apply &amp; Invitations</div>
                  <div className="page-subtitle">Respond to campaign invitations from NPOs, or confirm enrollment in a project you applied to.</div>
                </div>
                {!influencerId && (
                  <div className="alert-banner">⚠️ You must complete registration before enrolling. <button className="btn btn-primary btn-sm" style={{ marginLeft:10 }} onClick={() => nav('reg-overview')}>Register →</button></div>
                )}

                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title">Invitations from NPOs</div>
                  <div className="card-sub">Campaigns that have invited you directly</div>
                  {offerAcceptedSlug && (
                    <div className="alert-banner" style={{ background:'var(--green-light)', color:'var(--green)', borderColor:'var(--green-mid)', marginBottom: 14 }}>
                      <div style={{ marginBottom: 10 }}>✅ Invitation accepted — you're enrolled!</div>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                        <input
                          className="form-input"
                          readOnly
                          value={`${window.location.origin}/go/${offerAcceptedSlug}`}
                          style={{ flex:1, minWidth:220, fontSize:12.5, background:'#fff' }}
                          onFocus={e => e.target.select()}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => copyLink(offerAcceptedSlug)}>
                          {copiedSlug === offerAcceptedSlug ? '✓ Copied' : '📋 Copy Link'}
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => nav('proj-active')}>View My Projects →</button>
                      </div>
                    </div>
                  )}
                  {offersLoading && <div style={{ color:'var(--slate)', fontSize:13, padding:'10px 0' }}>Loading invitations…</div>}
                  {!offersLoading && offers.length === 0 && (
                    <div style={{ textAlign:'center', color:'var(--slate)', fontSize:13, padding:'20px 0' }}>No pending invitations. You'll see invitations from NPOs here once they invite you to a campaign.</div>
                  )}
                  {offers.map(o => (
                    <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13.5 }}>{o.title}</div>
                        <div style={{ fontSize:12, color:'var(--slate)' }}>{o.organization} · {o.platform}</div>
                        {Number(o.goal_amount) > 0 && Number(o.stipend_amount) > 0 && (
                          <div style={{ fontSize:11.5, color:'var(--navy)', marginTop:2 }}>Raise {yen(o.goal_amount)} → Paid {yen(o.stipend_amount)}</div>
                        )}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="btn btn-primary btn-sm" disabled={offerActionId === o.id} onClick={() => respondOffer(o, 'accepted')}>
                          {offerActionId === o.id ? '…' : '✓ Accept'}
                        </button>
                        <button className="btn btn-outline btn-sm" disabled={offerActionId === o.id} onClick={() => respondOffer(o, 'declined')}>
                          ✕ Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {enrollSuccess && (
                  <div className="alert-banner" style={{ background:'var(--green-light)', color:'var(--green)', borderColor:'var(--green-mid)' }}>
                    <div style={{ marginBottom: enrollReferralSlug ? 10 : 0 }}>✅ Successfully enrolled!</div>
                    {enrollReferralSlug && (
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                        <input
                          className="form-input"
                          readOnly
                          value={`${window.location.origin}/go/${enrollReferralSlug}`}
                          style={{ flex:1, minWidth:220, fontSize:12.5, background:'#fff' }}
                          onFocus={e => e.target.select()}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => copyLink(enrollReferralSlug)}>
                          {copiedSlug === enrollReferralSlug ? '✓ Copied' : '📋 Copy Link'}
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => nav('proj-active')}>View My Projects →</button>
                      </div>
                    )}
                  </div>
                )}
                {selectedProject ? (
                  <div className="grid-21">
                    <div className="card">
                      <div className="card-title">Campaign Details</div>
                      <div className="card-sub">{selectedProject.title}</div>
                      <div style={{ fontSize: 13, lineHeight: 2 }}>
                        <div><strong>Organization:</strong> {selectedProject.organization}</div>
                        <div><strong>Platform:</strong> {selectedProject.platform}</div>
                        <div><strong>Category:</strong> {selectedProject.category}</div>
                        <div><strong>Fit Score:</strong> <span style={{ fontWeight:700, color: fitScoreColor(fitScore(selectedProject)) }}>🎯 {fitScore(selectedProject)}% match</span></div>
                        <div><strong>Goal:</strong> <span style={{ color:'var(--green-mid)', fontWeight:700 }}>{selectedProject.goal_amount ? yen(selectedProject.goal_amount) : (selectedProject.goal || '—')}</span></div>
                        {Number(selectedProject.goal_amount) > 0 && Number(selectedProject.stipend_amount) > 0 && (
                          <div><strong>Payout:</strong> <span style={{ fontWeight:700 }}>Raise {yen(selectedProject.goal_amount)} → Paid {yen(selectedProject.stipend_amount)}</span></div>
                        )}
                        {selectedProject.deadline && <div><strong>Deadline:</strong> {new Date(selectedProject.deadline).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>}
                        {selectedProject.description && <div style={{ marginTop:8, color:'var(--slate)' }}>{selectedProject.description}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
                        <button className="btn btn-outline" onClick={() => nav('proj-search')}>← Back</button>
                        <button className="btn btn-primary" onClick={handleEnroll} disabled={enrolling || !influencerId || enrollSuccess}>
                          {enrolling ? 'Enrolling…' : '✓ Confirm Enrollment'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="card">
                        <div className="card-title">What happens next?</div>
                        <div style={{ fontSize:13, lineHeight:2, color:'var(--slate)' }}>
                          <div>✅ You'll appear in the project's creator list</div>
                          <div>📩 The NPO will be notified of your enrollment</div>
                          <div>📋 Campaign briefs & materials will be shared</div>
                          <div>📤 Submit your post URLs once content is live</div>
                          <div>💵 Stipend processed after content is approved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ textAlign:'center', padding:'40px 0' }}>
                    No project selected. <button className="btn btn-primary btn-sm" style={{ marginLeft:10 }} onClick={() => nav('proj-search')}>Browse Projects →</button>
                  </div>
                )}
              </>
            )}

            {/* ── POST SUBMIT ── */}
            {page === 'post-submit' && (
              <>
                <div className="page-header">
                  <div className="page-title">Submit Post URL</div>
                  <div className="page-subtitle">Share the link to your completed campaign post for review.</div>
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-title">Post Submission</div>
                    <div className="card-sub">Submit your content URL once your post is live</div>
                    <div className="form-group">
                      <label className="form-label">Select Campaign</label>
                      <select className="form-select" value={postProject} onChange={e => setPostProject(e.target.value)}>
                        <option value="">— Select a campaign —</option>
                        {activeProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Platform</label>
                      <select className="form-select">
                        {['Instagram Reel','Instagram Story','YouTube Short','X Thread','TikTok Video'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Post URL *</label>
                      <input className="form-input" value={postUrl} placeholder="https://instagram.com/p/..." onChange={e => setPostUrl(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notes (optional)</label>
                      <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} placeholder="Any notes for the reviewer..." />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Submit for Review →</button>
                  </div>
                  <div className="card">
                    <div className="card-title">Submission Guidelines</div>
                    <div className="card-sub">Make sure your post meets these requirements</div>
                    <div style={{ fontSize: 13, lineHeight: 2, color: 'var(--text)' }}>
                      ✅ Post must be publicly visible<br/>
                      ✅ Required hashtags included<br/>
                      ✅ Campaign link in bio or caption<br/>
                      ✅ @Mention the NPO<br/>
                      ✅ Content approved before going live<br/>
                      ⬜ Minimum 24h after posting to submit
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── POST REVIEW / SUBMISSION REVIEW ── */}
            {page === 'post-review' && (
              <>
                <div className="page-header">
                  <div className="page-title">Submission Review</div>
                  <div className="page-subtitle">Track the status of all your submitted content.</div>
                </div>
                <div className="grid-4" style={{ marginBottom: 20 }}>
                  {[
                    { icon: '📤', bg: 'var(--blue-light)', val: '0', lbl: 'Total Submitted' },
                    { icon: '✅', bg: 'var(--green-light)', val: '0', lbl: 'Approved' },
                    { icon: '🔎', bg: 'var(--orange-light)', val: '0', lbl: 'Under Review' },
                    { icon: '🔄', bg: 'var(--red-light)', val: '0', lbl: 'Needs Revision' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card">
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title">My Submissions</div>
                  <div className="card-sub">All submitted post URLs and their review status</div>
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate)', fontSize: 14 }}>
                    No submissions yet. <button className="btn btn-primary btn-sm" style={{ marginLeft: 10 }} onClick={() => nav('post-submit')}>Submit Your First Post →</button>
                  </div>
                </div>
              </>
            )}

            {/* ── PROJ ACTIVE ── */}
            {page === 'proj-active' && (
              <>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="page-title">My Active Projects</div>
                    <div className="page-subtitle">All campaigns you are currently enrolled in.</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => nav('proj-search')}>🔍 Browse More Causes</button>
                </div>
                {!influencerId && (
                  <div className="alert-banner">Register and get approved to enroll in projects.</div>
                )}
                {activeProjects.length === 0 && influencerId && (
                  <div className="card">
                    <div style={{ textAlign:'center', padding:'40px 0', color:'var(--slate)', fontSize:14 }}>
                      No active projects yet. <button className="btn btn-primary btn-sm" style={{ marginLeft:10 }} onClick={() => nav('proj-search')}>Browse Projects →</button>
                    </div>
                  </div>
                )}
                <div className="grid-2">
                  {activeProjects.map((p, i) => (
                    <div key={p.id} className="proj-card">
                      <div className="proj-card-img" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>{p.emoji || '🌍'}</div>
                      <div className="proj-card-body">
                        <div className="proj-card-title">{p.title}</div>
                        <div className="proj-card-brand">{p.organization} · {p.platform}</div>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
                          {p.category && <span className="tag">{p.category}</span>}
                          <span className="tag" style={{ background:'var(--green-light)', color:'var(--green)' }}>✓ Enrolled</span>
                        </div>
                        {Number(p.goal_amount) > 0 && Number(p.stipend_amount) > 0 && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy)', background: 'var(--bg)', borderRadius: 6, padding: '4px 8px', display: 'inline-block', marginBottom: 10 }}>
                            Raise {yen(p.goal_amount)} → Paid {yen(p.stipend_amount)}
                          </div>
                        )}
                        <div className="proj-card-footer">
                          <div><div style={{ fontSize:11, color:'var(--slate)' }}>Goal</div><div style={{ fontWeight:700, fontSize:13, color:'var(--green-mid)' }}>{p.goal_amount ? yen(p.goal_amount) : (p.goal || '—')}</div></div>
                          <div><div style={{ fontSize:11, color:'var(--slate)' }}>Enrolled</div><div style={{ fontWeight:700, fontSize:13 }}>{p.enrolled_at ? new Date(p.enrolled_at).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—'}</div></div>
                          <button className="btn btn-outline btn-sm" onClick={() => nav('post-submit')}>Submit Post →</button>
                        </div>
                        {p.referral_slug && (
                          <div style={{ marginTop: 10 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <input
                                className="form-input"
                                readOnly
                                value={`${window.location.origin}/go/${p.referral_slug}`}
                                style={{ flex: 1, fontSize: 11.5, padding: '6px 10px' }}
                                onFocus={e => e.target.select()}
                              />
                              <button className="btn btn-outline btn-sm" onClick={() => copyLink(p.referral_slug)}>
                                {copiedSlug === p.referral_slug ? '✓' : '📋'}
                              </button>
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--slate)', marginTop: 6 }}>
                              👁 {p.click_count || 0} link click{p.click_count === 1 ? '' : 's'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ANALYTICS ── */}
            {page === 'analytics' && (
              <>
                <div className="page-header">
                  <div className="page-title">Analytics</div>
                  <div className="page-subtitle">Track your content performance and campaign impact.</div>
                </div>
                <div className="card">
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate)', fontSize: 14 }}>
                    Analytics will appear here once you complete campaigns. Start by browsing and enrolling in projects.
                  </div>
                </div>
              </>
            )}

            {/* ── EARNINGS ── */}
            {page === 'earnings' && (
              <>
                <div className="page-header">
                  <div className="page-title">Earnings</div>
                  <div className="page-subtitle">Track your stipends and payout history.</div>
                </div>
                {earningsLoading && <div style={{ color:'var(--slate)', fontSize:13, padding:'10px 0' }}>Loading earnings…</div>}
                <div className="grid-4" style={{ marginBottom: 20 }}>
                  {[
                    { icon: '💰', bg: 'var(--green-light)', val: yen(earnings?.total_earned || 0), lbl: 'Total Earned' },
                    { icon: '⏳', bg: 'var(--orange-light)', val: yen(earnings?.pending_payout || 0), lbl: 'Payment Pending' },
                    { icon: '📅', bg: 'var(--blue-light)', val: earnings?.cutoff_date ? parseLocalDate(earnings.cutoff_date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—', lbl: 'Cut-off Date' },
                    { icon: '🏦', bg: '#F3E5F5', val: earnings?.next_payout_date ? parseLocalDate(earnings.next_payout_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—', lbl: 'Next Payout Date' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card">
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, fontSize: 12.5, color: 'var(--slate)', marginBottom: 20 }}>
                  💡 Stipends for campaigns completed before the cut-off date are aggregated and paid on the {ordinal(earnings?.payout_day || 5)} of the following month.
                </div>
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-title">Monthly Aggregation</div>
                  <div className="card-sub">Stipend totals grouped by campaign completion month</div>
                  {(!earnings?.monthly || earnings.monthly.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--slate)', fontSize: 14 }}>No campaign activity yet.</div>
                  ) : (
                    <div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--slate)', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                        <span>Month</span><span>Campaigns</span><span>Amount</span>
                      </div>
                      {earnings.monthly.map(m => (
                        <div key={`${m.year}-${m.month}`} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                          <span>{new Date(m.year, m.month - 1, 1).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>
                          <span>{m.count}</span>
                          <span style={{ fontWeight:700 }}>{yen(m.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="card-title">Campaign Payout Detail</div>
                  <div className="card-sub">Stipend status for each campaign you've enrolled in</div>
                  {(!earnings?.campaigns || earnings.campaigns.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate)', fontSize: 14 }}>
                      No earnings yet. Complete campaigns to receive stipends.
                    </div>
                  ) : (
                    <div>
                      {earnings.campaigns.map(c => (
                        <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:13.5 }}>{c.title}</div>
                            <div style={{ fontSize:12, color:'var(--slate)' }}>{c.organization} · {c.deadline ? new Date(c.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</div>
                          </div>
                          <span className={`badge ${c.status === 'completed' ? 'badge-green' : 'badge-orange'}`}>
                            {c.status === 'completed' ? 'Earned' : 'Pending'}
                          </span>
                          <span style={{ fontWeight:700, minWidth:80, textAlign:'right' }}>{yen(c.stipend_amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
