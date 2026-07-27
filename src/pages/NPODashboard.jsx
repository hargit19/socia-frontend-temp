import { useState, useEffect } from 'react';
import { registerNPO, updateNPO, createProject, submitProject, signInNPO, signUpNPO, getNPOProjects } from '../api/api';

const S = `
:root{
  --navy:#0F1F3D;--navy-mid:#1A3260;--navy-light:#243B6E;
  --teal:#0D9488;--teal-mid:#14B8A6;--teal-light:#CCFBF1;
  --amber:#D97706;--amber-mid:#F59E0B;--amber-light:#FEF3C7;
  --rose:#BE123C;--rose-light:#FFE4E6;
  --slate:#64748B;--bg:#F0F4F8;--white:#FFFFFF;--border:#E2E8F0;--text:#0F1F3D;
  --sidebar-w:256px;--hdr-h:64px;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
.npo-layout{display:flex;min-height:100vh;}
.sidebar{width:var(--sidebar-w);background:var(--navy);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto;}
.sb-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,0.07);}
.sb-logo-text{font-family:'Sora',sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:.4px;}
.sb-logo-badge{margin-left:auto;font-size:9px;font-weight:700;letter-spacing:.8px;background:var(--teal);color:#fff;padding:2px 7px;border-radius:10px;}
.sb-org{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.07);}
.sb-org-avatar{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--teal),#0891B2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
.sb-org-name{font-size:12.5px;font-weight:700;color:#fff;line-height:1.3;}
.sb-org-type{font-size:11px;color:rgba(255,255,255,.45);}
.sb-section{padding:14px 14px 6px;}
.sb-section-label{font-size:9.5px;font-weight:700;letter-spacing:1.8px;color:rgba(255,255,255,.3);text-transform:uppercase;padding:0 8px 8px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;transition:all .15s;color:rgba(255,255,255,.55);font-size:13px;font-weight:500;margin-bottom:2px;position:relative;}
.nav-item:hover{background:rgba(255,255,255,.07);color:#fff;}
.nav-item.active{background:rgba(13,148,136,.2);color:#fff;}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:0 3px 3px 0;background:var(--teal-mid);}
.nav-icon{font-size:15px;width:18px;text-align:center;}
.nav-badge{margin-left:auto;background:var(--amber-mid);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;}
.sb-step{display:flex;align-items:center;gap:10px;padding:7px 12px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.45);font-size:12px;margin-bottom:1px;transition:color .15s;}
.sb-step:hover{color:rgba(255,255,255,.8);}
.sb-step.done .step-pip{background:var(--teal-mid);}
.step-pip{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.18);flex-shrink:0;}
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.topbar{height:var(--hdr-h);background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:14px;position:sticky;top:0;z-index:50;}
.tb-bread{flex:1;font-size:12.5px;color:var(--slate);}
.tb-bread strong{color:var(--navy);font-weight:700;}
.tb-actions{display:flex;align-items:center;gap:10px;}
.icon-btn{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--border);cursor:pointer;font-size:15px;transition:background .15s;position:relative;}
.icon-btn:hover{background:#E2EAF4;}
.ndot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--amber-mid);border-radius:50%;border:2px solid #fff;}
.page-content{padding:28px;flex:1;}
.ph{margin-bottom:24px;}
.ph-title{font-family:'Sora',sans-serif;font-size:21px;font-weight:800;color:var(--navy);letter-spacing:-.3px;}
.ph-sub{font-size:13px;color:var(--slate);margin-top:4px;}
.card{background:var(--white);border-radius:14px;border:1px solid var(--border);padding:22px;}
.card-title{font-family:'Sora',sans-serif;font-weight:700;font-size:13.5px;color:var(--navy);margin-bottom:3px;}
.card-sub{font-size:12px;color:var(--slate);margin-bottom:16px;}
.stat-card{background:var(--white);border-radius:14px;border:1px solid var(--border);padding:18px 20px;display:flex;align-items:flex-start;gap:14px;}
.stat-icon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}
.stat-val{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:var(--navy);}
.stat-lbl{font-size:11.5px;color:var(--slate);margin-top:2px;}
.stat-delta{font-size:11.5px;font-weight:600;margin-top:5px;}
.up{color:var(--teal);}
.dn{color:var(--rose);}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;}
.g12{display:grid;grid-template-columns:1fr 2fr;gap:20px;}
.g21{display:grid;grid-template-columns:2fr 1fr;gap:20px;}
.mt16{margin-top:16px;}
.mt20{margin-top:20px;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif;}
.btn-primary{background:var(--navy);color:#fff;}
.btn-primary:hover{background:var(--navy-mid);}
.btn-teal{background:var(--teal);color:#fff;}
.btn-teal:hover{background:#0B7A72;}
.btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--navy);}
.btn-outline:hover{border-color:var(--teal);color:var(--teal);}
.btn-danger{background:var(--rose-light);color:var(--rose);}
.btn-danger:hover{background:var(--rose);color:#fff;}
.btn-amber{background:var(--amber-light);color:var(--amber);}
.btn-amber:hover{background:var(--amber);color:#fff;}
.btn-sm{padding:6px 14px;font-size:12px;border-radius:7px;}
.btn-xs{padding:4px 10px;font-size:11.5px;border-radius:6px;}
.fg{margin-bottom:16px;}
.fl{display:block;font-size:12px;font-weight:700;color:var(--navy);margin-bottom:5px;letter-spacing:.1px;}
.fi,.fs,.fta{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:9px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:var(--navy);background:var(--white);outline:none;transition:border .15s;}
.fi:focus,.fs:focus,.fta:focus{border-color:var(--teal);}
.fta{resize:vertical;}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.b-teal{background:var(--teal-light);color:var(--teal);}
.b-amber{background:var(--amber-light);color:var(--amber);}
.b-navy{background:#E8EEF8;color:var(--navy);}
.b-rose{background:var(--rose-light);color:var(--rose);}
.b-gray{background:#F1F5F9;color:var(--slate);}
.tag{display:inline-block;padding:2px 9px;border-radius:6px;background:#E8F4F3;color:var(--teal);font-size:11px;font-weight:700;margin:2px;}
.stepper{display:flex;align-items:center;margin-bottom:28px;}
.step-item{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;}
.step-item:not(:last-child)::after{content:'';position:absolute;top:16px;left:calc(50% + 16px);right:calc(-50% + 16px);height:2px;background:var(--border);}
.step-item.done:not(:last-child)::after{background:var(--teal-mid);}
.step-circle{width:32px;height:32px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--slate);background:#fff;transition:all .2s;position:relative;z-index:1;font-family:'Sora',sans-serif;}
.step-item.done .step-circle{background:var(--teal-mid);border-color:var(--teal-mid);color:#fff;}
.step-item.current .step-circle{border-color:var(--teal-mid);color:var(--teal);background:var(--teal-light);}
.step-lbl{font-size:11px;font-weight:600;color:var(--slate);margin-top:5px;text-align:center;}
.step-item.done .step-lbl,.step-item.current .step-lbl{color:var(--teal);}
.upbox{border:2px dashed var(--border);border-radius:11px;padding:22px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s;}
.upbox:hover{border-color:var(--teal-mid);background:var(--teal-light);}
.upbox-icon{font-size:28px;margin-bottom:6px;}
.upbox-text{font-size:12.5px;color:var(--slate);}
.upbox-text strong{color:var(--teal);}
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{text-align:left;font-size:11px;font-weight:700;letter-spacing:.5px;color:var(--slate);text-transform:uppercase;padding:9px 14px;border-bottom:1px solid var(--border);background:var(--bg);}
tbody td{padding:12px 14px;font-size:13px;border-bottom:1px solid var(--border);}
tbody tr:hover{background:#F8FAFC;}
tbody tr:last-child td{border-bottom:none;}
.prog-wrap{background:var(--bg);border-radius:8px;height:7px;overflow:hidden;}
.prog-bar{height:100%;border-radius:8px;transition:width .5s;}
.tl{position:relative;padding-left:26px;}
.tl::before{content:'';position:absolute;left:9px;top:0;bottom:0;width:2px;background:var(--border);}
.tl-item{position:relative;margin-bottom:18px;}
.tl-dot{position:absolute;left:-21px;top:3px;width:11px;height:11px;border-radius:50%;border:2px solid var(--teal-mid);background:#fff;}
.tl-dot.done{background:var(--teal-mid);}
.tl-title{font-weight:700;font-size:13px;color:var(--navy);}
.tl-meta{font-size:11.5px;color:var(--slate);margin-top:1px;}
.vs{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1.5px solid var(--border);border-radius:11px;margin-bottom:10px;transition:border-color .15s;}
.vs.active{border-color:var(--teal-mid);background:var(--teal-light);}
.vs.done{border-color:var(--teal-mid);background:#F0FDF4;}
.vs-num{width:26px;height:26px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;color:var(--slate);flex-shrink:0;}
.vs.active .vs-num{background:var(--teal-mid);color:#fff;}
.vs.done .vs-num{background:var(--teal);color:#fff;}
.notif{display:flex;gap:11px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border);}
.notif:last-child{border-bottom:none;}
.notif-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.notif-txt{font-size:12.5px;line-height:1.4;}
.notif-time{font-size:10.5px;color:var(--slate);margin-top:2px;}
.proj-card{background:var(--white);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:box-shadow .2s,transform .2s;cursor:pointer;}
.proj-card:hover{box-shadow:0 6px 24px rgba(15,31,61,.09);transform:translateY(-2px);}
.proj-img{height:96px;display:flex;align-items:center;justify-content:center;font-size:30px;}
.proj-body{padding:14px;}
.proj-name{font-family:'Sora',sans-serif;font-weight:700;font-size:13.5px;color:var(--navy);margin-bottom:3px;}
.proj-org{font-size:11.5px;color:var(--slate);margin-bottom:8px;}
.proj-footer{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.fund-meter{margin-top:8px;}
.fund-label{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;}
.fund-label .raised{font-weight:800;font-size:15px;color:var(--teal);}
.fund-label .goal{color:var(--slate);}
.cat-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:20px;border:1.5px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;margin:2px;}
.cat-pill.active{border-color:var(--teal-mid);background:var(--teal-light);color:var(--teal);}
.cat-pill:hover{border-color:var(--teal-mid);}
.info-box{border-radius:10px;padding:12px 14px;font-size:12.5px;line-height:1.6;}
.info-amber{background:var(--amber-light);color:var(--amber);border:1px solid #FDE68A;}
.info-teal{background:var(--teal-light);color:var(--teal);border:1px solid #99F6E4;}
.draft-banner{background:var(--amber-light);border:1px solid #FDE68A;border-radius:10px;padding:10px 16px;display:flex;align-items:center;gap:12px;font-size:12.5px;color:var(--amber);margin-bottom:18px;}
.milestone{display:flex;gap:10px;align-items:center;padding:10px 14px;border-radius:9px;border:1.5px solid var(--border);margin-bottom:8px;}
.ms-icon{font-size:18px;}
.ms-body{flex:1;}
.ms-title{font-size:13px;font-weight:600;color:var(--navy);}
.ms-meta{font-size:11.5px;color:var(--slate);}
.rte-bar{display:flex;gap:2px;padding:6px 8px;border:1.5px solid var(--border);border-bottom:none;border-radius:9px 9px 0 0;background:var(--bg);}
.rte-btn{width:28px;height:28px;border-radius:6px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:700;color:var(--navy);display:flex;align-items:center;justify-content:center;transition:background .1s;}
.rte-btn:hover{background:var(--border);}
.rte-body{border:1.5px solid var(--border);border-radius:0 0 9px 9px;padding:12px;min-height:90px;font-size:13.5px;}
.flex{display:flex;}.ic{align-items:center;}.jb{justify-content:space-between;}.gap10{gap:10px;}.gap12{gap:12px;}
.success-banner{background:var(--teal-light);border:1px solid #99F6E4;border-radius:10px;padding:12px 14px;font-size:12.5px;color:var(--teal);margin-bottom:18px;}
.tog{position:relative;width:40px;height:22px;cursor:pointer;}
.tog input{opacity:0;width:0;height:0;}
.tog-track{position:absolute;inset:0;background:var(--border);border-radius:11px;transition:.2s;}
.tog input:checked + .tog-track{background:var(--teal-mid);}
.tog-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.tog input:checked ~ .tog-thumb{transform:translateX(18px);}
.nav-item.locked{opacity:0.4;cursor:not-allowed;}
.nav-item.locked:hover{background:transparent;color:rgba(255,255,255,.55);}
.nav-item.locked .nav-badge{background:rgba(255,255,255,.18);}
.alert-banner{background:var(--amber-light);border:1px solid var(--amber-mid);border-radius:10px;padding:12px 16px;font-size:12.5px;color:var(--amber);margin-bottom:18px;}
.auth-page{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#0A1730,var(--teal));}
.auth-card{width:min(100%,880px);display:grid;grid-template-columns:.85fr 1.15fr;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 65px rgba(0,0,0,.3);}
.auth-side{padding:46px 38px;background:linear-gradient(160deg,var(--navy),var(--teal));color:#fff;display:flex;flex-direction:column;justify-content:space-between;}
.auth-side h1{font-family:'Sora',sans-serif;font-size:34px;line-height:1.15;margin:24px 0 12px;}
.auth-side p{line-height:1.6;color:rgba(255,255,255,.8)}
.auth-panel{padding:42px;}
.auth-panel h2{font-family:'Sora',sans-serif;font-size:25px;margin-bottom:6px}
.auth-panel>p{font-size:14px;color:var(--slate);margin-bottom:22px}
.auth-tabs{display:flex;background:var(--bg);padding:4px;border-radius:10px;margin-bottom:20px}
.auth-tabs button{flex:1;border:0;background:transparent;padding:9px;border-radius:7px;font:600 13px 'DM Sans',sans-serif;color:var(--slate);cursor:pointer}
.auth-tabs button.active{background:#fff;color:var(--navy);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.auth-error{background:var(--rose-light);color:var(--rose);border-radius:8px;padding:10px 12px;font-size:12.5px;margin-bottom:14px}
.auth-form{display:grid;gap:14px}
.auth-form .fg{margin:0}
.auth-note{font-size:12px;color:var(--slate);line-height:1.5}
.auth-form .btn{justify-content:center}
@media(max-width:700px){.auth-card{grid-template-columns:1fr}.auth-side{padding:28px;min-height:190px}.auth-side h1{font-size:27px;margin:12px 0}.auth-panel{padding:28px 22px}}
`;

