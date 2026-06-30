import { useState } from 'react';
import { registerNPO, createProject, submitProject } from '../api/api';

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
`;

const NPO_STEPS = ['NPO Account', 'Basic Info', 'Certification', 'Bank Account'];
const CAUSE_OPTS = ['🏫 Education','🍽️ Food Relief','🌍 International Aid','🏥 Healthcare','♻️ Environment','🏘️ Housing','🤝 Refugees','👶 Children'];

const SAMPLE_PROJECTS = [
  { emoji:'🏫', name:'Build a School in Rural Ghana', status:'Active', raised:54200, goal:75000, color:'linear-gradient(135deg,#1565C0,#0D9488)', statusClass:'b-teal', deadline:'May 10', creators:8, tags:['Education','Africa'] },
  { emoji:'🍽️', name:'Feed the Future – Nairobi', status:'Active', raised:88000, goal:100000, color:'linear-gradient(135deg,#D97706,#FB8C00)', statusClass:'b-teal', deadline:'Apr 25', creators:11, tags:['Food Relief','Kenya'] },
  { emoji:'🤝', name:'Legal Aid for Syrian Refugees', status:'Draft', raised:0, goal:50000, color:'linear-gradient(135deg,#1A237E,#0891B2)', statusClass:'b-gray', deadline:'May 20', creators:0, tags:['Refugees','Legal Aid'] },
  { emoji:'💉', name:'Mobile Clinics for Rural Kenya', status:'In Review', raised:0, goal:150000, color:'linear-gradient(135deg,#004D40,#26A69A)', statusClass:'b-amber', deadline:'Jun 1', creators:0, tags:['Healthcare','Kenya'] },
];

export default function NPODashboard() {
  const [page, setPage] = useState('npo-overview');
  const [regStep, setRegStep] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [causes, setCauses] = useState([]);
  const [orgForm, setOrgForm] = useState({ fullName:'', title:'', email:'', phone:'', country:'United States', password:'' });
  const [basicForm, setBasicForm] = useState({ legalName:'', displayName:'', ein:'', year:'', website:'', officialEmail:'' });
  const [bankForm, setBankForm] = useState({ holder:'', bank:'Chase Bank', account:'', routing:'', type:'Checking' });
  const [projForm, setProjForm] = useState({ name:'', category:'♻️ Environment & Clean Water', platform:'Kickstarter', url:'', description:'', goal:'', startDate:'', endDate:'', impactStatement:'' });

  const nav = (p) => setPage(p);

  const handleSubmitNPO = async () => {
    setSubmitting(true);
    try {
      await registerNPO({ ...orgForm, ...basicForm, ...bankForm, causes });
      setSubmitted(true);
      nav('npo-overview');
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleSubmitProject = async () => {
    setSubmitting(true);
    try {
      await createProject({ ...projForm });
      setProjectSubmitted(true);
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
            <div className="sb-org-avatar">HP</div>
            <div>
              <div className="sb-org-name">HopeForward Foundation</div>
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
            ].map(({ key, icon, label, badge }) => (
              <div key={key} className={`nav-item${page === key ? ' active' : ''}`} onClick={() => nav(key)}>
                <span className="nav-icon">{icon}</span> {label}
                {badge && <span className="nav-badge">{badge}</span>}
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="tb-bread">
              {bc[0]} / <strong>{bc[1]}</strong>
            </div>
            <div className="tb-actions">
              <div className="icon-btn">🔍</div>
              <div className="icon-btn">🔔<span className="ndot" /></div>
              <div className="sb-org-avatar" style={{ cursor: 'pointer' }}>HP</div>
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
                    <div className="fg">
                      <label className="fl">Country *</label>
                      <select className="fs" value={orgForm.country} onChange={e => setOrgForm(f => ({ ...f, country: e.target.value }))}>
                        {['United States','United Kingdom','Canada','Germany','Australia'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="fg" style={{ marginBottom:0 }}>
                      <label className="fl">Password *</label>
                      <input className="fi" type="password" value={orgForm.password} placeholder="Create a password"
                        onChange={e => setOrgForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Account Verification</div>
                      <div className="card-sub">Required steps before proceeding</div>
                      <div className="vs active">
                        <div className="vs-num">1</div>
                        <div><div style={{ fontWeight:700, fontSize:13 }}>Email Verification</div><div style={{ fontSize:12, color:'var(--teal)' }}>Verify your email address</div></div>
                      </div>
                      <div className="vs">
                        <div className="vs-num">2</div>
                        <div><div style={{ fontWeight:700, fontSize:13 }}>Phone Verification</div><div style={{ fontSize:12, color:'var(--slate)' }}>Verify with OTP</div></div>
                      </div>
                      <div className="vs">
                        <div className="vs-num">3</div>
                        <div><div style={{ fontWeight:700, fontSize:13 }}>Initial Agreement</div><div style={{ fontSize:12, color:'var(--slate)' }}>Review and sign the NPO platform agreement</div></div>
                      </div>
                    </div>
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
                      { label:'EIN / Tax ID Number *', key:'ein', placeholder:'XX-XXXXXXX' },
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
                        <div className="fg"><label className="fl">Country</label><select className="fs"><option>United States</option></select></div>
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
                  <div className="ph-sub">Submit your nonprofit registration documents and key personnel ID. Reviewed within 48 hours.</div>
                </div>
                <div className="stepper">
                  {NPO_STEPS.map((s, i) => (
                    <div key={s} className={`step-item${i < 2 ? ' done' : i === 2 ? ' current' : ''}`}>
                      <div className="step-circle">{i < 2 ? '✓' : i + 1}</div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="g2">
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Registration & Certification Documents</div>
                      <div className="card-sub">Upload official government-issued documents proving nonprofit status</div>
                      <div className="fg">
                        <label className="fl">Document Type</label>
                        <select className="fs">
                          <option>IRS 501(c)(3) Determination Letter</option>
                          <option>State Nonprofit Incorporation Certificate</option>
                          <option>International Equivalent</option>
                        </select>
                      </div>
                      <div className="upbox" style={{ marginBottom:10 }}>
                        <div className="upbox-icon">📄</div>
                        <div className="upbox-text"><strong>Click to upload</strong> your 501(c)(3) determination letter</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>PDF, JPG, PNG — max 10 MB</div>
                      </div>
                      <div className="upbox" style={{ marginBottom:10 }}>
                        <div className="upbox-icon">📋</div>
                        <div className="upbox-text"><strong>Click to upload</strong> state incorporation certificate</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>PDF — max 10 MB</div>
                      </div>
                      <div className="upbox">
                        <div className="upbox-icon">➕</div>
                        <div className="upbox-text"><strong>Click to upload</strong> additional supporting documents</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>PDF, JPG, PNG — max 10 MB each</div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Key Personnel Identity Verification</div>
                      <div className="card-sub">Government-issued ID for the account administrator</div>
                      <div className="fg">
                        <label className="fl">ID Type</label>
                        <select className="fs"><option>Passport</option><option>Driver's License</option><option>State ID</option></select>
                      </div>
                      <div className="upbox">
                        <div className="upbox-icon">🪪</div>
                        <div className="upbox-text"><strong>Click to upload</strong> your photo ID with selfie</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>JPG, PNG — max 5MB</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card" style={{ marginBottom:16 }}>
                      <div className="card-title">Verification Status</div>
                      <div className="card-sub">Current review progress</div>
                      <div className="tl">
                        {['Documents Submitted','Auto-Scan Complete','Compliance Review','Group Certification Approved'].map((t, i) => (
                          <div key={t} className="tl-item">
                            <div className="tl-dot" />
                            <div className="tl-title">{t}</div>
                            <div className="tl-meta">Pending</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Compliance Checklist</div>
                      <div className="card-sub">All items required for campaign publishing</div>
                      <div style={{ fontSize:13, lineHeight:2 }}>
                        ⬜ Valid 501(c)(3) on file<br/>
                        ⬜ State incorporation verified<br/>
                        ⬜ Admin identity confirmed<br/>
                        ⬜ No sanctions / watchlist matches<br/>
                        ⬜ Annual report on file<br/>
                        ⬜ Bank account (Step 4 — pending)
                      </div>
                    </div>
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
                      { label:'Routing Number *', key:'routing', placeholder:'9-digit ABA routing number' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="fg">
                        <label className="fl">{label}</label>
                        <input className="fi" value={bankForm[key]} placeholder={placeholder}
                          onChange={e => setBankForm(f => ({ ...f, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="fg">
                      <label className="fl">Bank Name *</label>
                      <select className="fs" value={bankForm.bank} onChange={e => setBankForm(f => ({ ...f, bank: e.target.value }))}>
                        {['Chase Bank','Bank of America','Wells Fargo','Citibank','US Bank'].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl">Account Type</label>
                      <select className="fs" value={bankForm.type} onChange={e => setBankForm(f => ({ ...f, type: e.target.value }))}>
                        {['Checking','Savings'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="fg" style={{ marginBottom:0 }}>
                      <label className="fl">Upload Voided Check or Bank Letter *</label>
                      <div className="upbox">
                        <div className="upbox-icon">🏦</div>
                        <div className="upbox-text"><strong>Click to upload</strong> voided check or bank verification letter</div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>PDF or JPG — max 5 MB</div>
                      </div>
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

                <div className="g4" style={{ marginBottom:20 }}>
                  {[
                    { icon:'📋', bg:'var(--teal-light)', val:'4', lbl:'Total Projects', delta:'2 active', dt:'up' },
                    { icon:'💵', bg:'#EEF2FF', val:'$184K', lbl:'Total Raised', delta:'↑ 28% this month', dt:'up' },
                    { icon:'🤳', bg:'#F0FDF4', val:'23', lbl:'Active Creators', delta:'Promoting causes', dt:'up' },
                    { icon:'👁', bg:'var(--amber-light)', val:'1.8M', lbl:'Total Impressions', delta:'Across all campaigns', dt:'up' },
                  ].map(s => (
                    <div key={s.lbl} className="stat-card">
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                        <div className={`stat-delta ${s.dt}`}>{s.delta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="g2">
                  {SAMPLE_PROJECTS.map((p, i) => (
                    <div key={i} className="proj-card" onClick={() => nav('proj-new')}>
                      <div className="proj-img" style={{ background: p.color }}>{p.emoji}</div>
                      <div className="proj-body">
                        <div className="flex jb ic">
                          <div className="proj-name">{p.name}</div>
                          <span className={`badge ${p.statusClass}`}>{p.status}</span>
                        </div>
                        <div className="proj-org">{p.tags[0]} · HopeForward Foundation</div>
                        <div className="fund-meter">
                          <div className="fund-label"><span className="raised">${p.raised.toLocaleString()}</span><span className="goal">of ${p.goal.toLocaleString()} goal</span></div>
                          <div className="prog-wrap"><div className="prog-bar" style={{ width: `${Math.round(p.raised/p.goal*100)}%`, background: 'var(--teal-mid)' }} /></div>
                        </div>
                        <div className="proj-footer">
                          <div><div style={{ fontSize:11, color:'var(--slate)' }}>Creators</div><div style={{ fontWeight:700, fontSize:13 }}>{p.creators} promoting</div></div>
                          <div><div style={{ fontSize:11, color:'var(--slate)' }}>Deadline</div><div style={{ fontWeight:700, fontSize:13 }}>{p.deadline}</div></div>
                        </div>
                        <div style={{ marginTop:8 }}>{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                      </div>
                    </div>
                  ))}
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