const NPO_STEPS = ['NPO Account', 'Basic Info', 'Certification', 'Bank Account'];
const CAUSE_OPTS = ['🏫 Education','🍽️ Food Relief','🌍 International Aid','🏥 Healthcare','♻️ Environment','🏘️ Housing','🤝 Refugees','👶 Children'];
const GATED_PAGES = ['proj-list', 'proj-new', 'proj-targets', 'proj-materials', 'proj-reports'];
const isRegistrationComplete = (u) => Boolean(u && u.phone && u.kyc_id_number && u.bank_account);
const STATUS_META = {
  draft:     { label: 'Draft',           cls: 'b-gray' },
  pending:   { label: 'Pending Review',  cls: 'b-amber' },
  approved:  { label: 'Approved',        cls: 'b-teal' },
  rejected:  { label: 'Rejected',        cls: 'b-rose' },
  open:      { label: 'Active',          cls: 'b-teal' },
  invited:   { label: 'Active',          cls: 'b-teal' },
  closed:    { label: 'Closed',          cls: 'b-gray' },
  completed: { label: 'Completed',       cls: 'b-navy' },
};

const PROJ_GRADIENTS = [
  'linear-gradient(135deg,#1565C0,#0D9488)',
  'linear-gradient(135deg,#D97706,#FB8C00)',
  'linear-gradient(135deg,#1A237E,#0891B2)',
  'linear-gradient(135deg,#004D40,#26A69A)',
  'linear-gradient(135deg,#7C3AED,#4F46E5)',
];

export default function NPODashboard() {
  const [page, setPage] = useState('npo-overview');
  const [regStep, setRegStep] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [causes, setCauses] = useState([]);
  const [orgForm, setOrgForm] = useState({ fullName:'', title:'', email:'', phone:'', country:'Japan' });
  const [basicForm, setBasicForm] = useState({ legalName:'', displayName:'', year:'', website:'', officialEmail:'' });
  const [kycForm, setKycForm] = useState({ idType:'Passport', idNumber:'' });
  const [bankForm, setBankForm] = useState({ holder:'', bank:'', branch:'', account:'', type:'Checking' });
  const [projForm, setProjForm] = useState({ name:'', category:'♻️ Environment & Clean Water', platform:'Kickstarter', url:'', description:'', goal:'', startDate:'', endDate:'', impactStatement:'' });
  const [regError, setRegError] = useState('');
  const [lockedNotice, setLockedNotice] = useState(false);

  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('socia_npo_session')); } catch { return null; }
  });
  const [authMode, setAuthMode] = useState('signin');
  const [authFields, setAuthFields] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [npoId, setNpoId] = useState(() => {
    const stored = localStorage.getItem('socia_npo_id');
    return stored ? Number(stored) : null;
  });

  const [myProjects, setMyProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const fetchMyProjects = (id) => {
    if (!id) return;
    setProjectsLoading(true);
    getNPOProjects(id)
      .then(r => setMyProjects(r.data || []))
      .catch(() => setMyProjects([]))
      .finally(() => setProjectsLoading(false));
  };

  useEffect(() => { fetchMyProjects(npoId); }, [npoId]);

  const registrationComplete = isRegistrationComplete(authUser);

  const nav = (p) => {
    if (GATED_PAGES.includes(p) && !registrationComplete) {
      setLockedNotice(true);
      setPage('npo-overview');
      return;
    }
    setLockedNotice(false);
    setPage(p);
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError(''); setAuthLoading(true);
    try {
      const response = authMode === 'signin'
        ? await signInNPO({ name: authFields.name, password: authFields.password })
        : await signUpNPO({ name: authFields.name, email: authFields.email, password: authFields.password });
      const org = response.data.user;
      localStorage.setItem('socia_npo_session', JSON.stringify(org));
      localStorage.setItem('socia_npo_id', String(org.id));
      setNpoId(org.id);
      setAuthUser(org);
      setOrgForm(f => ({ ...f, fullName: org.admin_name || f.fullName, email: org.email || f.email, phone: org.phone || f.phone, country: org.country || f.country }));
      setPage(authMode === 'signup' ? 'npo-register' : 'npo-overview');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Unable to authenticate. Please try again.');
    } finally { setAuthLoading(false); }
  };

  const handleSignOut = () => {
    localStorage.removeItem('socia_npo_session');
    localStorage.removeItem('socia_npo_id');
    setAuthUser(null);
    setNpoId(null);
    setPage('npo-overview');
  };

  if (!authUser) {
    return <><style>{S}</style><main className="auth-page"><section className="auth-card">
      <aside className="auth-side"><div><img src="/Socia Logo.png" alt="Socia" style={{ height: 32, width: 'auto' }} /><h1>Fund your mission. Reach real creators.</h1><p>Register your nonprofit and launch crowdfunding campaigns creators can promote.</p></div><small>For nonprofits and NGOs</small></aside>
      <div className="auth-panel"><h2>{authMode === 'signin' ? 'Welcome back' : 'Register your organization'}</h2><p>{authMode === 'signin' ? 'Sign in to manage your campaigns and organization profile.' : 'Create your account, then complete the secure organization onboarding.'}</p>
        <div className="auth-tabs"><button className={authMode === 'signin' ? 'active' : ''} onClick={() => { setAuthMode('signin'); setAuthError(''); }}>Sign in</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Create account</button></div>
        {authError && <div className="auth-error">{authError}</div>}
        <form className="auth-form" onSubmit={handleAuth}>
          <div className="fg"><label className="fl">Full name</label><input className="fi" required value={authFields.name} onChange={e => setAuthFields(f => ({ ...f, name: e.target.value }))} autoComplete="name" /></div>
          {authMode === 'signup' && <div className="fg"><label className="fl">Email address</label><input className="fi" required type="email" value={authFields.email} onChange={e => setAuthFields(f => ({ ...f, email: e.target.value }))} autoComplete="email" /></div>}
          <div className="fg"><label className="fl">Password</label><input className="fi" required type="password" minLength="8" value={authFields.password} onChange={e => setAuthFields(f => ({ ...f, password: e.target.value }))} autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'} /></div>
          {authMode === 'signup' && <p className="auth-note">Next, we'll collect your organization's basic info, certification documents, and recipient bank details using the existing onboarding flow.</p>}
          <button className="btn btn-teal" type="submit" disabled={authLoading}>{authLoading ? 'Please wait…' : authMode === 'signin' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
    </section></main></>;
  }

  const handleSubmitNPO = async () => {
    const missing = [];
    if (!orgForm.phone) missing.push('phone number');
    if (!kycForm.idNumber) missing.push('ID number');
    if (!bankForm.account || !bankForm.bank || !bankForm.branch || !bankForm.holder) missing.push('bank account details');
    if (missing.length) {
      setRegError(`Please complete: ${missing.join(', ')} before submitting.`);
      return;
    }
    setRegError('');
    setSubmitting(true);
    try {
      const payload = { ...orgForm, ...basicForm, ...kycForm, ...bankForm, causes };
      const res = npoId
        ? await updateNPO(npoId, payload)
        : await registerNPO(payload);
      const id = res.data?.id;
      if (id) {
        setNpoId(id);
        localStorage.setItem('socia_npo_id', String(id));
      }
      const updatedUser = {
        ...authUser,
        org_name: basicForm.legalName || basicForm.displayName || authUser.org_name,
        admin_name: orgForm.fullName || authUser.admin_name,
        org_type: orgForm.title || authUser.org_type,
        email: orgForm.email || authUser.email,
        phone: orgForm.phone,
        country: orgForm.country,
        website: basicForm.website,
        kyc_id_type: kycForm.idType,
        kyc_id_number: kycForm.idNumber,
        bank_name: bankForm.bank,
        bank_account: bankForm.account,
        bank_branch: bankForm.branch,
        bank_account_name: bankForm.holder,
      };
      setAuthUser(updatedUser);
      localStorage.setItem('socia_npo_session', JSON.stringify(updatedUser));
      setSubmitted(true);
      setLockedNotice(false);
      nav('npo-overview');
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleSubmitProject = async () => {
    setSubmitting(true);
    try {
      await createProject({ ...projForm, npo_id: npoId, organization: authUser.org_name || authUser.admin_name });
      setProjectSubmitted(true);
      fetchMyProjects(npoId);
      nav('proj-list');
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const toggleCause = (c) => setCauses(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);

  const breadcrumbs = {
    'npo-overview': ['Organization Setup', 'Registration Overview'],
    'npo-register': ['Organization Setup', 'New NPO Registration'],
    'npo-basic': ['Organization Setup', 'Basic Information'],
    'npo-certify': ['Organization Setup', 'Certification & KYC'],
    'npo-recipient': ['Organization Setup', 'Recipient Bank Info'],
    'proj-list': ['Campaign Projects', 'My Projects'],
    'proj-new': ['Campaign Projects', 'Create New Project'],
    'proj-targets': ['Campaign Projects', 'Targets & Timelines'],
    'proj-materials': ['Campaign Projects', 'Promotional Materials'],
    'proj-reports': ['Campaign Projects', 'Activity Reports'],
  };

  const bc = breadcrumbs[page] || ['', page];

  return (
    <>
      <style>{S}</style>
      <div className="npo-layout" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sb-logo">
            <img src="/Socia Logo.png" alt="Socia" style={{ height:30, width:'auto', objectFit:'contain' }} />
            <span className="sb-logo-badge">NPO</span>
          </div>
          <div className="sb-org">
            <div className="sb-org-avatar">{(authUser.org_name || authUser.admin_name || 'NP').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="sb-org-name">{authUser.org_name || authUser.admin_name}</div>
              <div className="sb-org-type">Nonprofit Organization</div>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-section-label">Organization Setup</div>
            <div className={`nav-item${page === 'npo-overview' ? ' active' : ''}`} onClick={() => nav('npo-overview')}>
              <span className="nav-icon">🏠</span> Registration Overview
            </div>
            {[
              { key: 'npo-register', done: regStep > 0, label: '1. New NPO Registration' },
              { key: 'npo-basic', done: regStep > 1, label: '2. Basic Information' },
              { key: 'npo-certify', done: regStep > 2, label: '3. Certification & KYC' },
              { key: 'npo-recipient', done: false, label: '4. Recipient / Bank Info' },
            ].map(({ key, done, label }) => (
              <div key={key} className={`sb-step${done ? ' done' : ''}`} onClick={() => nav(key)}>
                <div className="step-pip" /> {label}
              </div>
            ))}
          </div>

          <div className="sb-section">
            <div className="sb-section-label">Campaign Projects</div>
            {[
              { key: 'proj-list', icon: '📋', label: 'My Projects', badge: '4' },
              { key: 'proj-new', icon: '➕', label: 'Create New Project' },
              { key: 'proj-targets', icon: '🎯', label: 'Targets & Timelines' },
              { key: 'proj-materials', icon: '🖼️', label: 'Promotional Materials' },
              { key: 'proj-reports', icon: '📊', label: 'Activity Reports', badge: '2' },
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
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="tb-bread">
              {bc[0]} / <strong>{bc[1]}</strong>
            </div>
            <div className="tb-actions">
              <div className="icon-btn" onClick={() => nav('proj-list')}>🔍</div>
              <div className="icon-btn" onClick={() => nav('proj-reports')}>🔔<span className="ndot" /></div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{authUser.org_name || authUser.admin_name}</span>
              <div className="sb-org-avatar" style={{ cursor: 'pointer' }} onClick={() => nav('npo-register')}>{(authUser.org_name || authUser.admin_name || 'NP').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div className="icon-btn" title="Sign out" onClick={handleSignOut}>🚪</div>
            </div>
          </header>

          <div className="page-content fade-up" key={page}>

            {/* ── NPO OVERVIEW ── */}
            {page === 'npo-overview' && (
              <>
                <div className="ph">
                  <div className="ph-title">Registration Overview</div>
                  <div className="ph-sub">Complete all 4 steps to activate your NPO account and start listing crowdfunding campaigns.</div>
                </div>
                {submitted && <div className="success-banner">✅ Your NPO registration has been submitted. The Socia admin team will review and approve your account shortly.</div>}
                {projectSubmitted && <div className="success-banner">✅ Your project has been submitted for admin review. Once approved it will be visible to influencers.</div>}
                {!registrationComplete && lockedNotice && (
                  <div className="alert-banner">🔒 Complete your NPO Account, Basic Info, Certification, and Bank Account details before you can access Campaign Projects.</div>
                )}

                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i < regStep ? ' done' : i === regStep ? ' current' : ''}`}>
                      <div className="step-circle">{i < regStep ? '✓' : i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>

                <div className="g4">
                  {[
                    { icon:'👤', bg:'#EEF2FF', val:'Pending', lbl:'NPO Account Created', delta:'Complete step 1', dt:'dn', pg:'npo-register' },
                    { icon:'🏢', bg:'#F0FDF4', val:'Pending', lbl:'Basic Info Registered', delta:'Complete step 2', dt:'dn', pg:'npo-basic' },
                    { icon:'🏅', bg:'var(--teal-light)', val:'Pending', lbl:'501(c)(3) Verified', delta:'Upload documents', dt:'dn', pg:'npo-certify' },
                    { icon:'🏦', bg:'var(--amber-light)', val:'Pending', lbl:'Recipient Bank Info', delta:'Action required', dt:'dn', pg:'npo-recipient' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card" onClick={() => nav(s.pg)} style={{ cursor:'pointer' }}>
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                        <div className={`stat-delta ${s.dt}`}>{s.delta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt20">
                  <div className="card">
                    <div className="card-title">Next Step: Register Your NPO</div>
                    <div className="card-sub">Complete all 4 registration steps before you can list campaigns. Admin approval is required before your NPO goes live.</div>
                    <div className="flex ic gap12">
                      <button className="btn btn-teal" onClick={() => nav('npo-register')}>Start Registration →</button>
                      <button className="btn btn-outline" onClick={() => nav('proj-new')}>Create a Project</button>
                    </div>
                  </div>
                </div>

                <div className="mt20">
                  <div className="card">
                    <div className="card-title">Recent Activity</div>
                    {[
                      { icon:'📩', bg:'var(--amber-light)', txt:'Welcome to Socia! Complete your NPO registration to start listing campaigns.', time:'Just now' },
                      { icon:'💬', bg:'#EEF2FF', txt:'Once registered and approved, your campaigns will be visible to <strong>300+ creators</strong>.', time:'Today' },
                    ].map((n, i) => (
                      <div key={i} className="notif">
                        <div className="notif-ic" style={{ background: n.bg }}>{n.icon}</div>
                        <div>
                          <div className="notif-txt" dangerouslySetInnerHTML={{ __html: n.txt }} />
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── NPO REGISTER (Step 1) ── */}
            {page === 'npo-register' && (
              <>
                <div className="ph">
                  <div className="ph-title">New NPO Registration</div>
                  <div className="ph-sub">Create your organization's Socia account. Fields marked * are required.</div>
                </div>
                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i === 0 ? ' current' : ''}`}>
                      <div className="step-circle">{i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="card-title">Administrator Account</div>
                    <div className="card-sub">The primary contact person managing this NPO profile</div>
                    {[
                      { label:'Full Name *', key:'fullName', placeholder:'Sarah Mitchell' },
                      { label:'Job Title', key:'title', placeholder:'Executive Director' },
                      { label:'Email Address *', key:'email', placeholder:'sarah@org.org' },
                      { label:'Phone Number *', key:'phone', placeholder:'+1 312 555 0174' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="fg">
                        <label className="fl">{label}</label>
                        <input className="fi" value={orgForm[key]} placeholder={placeholder}
                          onChange={e => setOrgForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="fg" style={{ marginBottom:0 }}>
                      <label className="fl">Country *</label>
                      <select className="fs" value={orgForm.country} onChange={e => setOrgForm(f => ({ ...f, country: e.target.value }))}>
                        {['Japan','United States','United Kingdom','Canada','Germany','Australia'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="card">
                      <div className="card-title">Organization Type</div>
                      <div className="card-sub">Select all applicable categories</div>
                      <div style={{ marginBottom:12 }}>
                        {CAUSE_OPTS.map(c => (
                          <div key={c} className={`cat-pill${causes.includes(c) ? ' active' : ''}`} onClick={() => toggleCause(c)}>{c}</div>
                        ))}
                      </div>
                      <div className="fg" style={{ marginBottom:0 }}>
                        <label className="fl">Short Organization Bio</label>
                        <textarea className="fta" rows={3} placeholder="Describe your organization's mission..." />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt20 flex jb ic gap12">
                  <button className="btn btn-outline">Save Draft</button>
                  <button className="btn btn-teal" onClick={() => nav('npo-basic')}>Next: Basic Information →</button>
                </div>
              </>
            )}

            {/* ── BASIC INFO (Step 2) ── */}
            {page === 'npo-basic' && (
              <>
                <div className="ph">
                  <div className="ph-title">Organization Basic Information</div>
                  <div className="ph-sub">Register your organization's official details, address, and public-facing profile.</div>
                </div>
                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i < 1 ? ' done' : i === 1 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 1 ? '✓' : i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="card-title">Official Organization Details</div>
                    <div className="card-sub">As registered with government authorities</div>
                    {[
                      { label:'Legal Organization Name *', key:'legalName', placeholder:'HopeForward Foundation Inc.' },
                      { label:'Display / Brand Name', key:'displayName', placeholder:'HopeForward Foundation' },
                      { label:'Year Founded', key:'year', placeholder:'2011' },
                      { label:'Website URL', key:'website', placeholder:'https://www.yourorg.org' },
                      { label:'Official Email', key:'officialEmail', placeholder:'contact@yourorg.org' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="fg">
                        <label className="fl">{label}</label>
                        <input className="fi" value={basicForm[key]} placeholder={placeholder}
                          onChange={e => setBasicForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Registered Address</div>
                      <div className="card-sub">Primary office or mailing address</div>
                      <div className="fg"><label className="fl">Street Address *</label><input className="fi" placeholder="123 Main St, Suite 100" /></div>
                      <div className="g2" style={{ gap:10 }}>
                        <div className="fg"><label className="fl">City *</label><input className="fi" placeholder="Chicago" /></div>
                        <div className="fg"><label className="fl">State</label><input className="fi" placeholder="Illinois" /></div>
                      </div>
                      <div className="g2" style={{ gap:10 }}>
                        <div className="fg"><label className="fl">ZIP Code</label><input className="fi" placeholder="60601" /></div>
                        <div className="fg"><label className="fl">Country</label><select className="fs">{['Japan','United States','United Kingdom','Canada','Germany','Australia'].map(c => <option key={c}>{c}</option>)}</select></div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Organization Logo</div>
                      <div className="card-sub">Shown publicly on your campaign pages</div>
                      <div className="upbox">
                        <div className="upbox-icon">🖼️</div>
                        <div className="upbox-text"><strong>Click to upload</strong> your logo (PNG, SVG)</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:4 }}>PNG, SVG — max 2MB, min 200×200px</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt20 flex jb ic gap12">
                  <button className="btn btn-outline" onClick={() => nav('npo-register')}>← Back</button>
                  <button className="btn btn-teal" onClick={() => nav('npo-certify')}>Next: Certification & KYC →</button>
                </div>
              </>
            )}

            {/* ── CERTIFICATION (Step 3) ── */}
            {page === 'npo-certify' && (
              <>
                <div className="ph">
                  <div className="ph-title">Group Certification & Identity Verification</div>
                  <div className="ph-sub">Submit key personnel identity details for verification. Reviewed within 48 hours.</div>
                </div>
                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i < 2 ? ' done' : i === 2 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 2 ? '✓' : i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ maxWidth: 460 }}>
                  <div className="card-title">Key Personnel Identity Verification</div>
                  <div className="card-sub">Government-issued ID for the account administrator</div>
                  <div className="fg">
                    <label className="fl">ID Type</label>
                    <select className="fs" value={kycForm.idType} onChange={e => setKycForm(f => ({ ...f, idType: e.target.value }))}>
                      {['My Number Card', 'Residence Card', 'Passport', "Driver's License", 'State ID'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="fg" style={{ marginBottom:0 }}>
                    <label className="fl">ID Number</label>
                    <input className="fi" value={kycForm.idNumber} placeholder="Enter ID number"
                      onChange={e => setKycForm(f => ({ ...f, idNumber: e.target.value }))} />
                  </div>
                </div>
                <div className="mt20 flex jb ic gap12">
                  <button className="btn btn-outline" onClick={() => nav('npo-basic')}>← Back</button>
                  <button className="btn btn-teal" onClick={() => nav('npo-recipient')}>Next: Recipient Bank Info →</button>
                </div>
              </>
            )}

            {/* ── RECIPIENT INFO (Step 4) ── */}
            {page === 'npo-recipient' && (
              <>
                <div className="ph">
                  <div className="ph-title">Recipient Account & Bank Information</div>
                  <div className="ph-sub">Register the bank account where all donation funds raised through Socia will be disbursed.</div>
                </div>
                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i < 3 ? ' done' : i === 3 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 3 ? '✓' : i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="card-title">Recipient Account Details</div>
                    <div className="card-sub">This account will receive all donation disbursements</div>
                    {[
                      { label:'Account Holder Name (Legal) *', key:'holder', placeholder:'Exactly as registered with bank' },
                      { label:'Account Number *', key:'account', placeholder:'Enter checking account number' },
                      { label:'Bank Name *', key:'bank', placeholder:'Enter your bank name' },
                      { label:'Bank Branch Name *', key:'branch', placeholder:'Enter your bank branch name' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="fg">
                        <label className="fl">{label}</label>
                        <input className="fi" value={bankForm[key]} placeholder={placeholder}
                          onChange={e => setBankForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="fg" style={{ marginBottom:0 }}>
                      <label className="fl">Account Type</label>
                      <select className="fs" value={bankForm.type} onChange={e => setBankForm(f => ({ ...f, type: e.target.value }))}>
                        {['Checking','Savings'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Disbursement Schedule</div>
                      <div className="card-sub">How funds will be transferred to your account</div>
                      <div className="fg">
                        <label className="fl">Disbursement Frequency</label>
                        <select className="fs">
                          <option>Monthly (Recommended)</option>
                          <option>Bi-weekly</option>
                          <option>Weekly</option>
                          <option>On campaign close</option>
                        </select>
                      </div>
                      <div className="fg">
                        <label className="fl">Minimum Disbursement Threshold</label>
                        <select className="fs">
                          <option>$100</option><option>$250</option><option>$500</option><option>No minimum</option>
                        </select>
                      </div>
                      <div className="info-box info-amber">
                        ⚠️ A <strong>$0.01 test deposit</strong> will be sent to verify your account. Socia deducts a <strong>3.5% platform fee</strong> before disbursement.
                      </div>
                    </div>
                  </div>
                </div>
                {regError && <div className="auth-error mt16">{regError}</div>}
                <div className="mt20 flex jb ic gap12">
                  <button className="btn btn-outline" onClick={() => nav('npo-certify')}>← Back</button>
                  <button className="btn btn-teal" onClick={handleSubmitNPO} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Save & Complete Registration ✓'}
                  </button>
                </div>
              </>
            )}

            {/* ── PROJECT LIST ── */}
            {page === 'proj-list' && (
              <>
                <div className="ph flex jb ic">
                  <div>
                    <div className="ph-title">My Campaign Projects</div>
                    <div className="ph-sub">Manage all your crowdfunding campaigns on Socia.</div>
                  </div>
                  <button className="btn btn-teal" onClick={() => nav('proj-new')}>➕ Create New Project</button>
                </div>

                {projectSubmitted && <div className="success-banner">✅ Project submitted for admin review. You'll be notified once it's approved and visible to influencers.</div>}

                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }}>
                  {[
                    { icon:'📋', bg:'var(--teal-light)', val:String(myProjects.length), lbl:'Total Projects', delta:`${myProjects.filter(p => ['open','invited','approved'].includes(p.status)).length} active` },
                    { icon:'💵', bg:'#EEF2FF', val:`$${myProjects.reduce((s, p) => s + Number(p.raised_amount || 0), 0).toLocaleString()}`, lbl:'Total Raised', delta:'Across all campaigns' },
                    { icon:'🤳', bg:'#F0FDF4', val:String(myProjects.reduce((s, p) => s + Number(p.creator_count || 0), 0)), lbl:'Active Creators', delta:'Promoting causes' },
                    { icon:'🔗', bg:'#EDE9FE', val:String(myProjects.reduce((s, p) => s + Number(p.total_clicks || 0), 0)), lbl:'Referral Link Clicks', delta:'Across all creators' },
                    { icon:'⏳', bg:'var(--amber-light)', val:String(myProjects.filter(p => p.status === 'pending').length), lbl:'Pending Admin Review', delta:'Awaiting approval' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card">
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                        <div className="stat-delta up">{s.delta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {projectsLoading && <div style={{ color:'var(--slate)', fontSize:13, padding:'20px 0' }}>Loading your projects…</div>}
                {!projectsLoading && myProjects.length === 0 && (
                  <div className="card" style={{ textAlign:'center', padding:'40px 0', color:'var(--slate)', fontSize:14 }}>
                    You haven't created any projects yet. <button className="btn btn-teal btn-sm" style={{ marginLeft:10 }} onClick={() => nav('proj-new')}>Create Your First Project →</button>
                  </div>
                )}
                <div className="g2">
                  {myProjects.map((p, i) => {
                    const meta = STATUS_META[p.status] || { label: p.status, cls: 'b-gray' };
                    const goalAmt = Number(p.goal_amount || 0);
                    const raisedAmt = Number(p.raised_amount || 0);
                    return (
                      <div key={p.id} className="proj-card" onClick={() => nav('proj-list')}>
                        <div className="proj-img" style={{ background: PROJ_GRADIENTS[i % PROJ_GRADIENTS.length] }}>{p.emoji || '🌍'}</div>
                        <div className="proj-body">
                          <div className="flex jb ic">
                            <div className="proj-name">{p.title}</div>
                            <span className={`badge ${meta.cls}`}>{meta.label}</span>
                          </div>
                          <div className="proj-org">{p.category} · {p.organization}</div>
                          {p.status === 'rejected' && p.reject_reason && (
                            <div style={{ fontSize:11.5, color:'var(--rose)', marginBottom:8 }}>Reason: {p.reject_reason}</div>
                          )}
                          <div className="fund-meter">
                            <div className="fund-label"><span className="raised">${raisedAmt.toLocaleString()}</span><span className="goal">of {goalAmt ? `$${goalAmt.toLocaleString()}` : (p.goal || '—')} goal</span></div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width: `${goalAmt ? Math.min(Math.round(raisedAmt / goalAmt * 100), 100) : 0}%`, background: 'var(--teal-mid)' }} /></div>
                          </div>
                          <div className="proj-footer">
                            <div><div style={{ fontSize:11, color:'var(--slate)' }}>Creators</div><div style={{ fontWeight:700, fontSize:13 }}>{p.creator_count || 0} promoting</div></div>
                            <div><div style={{ fontSize:11, color:'var(--slate)' }}>Link Clicks</div><div style={{ fontWeight:700, fontSize:13 }}>🔗 {p.total_clicks || 0}</div></div>
                            <div><div style={{ fontSize:11, color:'var(--slate)' }}>Deadline</div><div style={{ fontWeight:700, fontSize:13 }}>{p.deadline ? new Date(p.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—'}</div></div>
                          </div>
                          {p.category && <div style={{ marginTop:8 }}><span className="tag">{p.category}</span></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── CREATE PROJECT ── */}
            {page === 'proj-new' && (
              <>
                <div className="ph">
                  <div className="ph-title">Create New Project</div>
                  <div className="ph-sub">Set up a new crowdfunding campaign for your cause.</div>
                </div>
                <div className="draft-banner">💾 <strong>Auto-saved as Draft</strong> — Complete all required fields before submitting for admin review.</div>
                <div className="g21">
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Project Identity</div>
                      <div className="card-sub">Basic information shown publicly on your campaign page</div>
                      <div className="fg">
                        <label className="fl">Project Name *</label>
                        <input className="fi" value={projForm.name} placeholder="e.g. Clean Water Wells in Rural Bangladesh"
                          onChange={e => setProjForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div className="fg">
                        <label className="fl">Cause Category *</label>
                        <select className="fs" value={projForm.category} onChange={e => setProjForm(f => ({ ...f, category: e.target.value }))}>
                          {['♻️ Environment & Clean Water','🏫 Education','🍽️ Food Relief','🤝 Refugees & Immigration','🏥 Healthcare','🏘️ Housing & Shelter','👶 Children & Youth'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="fg">
                        <label className="fl">Crowdfunding Platform *</label>
                        <select className="fs" value={projForm.platform} onChange={e => setProjForm(f => ({ ...f, platform: e.target.value }))}>
                          {['Kickstarter','GoFundMe','Indiegogo','Fundly','Other'].map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="fg">
                        <label className="fl">External Campaign URL</label>
                        <input className="fi" value={projForm.url} placeholder="https://kickstarter.com/projects/..."
                          onChange={e => setProjForm(f => ({ ...f, url: e.target.value }))} />
                      </div>
                      <div className="fg" style={{ marginBottom:0 }}>
                        <label className="fl">Project Visibility</label>
                        <div className="flex ic gap10" style={{ marginTop:6 }}>
                          <label className="tog">
                            <input type="checkbox" defaultChecked />
                            <div className="tog-track" />
                            <div className="tog-thumb" />
                          </label>
                          <span style={{ fontSize:13 }}>Public — visible to all creators on Socia after admin approval</span>
                        </div>
                      </div>
                    </div>

                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Project Description *</div>
                      <div className="card-sub">Tell your story — shared with creators and donors</div>
                      <div className="rte-bar">
                        {['B','I','U','🔗','≡','•'].map(b => <button key={b} className="rte-btn">{b}</button>)}
                      </div>
                      <div className="rte-body" contentEditable suppressContentEditableWarning>
                        Describe your project's impact and goals here...
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Fundraising Target *</div>
                      <div className="card-sub">Set your goal amount and campaign window</div>
                      <div className="fg">
                        <label className="fl">Goal Amount (USD) *</label>
                        <input className="fi" value={projForm.goal} placeholder="60,000"
                          onChange={e => setProjForm(f => ({ ...f, goal: e.target.value }))} />
                      </div>
                      <div className="fg">
                        <label className="fl">Campaign Start Date *</label>
                        <input className="fi" type="date" value={projForm.startDate}
                          onChange={e => setProjForm(f => ({ ...f, startDate: e.target.value }))} />
                      </div>
                      <div className="fg" style={{ marginBottom:0 }}>
                        <label className="fl">Campaign End Date *</label>
                        <input className="fi" type="date" value={projForm.endDate}
                          onChange={e => setProjForm(f => ({ ...f, endDate: e.target.value }))} />
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Impact Statement</div>
                      <div className="card-sub">What will be achieved when fully funded?</div>
                      <textarea className="fta" rows={4} value={projForm.impactStatement} placeholder="Describe the impact when fully funded..."
                        onChange={e => setProjForm(f => ({ ...f, impactStatement: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="mt20 flex jb ic gap12">
                  <div className="flex gap12">
                    <button className="btn btn-outline">💾 Save Draft</button>
                  </div>
                  <button className="btn btn-teal" onClick={handleSubmitProject} disabled={submitting}>
                    {submitting ? 'Submitting...' : '📤 Submit for Admin Review →'}
                  </button>
                </div>
              </>
            )}

            {/* ── TARGETS ── */}
            {page === 'proj-targets' && (
              <>
                <div className="ph">
                  <div className="ph-title">Recruitment Targets & Timelines</div>
                  <div className="ph-sub">Define how many creators you need, what they should produce, and when.</div>
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="card-title">Creator Recruitment Targets</div>
                    <div className="card-sub">Set the number and type of creators needed</div>
                    <div className="g2" style={{ gap:10, marginBottom:16 }}>
                      {[['Total Creators Needed','20'],['Min. Follower Count','10,000'],['Min. Engagement Rate','3.0%'],['Creator Stipend','$400']].map(([l, v]) => (
                        <div key={l} className="fg"><label className="fl">{l}</label><input className="fi" defaultValue={v} /></div>
                      ))}
                    </div>
                    <div className="fg">
                      <label className="fl">Mandatory Hashtags</label>
                      <input className="fi" placeholder="#YourCampaign #YourOrg #CauseTag" />
                    </div>
                    <div className="fg">
                      <label className="fl">Required Tag / Mention</label>
                      <input className="fi" placeholder="@YourOrganization" />
                    </div>
                    <div className="fg" style={{ marginBottom:0 }}>
                      <label className="fl">Key Messaging Points</label>
                      <textarea className="fta" rows={3} placeholder="Key points creators must include in their content..." />
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">Campaign Timeline</div>
                    <div className="card-sub">Key milestones for the campaign</div>
                    <div className="tl">
                      {['Project Brief Ready','Creator Applications Open','Content Go-Live Window','Mid-Campaign Check-in','Campaign Close','Activity Report Due'].map((t, i) => (
                        <div key={t} className="tl-item">
                          <div className={`tl-dot${i === 0 ? ' done' : ''}`} />
                          <div className="tl-title">{t}</div>
                          <div className="tl-meta">Set date</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── MATERIALS ── */}
            {page === 'proj-materials' && (
              <>
                <div className="ph">
                  <div className="ph-title">Promotional Materials</div>
                  <div className="ph-sub">Upload assets for creators to use in their campaign content.</div>
                </div>
                <div className="g2">
                  {[
                    { icon:'🖼️', title:'Campaign Images', desc:'High-res photos for creators to share' },
                    { icon:'🎬', title:'Video Assets', desc:'B-roll footage, intro clips' },
                    { icon:'📝', title:'Campaign Brief', desc:'Detailed story and messaging guide' },
                    { icon:'🎨', title:'Brand Kit', desc:'Logos, colors, fonts for on-brand content' },
                  ].map(m => (
                    <div key={m.title} className="card">
                      <div className="card-title">{m.title}</div>
                      <div className="card-sub">{m.desc}</div>
                      <div className="upbox">
                        <div className="upbox-icon">{m.icon}</div>
                        <div className="upbox-text"><strong>Click to upload</strong> {m.desc.toLowerCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── REPORTS ── */}
            {page === 'proj-reports' && (
              <>
                <div className="ph">
                  <div className="ph-title">Activity Reports</div>
                  <div className="ph-sub">Campaign performance and compliance reports.</div>
                </div>
                <div className="card">
                  <div className="card-title">Pending Reports</div>
                  <div className="card-sub">Submit these required activity reports</div>
                  <div style={{ textAlign:'center', padding:'40px 0', color:'var(--slate)', fontSize:14 }}>
                    No pending reports. Reports will appear here as campaigns progress.
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
