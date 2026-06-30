import { useState, useEffect, useCallback } from 'react';
import {
  approveNPO, rejectNPO, approveProject, rejectProject, approveInfluencer, rejectInfluencer,
  listNPOs, listProjects, listInfluencers, getAdminStats,
  getProjectInfluencers, getInfluencerActiveProjects,
} from '../api/api';

const S = `
:root{
  --ink:#0B1120;--ink-mid:#1C2B45;--ink-light:#2E4166;
  --teal:#0F9B8E;--teal-hi:#14C5B5;--teal-glow:rgba(15,155,142,0.12);
  --amber:#E8A020;--amber-lo:#FEF3C7;
  --rose:#E8365D;--rose-lo:#FEE2E9;
  --violet:#7C3AED;--violet-lo:#EDE9FE;
  --sky:#0EA5E9;--sky-lo:#E0F2FE;
  --surface:#FFFFFF;--surface-2:#F5F7FA;
  --border:#E4E8EF;--border-2:#CDD4DF;
  --muted:#64748B;--muted-2:#94A3B8;
  --sidebar-w:248px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;overflow:hidden;}
body{font-family:'Inter',sans-serif;background:var(--surface-2);color:var(--ink);}
.adm-layout{display:flex;height:100vh;overflow:hidden;}
.sb{width:var(--sidebar-w);background:var(--ink);display:flex;flex-direction:column;flex-shrink:0;height:100vh;overflow-y:auto;}
.sb-top{padding:22px 18px 16px;border-bottom:1px solid rgba(255,255,255,0.07);}
.sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.sb-mark{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--teal),#059669);display:flex;align-items:center;justify-content:center;font-size:16px;}
.sb-name{font-family:'Sora',sans-serif;font-weight:800;font-size:17px;color:#fff;}
.sb-badge{font-size:9px;font-weight:700;letter-spacing:1px;background:rgba(15,155,142,0.25);color:var(--teal-hi);padding:2px 8px;border-radius:10px;border:1px solid rgba(15,155,142,0.3);text-transform:uppercase;}
.sb-user{display:flex;align-items:center;gap:10px;}
.sb-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--teal),var(--sky));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.sb-uname{font-size:12px;font-weight:600;color:#fff;}
.sb-urole{font-size:10.5px;color:rgba(255,255,255,0.4);}
.sb-nav{padding:12px 10px;flex:1;}
.sb-section-lbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:10px 10px 6px;}
.nav-link{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:8px;margin-bottom:1px;cursor:pointer;transition:all .15s;color:rgba(255,255,255,0.5);font-size:13px;font-weight:500;position:relative;}
.nav-link:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);}
.nav-link.active{background:rgba(15,155,142,0.18);color:#fff;}
.nav-link.active::before{content:'';position:absolute;left:0;top:25%;bottom:25%;width:3px;border-radius:0 2px 2px 0;background:var(--teal-hi);}
.nav-icon{font-size:15px;width:18px;text-align:center;}
.nav-pill{margin-left:auto;background:rgba(232,160,32,0.2);color:var(--amber);font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:10px;}
.nav-pill.alert{background:rgba(232,54,93,0.2);color:var(--rose);}
.nav-pill.teal{background:rgba(15,155,142,0.2);color:var(--teal-hi);}
.main{flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden;}
.topbar{height:58px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 26px;gap:14px;flex-shrink:0;}
.tb-bread{flex:1;font-size:12.5px;color:var(--muted);}
.tb-bread b{color:var(--ink);font-weight:700;}
.tb-actions{display:flex;align-items:center;gap:10px;}
.icon-btn{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--border);cursor:pointer;font-size:14px;transition:background .15s;position:relative;}
.icon-btn:hover{background:var(--border);}
.alert-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;background:var(--rose);border-radius:50%;border:1.5px solid #fff;}
.search-bar{display:flex;align-items:center;gap:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:0 12px;height:34px;width:220px;}
.search-bar input{border:none;background:transparent;outline:none;font-size:12.5px;font-family:'Inter',sans-serif;color:var(--ink);width:100%;}
.scroll-area{flex:1;overflow-y:auto;padding:24px 26px;}
.page{display:none;}
.page.active{display:block;}
.ph{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;}
.ph-left .ph-title{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:var(--ink);letter-spacing:-.3px;}
.ph-left .ph-sub{font-size:12.5px;color:var(--muted);margin-top:3px;}
.card{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:20px;}
.card-title{font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:var(--ink);margin-bottom:2px;}
.card-sub{font-size:11.5px;color:var(--muted);margin-bottom:14px;}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.kpi-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;transition:box-shadow .15s;cursor:default;}
.kpi-card:hover{box-shadow:0 4px 16px rgba(11,17,32,.07);}
.kpi-label{font-size:11.5px;color:var(--muted);font-weight:500;letter-spacing:.1px;}
.kpi-value{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:var(--ink);letter-spacing:-.5px;}
.kpi-delta{font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;}
.kpi-delta.up{color:var(--teal);}
.kpi-delta.dn{color:var(--rose);}
.kpi-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:8px;}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.g-21{display:grid;grid-template-columns:2fr 1fr;gap:16px;}
.g-12{display:grid;grid-template-columns:1fr 2fr;gap:16px;}
.mt14{margin-top:14px;}
.mt20{margin-top:20px;}
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{text-align:left;font-size:10.5px;font-weight:700;letter-spacing:.6px;color:var(--muted);text-transform:uppercase;padding:9px 14px;border-bottom:1px solid var(--border);background:var(--surface-2);white-space:nowrap;}
tbody td{padding:12px 14px;font-size:12.5px;border-bottom:1px solid var(--border);color:var(--ink);vertical-align:middle;}
tbody tr:hover{background:#F9FAFB;}
tbody tr:last-child td{border-bottom:none;}
.td-mono{font-family:'DM Mono',monospace;font-size:11.5px;color:var(--muted);}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10.5px;font-weight:700;white-space:nowrap;}
.b-teal{background:rgba(15,155,142,0.1);color:var(--teal);}
.b-amber{background:var(--amber-lo);color:#92670A;}
.b-rose{background:var(--rose-lo);color:var(--rose);}
.b-violet{background:var(--violet-lo);color:var(--violet);}
.b-sky{background:var(--sky-lo);color:var(--sky);}
.b-gray{background:#F1F5F9;color:var(--muted);}
.b-green{background:#DCFCE7;color:#16A34A;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'Inter',sans-serif;}
.btn-primary{background:var(--ink);color:#fff;}
.btn-primary:hover{background:var(--ink-mid);}
.btn-teal{background:var(--teal);color:#fff;}
.btn-teal:hover{background:#0B7A71;}
.btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--ink);}
.btn-outline:hover{border-color:var(--teal);color:var(--teal);}
.btn-rose{background:var(--rose-lo);color:var(--rose);}
.btn-rose:hover{background:var(--rose);color:#fff;}
.btn-amber{background:var(--amber-lo);color:#92670A;}
.btn-amber:hover{background:var(--amber);color:#fff;}
.btn-ghost{background:transparent;color:var(--muted);border:none;font-size:12px;cursor:pointer;}
.btn-ghost:hover{color:var(--ink);}
.btn-sm{padding:5px 12px;font-size:11.5px;border-radius:7px;}
.btn-xs{padding:3px 9px;font-size:11px;border-radius:6px;}
.prog-wrap{background:var(--surface-2);border-radius:6px;height:6px;overflow:hidden;}
.prog-bar{height:100%;border-radius:6px;transition:width .4s;}
.av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;color:#fff;flex-shrink:0;}
.tab-bar{display:flex;gap:2px;background:var(--surface-2);border-radius:9px;padding:3px;margin-bottom:18px;width:fit-content;}
.tab-btn{padding:6px 16px;border-radius:7px;border:none;background:transparent;font-size:12.5px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .15s;font-family:'Inter',sans-serif;white-space:nowrap;}
.tab-btn.active{background:var(--surface);color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.07);}
.review-card{border:1.5px solid var(--border);border-radius:12px;padding:18px;margin-bottom:14px;transition:border-color .15s,box-shadow .15s;}
.review-card:hover{border-color:var(--border-2);box-shadow:0 2px 12px rgba(0,0,0,.05);}
.review-card.pending{border-left:3px solid var(--amber);}
.review-card.approved{border-left:3px solid var(--teal);opacity:.85;}
.review-card.rejected{border-left:3px solid var(--rose);opacity:.8;}
.stat-mini{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:9px;background:var(--surface-2);}
.sm-val{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:var(--ink);}
.sm-lbl{font-size:11px;color:var(--muted);}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:90px;padding:4px 0;}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
.bar-seg{width:100%;border-radius:4px 4px 0 0;min-height:3px;}
.bar-seg:hover{opacity:.75;cursor:pointer;}
.blbl{font-size:9.5px;color:var(--muted);}
.tl{position:relative;padding-left:22px;}
.tl::before{content:'';position:absolute;left:7px;top:0;bottom:0;width:1.5px;background:var(--border);}
.tl-item{position:relative;margin-bottom:14px;}
.tl-dot{position:absolute;left:-18px;top:3px;width:10px;height:10px;border-radius:50%;background:var(--teal);border:2px solid var(--surface);}
.tl-dot.wait{background:var(--amber);}
.tl-dot.muted{background:var(--border-2);}
.tl-title{font-size:12.5px;font-weight:600;color:var(--ink);}
.tl-meta{font-size:11px;color:var(--muted);margin-top:1px;}
.notif-row{display:flex;gap:10px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border);}
.notif-row:last-child{border-bottom:none;}
.notif-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.notif-txt{font-size:12px;line-height:1.5;color:var(--ink);}
.notif-t{font-size:10.5px;color:var(--muted);margin-top:1px;}
.entity-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:9px;border:1px solid var(--border);margin-bottom:8px;transition:background .12s;cursor:pointer;}
.entity-row:hover{background:var(--surface-2);}
.entity-info{flex:1;}
.entity-name{font-size:13px;font-weight:600;color:var(--ink);}
.entity-meta{font-size:11px;color:var(--muted);margin-top:1px;}
.entity-right{display:flex;align-items:center;gap:10px;}
.tag{display:inline-block;padding:2px 8px;border-radius:5px;background:rgba(15,155,142,0.09);color:var(--teal);font-size:10.5px;font-weight:700;margin:2px;}
.sep{color:var(--muted-2);margin:0 4px;}
.flex{display:flex;}.ic{align-items:center;}.jb{justify-content:space-between;}.wrap{flex-wrap:wrap;}
.gap6{gap:6px;}.gap10{gap:10px;}.gap12{gap:12px;}.gap14{gap:14px;}
.fund-raised{font-family:'Sora',sans-serif;font-size:16px;font-weight:800;color:var(--teal);}
.fund-goal{font-size:11px;color:var(--muted);}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:center;justify-content:center;}
.modal{background:var(--surface);border-radius:14px;padding:24px;width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.2);}
.modal-title{font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:8px;}
.modal-sub{font-size:12.5px;color:var(--muted);margin-bottom:16px;}
.fi{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:9px;font-size:13px;font-family:'Inter',sans-serif;color:var(--ink);background:var(--surface);outline:none;transition:border .15s;}
.fi:focus{border-color:var(--teal);}
`;

const CATBADGE = {
  Environment: 'b-teal', Healthcare: 'b-rose', Education: 'b-sky', Refugees: 'b-violet', Housing: 'b-amber'
};

const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function AdminDashboard() {
  const [page, setPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Live data from API
  const [pendingNPOs, setPendingNPOs] = useState([]);
  const [pendingProjs, setPendingProjs] = useState([]);
  const [pendingInfl, setPendingInfl] = useState([]);
  const [approvedInfluencers, setApprovedInfluencers] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [stats, setStats] = useState({ npos: 0, influencers: 0, live_projects: 0 });
  const [loading, setLoading] = useState(true);

  // Detail views
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailInfluencerProjects, setDetailInfluencerProjects] = useState([]);
  const [detailProjectInfluencers, setDetailProjectInfluencers] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [npoRes, projRes, inflRes, statsRes, approvedInflRes, approvedProjRes] = await Promise.all([
        listNPOs('pending'),
        listProjects('pending'),
        listInfluencers('pending'),
        getAdminStats(),
        listInfluencers('approved'),
        listProjects('approved'),
      ]);
      setPendingNPOs(npoRes.data || []);
      setPendingProjs(projRes.data || []);
      setPendingInfl(inflRes.data || []);
      setStats(statsRes.data || {});
      setApprovedInfluencers(approvedInflRes.data || []);
      setApprovedProjects(approvedProjRes.data || []);
    } catch (e) {
      console.error('Failed to load admin data:', e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const nav = (p) => setPage(p);

  const totalPending = pendingNPOs.length + pendingProjs.length + pendingInfl.length;

  const handleAction = async () => {
    setProcessing(true);
    try {
      const { type, id, action } = modal;
      if (type === 'npo') {
        if (action === 'approve') await approveNPO(id);
        else await rejectNPO(id, rejectReason);
      } else if (type === 'project') {
        if (action === 'approve') await approveProject(id);
        else await rejectProject(id, rejectReason);
      } else if (type === 'influencer') {
        if (action === 'approve') await approveInfluencer(id);
        else await rejectInfluencer(id, rejectReason);
      }
      await fetchAll(); // refresh all lists after action
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
    setModal(null);
    setRejectReason('');
  };

  const openApprove = (type, id, name) => setModal({ type, id, name, action: 'approve' });
  const openReject = (type, id, name) => setModal({ type, id, name, action: 'reject' });

  const openInfluencerDetail = async (inf) => {
    setSelectedInfluencer(inf);
    setDetailLoading(true);
    nav('creator-detail');
    try { const r = await getInfluencerActiveProjects(inf.id); setDetailInfluencerProjects(r.data || []); }
    catch { setDetailInfluencerProjects([]); }
    setDetailLoading(false);
  };

  const openProjectDetail = async (proj) => {
    setSelectedProject(proj);
    setDetailLoading(true);
    nav('proj-detail');
    try { const r = await getProjectInfluencers(proj.id); setDetailProjectInfluencers(r.data || []); }
    catch { setDetailProjectInfluencers([]); }
    setDetailLoading(false);
  };

  const breadcrumbs = {
    dashboard: <b>Dashboard</b>,
    activity: <><span>Platform</span><span className="sep">/</span><b>Live Activity</b></>,
    'npo-list': <><span>Organizations</span><span className="sep">/</span><b>NPO Registry</b></>,
    'npo-detail': <><span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('npo-list')}>NPO Registry</span><span className="sep">/</span><b>HopeForward Foundation</b></>,
    'creator-list': <><span>Creators</span><span className="sep">/</span><b>Creator Registry</b></>,
    'creator-detail': <><span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('creator-list')}>Creator Registry</span><span className="sep">/</span><b>{selectedInfluencer?.full_name || '…'}</b></>,
    'proj-review': <><span>Projects</span><span className="sep">/</span><b>Submission Review</b></>,
    'proj-live': <><span>Projects</span><span className="sep">/</span><b>Live Projects</b></>,
    'proj-detail': <><span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('proj-live')}>Live Projects</span><span className="sep">/</span><b>{selectedProject?.title || '…'}</b></>,
    payouts: <><span>Platform</span><span className="sep">/</span><b>Payouts & Fees</b></>,
    compliance: <><span>Platform</span><span className="sep">/</span><b>Compliance</b></>,
    'influencer-review': <><span>Creators</span><span className="sep">/</span><b>Influencer Approvals</b></>,
  };

  return (
    <>
      <style>{S}</style>
      <div className="adm-layout" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <aside className="sb">
          <div className="sb-top">
            <div className="sb-brand">
              <img src="/Socia Logo.png" alt="Socia" style={{ height:30, width:'auto', objectFit:'contain' }} />
              <span className="sb-badge">Admin</span>
            </div>
            <div className="sb-user">
              <div className="sb-avatar">AD</div>
              <div>
                <div className="sb-uname">Alex Durant</div>
                <div className="sb-urole">Platform Administrator</div>
              </div>
            </div>
          </div>

          <div className="sb-nav">
            <div className="sb-section-lbl">Overview</div>
            {[
              { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
              { key: 'activity', icon: '📡', label: 'Live Activity', pill: 'Live', pillClass: 'teal' },
            ].map(({ key, icon, label, pill, pillClass }) => (
              <div key={key} className={`nav-link${page === key ? ' active' : ''}`} onClick={() => nav(key)}>
                <span className="nav-icon">{icon}</span> {label}
                {pill && <span className={`nav-pill ${pillClass || ''}`}>{pill}</span>}
              </div>
            ))}

            <div className="sb-section-lbl">Approvals</div>
            <div className={`nav-link${page === 'npo-list' ? ' active' : ''}`} onClick={() => nav('npo-list')}>
              <span className="nav-icon">🏢</span> NPO Approvals
              {pendingNPOs.length > 0 && <span className="nav-pill alert">{pendingNPOs.length} new</span>}
            </div>
            <div className={`nav-link${page === 'influencer-review' ? ' active' : ''}`} onClick={() => nav('influencer-review')}>
              <span className="nav-icon">🤳</span> Influencer Approvals
              {pendingInfl.length > 0 && <span className="nav-pill alert">{pendingInfl.length} new</span>}
            </div>
            <div className={`nav-link${page === 'proj-review' ? ' active' : ''}`} onClick={() => nav('proj-review')}>
              <span className="nav-icon">🔍</span> Project Review
              {pendingProjs.length > 0 && <span className="nav-pill alert">{pendingProjs.length} new</span>}
            </div>

            <div className="sb-section-lbl">Registry</div>
            {[
              { key: 'creator-list', icon: '🤳', label: 'Creator Registry', pill: String(approvedInfluencers.length || '') },
              { key: 'proj-live', icon: '✅', label: 'Live Projects', pill: String(approvedProjects.length || ''), pillClass: 'teal' },
            ].map(({ key, icon, label, pill, pillClass }) => (
              <div key={key} className={`nav-link${page === key ? ' active' : ''}`} onClick={() => nav(key)}>
                <span className="nav-icon">{icon}</span> {label}
                {pill && <span className={`nav-pill ${pillClass || ''}`}>{pill}</span>}
              </div>
            ))}

            <div className="sb-section-lbl">Platform</div>
            {[
              { key: 'payouts', icon: '💵', label: 'Payouts & Fees' },
              { key: 'compliance', icon: '🛡️', label: 'Compliance', pill: '3', pillClass: 'alert' },
            ].map(({ key, icon, label, pill, pillClass }) => (
              <div key={key} className={`nav-link${page === key ? ' active' : ''}`} onClick={() => nav(key)}>
                <span className="nav-icon">{icon}</span> {label}
                {pill && <span className={`nav-pill ${pillClass || ''}`}>{pill}</span>}
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="tb-bread">{breadcrumbs[page] || <b>{page}</b>}</div>
            <div className="tb-actions">
              <div className="search-bar">
                <span style={{ color:'var(--muted)' }}>🔍</span>
                <input placeholder="Search NPOs, creators, projects…" />
              </div>
              <div className="icon-btn">🔔<span className="alert-dot" /></div>
              <div className="icon-btn">⚙️</div>
              <div className="sb-avatar" style={{ cursor:'pointer' }}>AD</div>
            </div>
          </header>

          <div className="scroll-area">
            <div className="fade-up" key={page}>

              {/* ── DASHBOARD ── */}
              {page === 'dashboard' && (
                <>
                  <div className="ph">
                    <div className="ph-left">
                      <div className="ph-title">Platform Overview</div>
                      <div className="ph-sub">Socia admin control center · Last updated just now</div>
                    </div>
                    <div className="flex ic gap10">
                      <select style={{ fontSize:12, padding:'6px 12px', border:'1px solid var(--border)', borderRadius:7, background:'var(--surface)', color:'var(--ink)', cursor:'pointer' }}>
                        <option>Last 30 days</option><option>Last 90 days</option><option>All time</option>
                      </select>
                      <button className="btn btn-teal btn-sm">⬇ Export Report</button>
                    </div>
                  </div>

                  <div className="kpi-grid">
                    {[
                      { icon:'🏢', bg:'rgba(15,155,142,0.1)', lbl:'Registered NPOs', val:String(stats.npos ?? 0), delta:'Approved NPOs', type:'up', pg:'npo-list' },
                      { icon:'🤳', bg:'rgba(124,58,237,0.1)', lbl:'Active Creators', val:String(stats.influencers ?? 0), delta:'Approved creators', type:'up', pg:'creator-list' },
                      { icon:'📋', bg:'rgba(14,165,233,0.1)', lbl:'Live Projects', val:String(stats.live_projects ?? 0), delta:'Approved projects', type:'up', pg:'proj-live' },
                      { icon:'⏳', bg:'rgba(232,160,32,0.12)', lbl:'Pending Review', val:String(totalPending), delta:'Awaiting action', type:'dn', pg:'proj-review' },
                    ].map(k => (
                      <div key={k.lbl} className="kpi-card" onClick={() => nav(k.pg)} style={{ cursor:'pointer' }}>
                        <div className="kpi-icon" style={{ background: k.bg }}>{k.icon}</div>
                        <div className="kpi-label">{k.lbl}</div>
                        <div className="kpi-value">{k.val}</div>
                        <div className={`kpi-delta ${k.type}`}>{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="g2" style={{ marginBottom:16 }}>
                    <div className="card">
                      <div className="flex jb ic" style={{ marginBottom:14 }}>
                        <div>
                          <div className="card-title">Platform Donations Raised</div>
                          <div className="card-sub" style={{ marginBottom:0 }}>Across all live Socia campaigns</div>
                        </div>
                        <span className="badge b-teal">All time</span>
                      </div>
                      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:32, fontWeight:800, color:'var(--teal)', marginBottom:4 }}>$2.84M</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>↑ $184K raised this month alone</div>
                      <div className="bar-chart">
                        {[['Oct',38],['Nov',51],['Dec',43],['Jan',60],['Feb',72],['Mar',68],['Apr',95]].map(([l, h]) => (
                          <div key={l} className="bar-col">
                            <div className="bar-seg" style={{ height:`${h}%`, background:'var(--teal)', opacity: h === 95 ? 1 : 0.3 + h/200 }} />
                            <div className="blbl">{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Projects by Cause Category</div>
                      <div className="card-sub">Distribution of all live campaigns</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {[
                          ['🏫 Education', '12 projects · 35%', 35, 'var(--sky)'],
                          ['🍽️ Food Relief', '8 projects · 24%', 24, 'var(--amber)'],
                          ['🏥 Healthcare', '6 projects · 18%', 18, 'var(--rose)'],
                          ['🤝 Refugees', '5 projects · 15%', 15, 'var(--violet)'],
                          ['♻️ Environment', '3 projects · 8%', 8, 'var(--teal)'],
                        ].map(([label, text, pct, color]) => (
                          <div key={label}>
                            <div className="flex jb ic" style={{ fontSize:12, marginBottom:4 }}><span>{label}</span><span style={{ fontWeight:700 }}>{text}</span></div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width:`${pct}%`, background:color }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="g-21">
                    <div className="card">
                      <div className="flex jb ic" style={{ marginBottom:14 }}>
                        <div>
                          <div className="card-title">Pending Submissions</div>
                          <div className="card-sub" style={{ marginBottom:0 }}>{totalPending} items waiting for review</div>
                        </div>
                        <div className="flex gap10">
                          <button className="btn btn-amber btn-sm" onClick={() => nav('proj-review')}>Projects →</button>
                          <button className="btn btn-amber btn-sm" onClick={() => nav('npo-list')}>NPOs →</button>
                        </div>
                      </div>
                      <div className="tbl-wrap">
                        <table>
                          <thead><tr><th>Project</th><th>NPO</th><th>Submitted</th><th>Category</th><th>Goal</th><th>Action</th></tr></thead>
                          <tbody>
                            {pendingProjs.slice(0, 5).map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight:600 }}>{p.title}</td>
                                <td>{p.npo_name || p.organization}</td>
                                <td className="td-mono">{fmt(p.created_at)}</td>
                                <td><span className={`badge ${CATBADGE[p.category] || 'b-gray'}`}>{p.category}</span></td>
                                <td style={{ fontWeight:700 }}>{p.goal}</td>
                                <td>
                                  {p.status === 'approved' && <span className="badge b-teal">✓ Approved</span>}
                                  {p.status === 'rejected' && <span className="badge b-rose">✗ Rejected</span>}
                                  {p.status === 'pending' && (
                                    <div className="flex gap6">
                                      <button className="btn btn-teal btn-xs" onClick={() => openApprove('project', p.id, p.title)}>Approve</button>
                                      <button className="btn btn-rose btn-xs" onClick={() => openReject('project', p.id, p.title)}>Reject</button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title" style={{ marginBottom:12 }}>Recent Activity</div>
                      {[
                        { ic:'✅', bg:'rgba(15,155,142,0.1)', txt:'<b>Ghana School Build</b> reached 85% of funding goal', t:'12 min ago' },
                        { ic:'🤳', bg:'rgba(124,58,237,0.1)', txt:'New creator <b>@sofia.creates</b> registered & KYC passed', t:'1 hour ago' },
                        { ic:'📋', bg:'rgba(232,160,32,0.1)', txt:'<b>IRC</b> submitted "Refugee Housing – Jordan" for review', t:'2 hours ago' },
                        { ic:'🏢', bg:'rgba(14,165,233,0.1)', txt:'<b>Habitat for Humanity</b> completed NPO registration', t:'3 hours ago' },
                        { ic:'⚠️', bg:'rgba(232,54,93,0.1)', txt:'Content revision flag on <b>Feed the Future</b> story set', t:'5 hours ago' },
                        { ic:'💵', bg:'rgba(15,155,142,0.1)', txt:'$4,820 in creator stipends processed · 6 recipients', t:'Yesterday' },
                      ].map((n, i) => (
                        <div key={i} className="notif-row">
                          <div className="notif-ic" style={{ background: n.bg }}>{n.ic}</div>
                          <div>
                            <div className="notif-txt" dangerouslySetInnerHTML={{ __html: n.txt }} />
                            <div className="notif-t">{n.t}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── LIVE ACTIVITY ── */}
              {page === 'activity' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Live Activity</div><div className="ph-sub">Real-time platform events</div></div>
                    <span className="badge b-teal" style={{ fontSize:12, padding:'5px 12px' }}>● Live</span>
                  </div>
                  <div className="g4" style={{ marginBottom:20 }}>
                    {[['🌐','rgba(15,155,142,0.1)','1,240','Sessions online now'],['💵','rgba(14,165,233,0.1)','$8,400','Raised in last hour'],['📤','rgba(124,58,237,0.1)','14','Posts submitted today'],['⏳','rgba(232,160,32,0.1)',String(totalPending),'Reviews pending']].map(([ic, bg, val, lbl]) => (
                      <div key={lbl} className="stat-mini">
                        <div className="kpi-icon" style={{ background: bg, marginBottom:0 }}>{ic}</div>
                        <div><div className="sm-val">{val}</div><div className="sm-lbl">{lbl}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="g2">
                    <div className="card">
                      <div className="card-title" style={{ marginBottom:14 }}>Event Stream</div>
                      <div className="tl">
                        {[
                          { title:'@jamie.forchange submitted Instagram Reel — Feed the Future', meta:'2 min ago', cls:'' },
                          { title:"charity: water project submitted for admin review", meta:'11 min ago', cls:'' },
                          { title:'$1,200 donated via @sofia.creates link — Ghana School Build', meta:'18 min ago', cls:'' },
                          { title:'Compliance flag — HopeForward Foundation bank re-verification requested', meta:'34 min ago', cls:'wait' },
                          { title:'@noah.impact accepted "Mobile Clinics Kenya" campaign', meta:'41 min ago', cls:'' },
                          { title:'UNICEF submitted "Vaccination Drive" for review', meta:'2 hours ago', cls:'' },
                          { title:'$8,400 creator stipend batch processed · 6 creators', meta:'3 hours ago', cls:'muted' },
                        ].map((e, i) => (
                          <div key={i} className="tl-item">
                            <div className={`tl-dot ${e.cls}`} />
                            <div className="tl-title">{e.title}</div>
                            <div className="tl-meta">{e.meta}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title" style={{ marginBottom:14 }}>Hourly Donations (Today)</div>
                      <div className="bar-chart" style={{ height:110 }}>
                        {[['6am',30],['8am',44],['10am',60],['12pm',78],['2pm',55],['4pm',90],['6pm',70],['Now',40]].map(([l, h]) => (
                          <div key={l} className="bar-col">
                            <div className="bar-seg" style={{ height:`${h}%`, background:'var(--teal)', opacity: 0.4 + h/150 }} />
                            <div className="blbl">{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── NPO LIST / APPROVALS ── */}
              {page === 'npo-list' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">NPO Approvals</div><div className="ph-sub">Review and approve nonprofit organization registrations</div></div>
                    <button className="btn btn-teal btn-sm">⬇ Export</button>
                  </div>
                  <div className="kpi-grid">
                    {[
                      { icon:'🏢', bg:'rgba(15,155,142,0.1)', lbl:'Total NPOs', val:String((stats.npos ?? 0) + pendingNPOs.length), delta:'All registered', type:'up' },
                      { icon:'✅', bg:'rgba(15,155,142,0.1)', lbl:'Fully Verified', val:String(stats.npos ?? 0), delta:'Approved', type:'up' },
                      { icon:'⏳', bg:'rgba(232,160,32,0.12)', lbl:'Pending KYC', val:String(pendingNPOs.length), delta:'Action needed', type:'dn' },
                      { icon:'🚩', bg:'rgba(232,54,93,0.1)', lbl:'Compliance Flags', val:'2', delta:'Review required', type:'dn' },
                    ].map(k => (
                      <div key={k.lbl} className="kpi-card">
                        <div className="kpi-icon" style={{ background: k.bg }}>{k.icon}</div>
                        <div className="kpi-label">{k.lbl}</div>
                        <div className="kpi-value">{k.val}</div>
                        <div className={`kpi-delta ${k.type}`}>{k.delta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-title" style={{ marginBottom:14 }}>Pending NPO Registrations</div>
                    {loading && <div style={{ color:'var(--muted)', fontSize:13 }}>Loading…</div>}
                    {!loading && pendingNPOs.length === 0 && <div style={{ color:'var(--muted)', fontSize:13 }}>No pending NPO registrations.</div>}
                    {pendingNPOs.map(n => (
                      <div key={n.id} className="review-card pending">
                        <div className="flex jb ic">
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{n.org_name}</div>
                            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{n.email} · {n.country} · {n.org_type} · Submitted {fmt(n.created_at)}</div>
                          </div>
                          <div className="flex gap10">
                            {n.status === 'approved' && <span className="badge b-teal">✓ Approved</span>}
                            {n.status === 'rejected' && <span className="badge b-rose">✗ Rejected</span>}
                            {n.status === 'pending' && (
                              <>
                                <button className="btn btn-outline btn-sm" onClick={() => nav('npo-detail')}>View Details</button>
                                <button className="btn btn-teal btn-sm" onClick={() => openApprove('npo', n.id, n.org_name)}>✓ Approve</button>
                                <button className="btn btn-rose btn-sm" onClick={() => openReject('npo', n.id, n.org_name)}>✗ Reject</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── NPO DETAIL ── */}
              {page === 'npo-detail' && (
                <>
                  <div className="ph">
                    <div className="ph-left">
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>
                        <span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('npo-list')}>NPO Registry</span>
                        <span className="sep">/</span><b>HopeForward Foundation</b>
                      </div>
                      <div className="ph-title">HopeForward Foundation</div>
                      <div className="ph-sub">Registered NPO · EIN 47-1234567 · Submitted Apr 22, 2026</div>
                    </div>
                    <div className="flex ic gap10">
                      <button className="btn btn-outline btn-sm">✉️ Contact NPO</button>
                      <button className="btn btn-teal btn-sm" onClick={() => openApprove('npo', 1, 'HopeForward Foundation')}>✓ Approve</button>
                      <button className="btn btn-rose btn-sm" onClick={() => openReject('npo', 1, 'HopeForward Foundation')}>✗ Reject</button>
                    </div>
                  </div>
                  <div className="g-21">
                    <div>
                      <div className="g3" style={{ marginBottom:16 }}>
                        {[['4','Total Projects'],['$142K','Total Raised'],['23','Creators Engaged']].map(([v, l]) => (
                          <div key={l} className="stat-mini"><div><div className="sm-val">{v}</div><div className="sm-lbl">{l}</div></div></div>
                        ))}
                      </div>
                      <div className="card">
                        <div className="card-title" style={{ marginBottom:14 }}>Submitted Documents</div>
                        <div style={{ fontSize:13, lineHeight:2 }}>
                          📄 IRS 501(c)(3) Determination Letter <span className="badge b-teal">Uploaded</span><br/>
                          📋 State Incorporation Certificate <span className="badge b-teal">Uploaded</span><br/>
                          🪪 Admin Passport (KYC) <span className="badge b-teal">Uploaded</span><br/>
                          🏦 Bank Verification Letter <span className="badge b-amber">Pending</span>
                        </div>
                        <div className="card-title" style={{ marginTop:16, marginBottom:14 }}>Compliance Checklist</div>
                        <div style={{ fontSize:13, lineHeight:2.2 }}>
                          ✅ Email & phone verified<br/>
                          ✅ 501(c)(3) determination letter<br/>
                          ✅ State incorporation (Illinois)<br/>
                          ✅ Admin passport KYC<br/>
                          ⬜ Bank account — pending verification<br/>
                          ✅ Compliance clear — no flags
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="card">
                        <div style={{ background:'linear-gradient(135deg,var(--ink),var(--ink-mid))', borderRadius:9, padding:16, marginBottom:14, textAlign:'center' }}>
                          <div className="av" style={{ background:'linear-gradient(135deg,var(--teal),#059669)', width:48, height:48, fontSize:18, margin:'0 auto 10px' }}>HP</div>
                          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:'#fff' }}>HopeForward Foundation</div>
                          <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.5)', marginTop:2 }}>Chicago, IL · Est. 2011</div>
                          <div style={{ marginTop:10 }}><span className="badge b-amber">⏳ Pending Approval</span></div>
                        </div>
                        <div style={{ fontSize:12.5, display:'flex', flexDirection:'column', gap:8 }}>
                          {[['Admin','Sarah Mitchell'],['Email','sarah@hopeforward.org'],['EIN','47-1234567'],['Tax Form','501(c)(3)'],['Bank','Chase Bank (pending verification)']].map(([k, v]) => (
                            <div key={k} className="flex jb"><span style={{ color:'var(--muted)' }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── CREATOR LIST ── */}
              {page === 'creator-list' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Creator Registry</div><div className="ph-sub">All influencers registered on the Socia platform</div></div>
                    <button className="btn btn-teal btn-sm">⬇ Export</button>
                  </div>
                  <div className="kpi-grid">
                    {[
                      { icon:'🤳', bg:'rgba(124,58,237,0.1)', lbl:'Total Creators', val:'312', delta:'↑ 28 this month', type:'up' },
                      { icon:'✅', bg:'rgba(15,155,142,0.1)', lbl:'KYC Approved', val:'287', delta:'92%', type:'up' },
                      { icon:'📤', bg:'rgba(232,160,32,0.12)', lbl:'Active on Campaigns', val:'148', delta:'This month', type:'up' },
                      { icon:'💵', bg:'rgba(14,165,233,0.1)', lbl:'Stipends Paid Out', val:'$84K', delta:'↑ 38% YoY', type:'up' },
                    ].map(k => (
                      <div key={k.lbl} className="kpi-card">
                        <div className="kpi-icon" style={{ background: k.bg }}>{k.icon}</div>
                        <div className="kpi-label">{k.lbl}</div>
                        <div className="kpi-value">{k.val}</div>
                        <div className={`kpi-delta ${k.type}`}>{k.delta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    {loading && <div style={{ color:'var(--muted)', fontSize:13, padding:12 }}>Loading…</div>}
                    {!loading && approvedInfluencers.length === 0 && <div style={{ color:'var(--muted)', fontSize:13, padding:12 }}>No approved creators yet.</div>}
                    {approvedInfluencers.length > 0 && (
                      <div className="tbl-wrap">
                        <table>
                          <thead><tr><th>Creator</th><th>Email</th><th>Country</th><th>SNS Accounts</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                          <tbody>
                            {approvedInfluencers.map((c, i) => {
                              const initials = (c.full_name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
                              const grads = ['linear-gradient(135deg,#0F9B8E,#0EA5E9)','linear-gradient(135deg,#7C3AED,#4F46E5)','linear-gradient(135deg,#E8A020,#D97706)','linear-gradient(135deg,#E8365D,#BE123C)'];
                              const sns = (() => { try { return JSON.parse(c.sns_accounts || '[]'); } catch { return []; } })();
                              return (
                                <tr key={c.id}>
                                  <td><div className="flex ic gap10"><div className="av" style={{ background: grads[i % grads.length] }}>{initials}</div><div style={{ fontWeight:600 }}>{c.full_name}</div></div></td>
                                  <td style={{ fontSize:12, color:'var(--muted)' }}>{c.email}</td>
                                  <td>{c.country || '—'}</td>
                                  <td className="td-mono">{sns.length > 0 ? sns.map(s => s.platform).join(', ') : '—'}</td>
                                  <td className="td-mono">{fmt(c.created_at)}</td>
                                  <td><span className="badge b-teal">✓ Approved</span></td>
                                  <td><button className="btn btn-outline btn-xs" onClick={() => openInfluencerDetail(c)}>View →</button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── CREATOR DETAIL ── */}
              {page === 'creator-detail' && selectedInfluencer && (
                <>
                  <div className="ph">
                    <div className="ph-left">
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>
                        <span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('creator-list')}>Creator Registry</span>
                        <span className="sep">/</span><b>{selectedInfluencer.full_name}</b>
                      </div>
                      <div className="ph-title">{selectedInfluencer.full_name}</div>
                      <div className="ph-sub">{selectedInfluencer.email} · {selectedInfluencer.country || '—'} · Joined {fmt(selectedInfluencer.created_at)}</div>
                    </div>
                  </div>
                  <div className="g-12">
                    <div>
                      <div className="card" style={{ marginBottom:14 }}>
                        {(() => {
                          const initials = (selectedInfluencer.full_name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
                          return (
                            <div style={{ background:'linear-gradient(135deg,var(--ink),var(--ink-mid))', borderRadius:9, padding:18, marginBottom:14, textAlign:'center' }}>
                              <div className="av" style={{ background:'linear-gradient(135deg,var(--teal),var(--sky))', width:52, height:52, fontSize:20, margin:'0 auto 10px' }}>{initials}</div>
                              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:16, color:'#fff' }}>{selectedInfluencer.full_name}</div>
                              <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{selectedInfluencer.email}</div>
                              <div style={{ marginTop:10 }}><span className="badge b-teal">✅ KYC Verified</span></div>
                            </div>
                          );
                        })()}
                        <div style={{ fontSize:12.5, display:'flex', flexDirection:'column', gap:8 }}>
                          {[
                            ['Email', selectedInfluencer.email || '—'],
                            ['Country', selectedInfluencer.country || '—'],
                            ['Phone', selectedInfluencer.phone || '—'],
                            ['Bio', selectedInfluencer.bio || '—'],
                            ['Status', selectedInfluencer.status],
                          ].map(([k, v]) => (
                            <div key={k} className="flex jb"><span style={{ color:'var(--muted)' }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const sns = (() => { try { return JSON.parse(selectedInfluencer.sns_accounts || '[]'); } catch { return []; } })();
                        return sns.length > 0 ? (
                          <div className="card" style={{ marginBottom:14 }}>
                            <div className="card-title">Connected Accounts</div>
                            <div className="card-sub">Linked social media platforms</div>
                            {sns.map((a, i) => (
                              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                                <span style={{ fontSize:20 }}>📱</span>
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13 }}>{a.platform}</div>
                                  <div style={{ fontSize:11, color:'var(--muted)' }}>{a.handle || a.url || ''}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })()}
                      <div className="card">
                        <div className="card-title">Active Projects</div>
                        <div className="card-sub">Projects this influencer is enrolled in</div>
                        {detailLoading && <div style={{ color:'var(--muted)', fontSize:13, padding:8 }}>Loading…</div>}
                        {!detailLoading && detailInfluencerProjects.length === 0 && (
                          <div style={{ color:'var(--muted)', fontSize:13, padding:8 }}>No active projects yet.</div>
                        )}
                        {!detailLoading && detailInfluencerProjects.map(proj => (
                          <div key={proj.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                            <div>
                              <div style={{ fontWeight:600, fontSize:13 }}>{proj.emoji || '🌍'} {proj.title}</div>
                              <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{proj.organization} · {proj.platform} · Enrolled {fmt(proj.enrolled_at)}</div>
                            </div>
                            <span className="badge b-teal">{proj.enrollment_status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── INFLUENCER REVIEW ── */}
              {page === 'influencer-review' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Influencer Approvals</div><div className="ph-sub">Review and approve creator registrations</div></div>
                  </div>
                  <div className="card">
                    <div className="card-title" style={{ marginBottom:14 }}>Pending Influencer Applications</div>
                    {loading && <div style={{ color:'var(--muted)', fontSize:13 }}>Loading…</div>}
                    {!loading && pendingInfl.length === 0 && <div style={{ color:'var(--muted)', fontSize:13 }}>No pending influencer applications.</div>}
                    {pendingInfl.map(inf => (
                      <div key={inf.id} className="review-card pending">
                        <div className="flex jb ic">
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{inf.full_name}</div>
                            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                              {inf.email} · {inf.country} · Submitted {fmt(inf.created_at)}
                            </div>
                          </div>
                          <div className="flex gap10">
                            {inf.status === 'approved' && <span className="badge b-teal">✓ Approved</span>}
                            {inf.status === 'rejected' && <span className="badge b-rose">✗ Rejected</span>}
                            {inf.status === 'pending' && (
                              <>
                                <button className="btn btn-outline btn-sm" onClick={() => openInfluencerDetail(inf)}>View Details</button>
                                <button className="btn btn-teal btn-sm" onClick={() => openApprove('influencer', inf.id, inf.full_name)}>✓ Approve</button>
                                <button className="btn btn-rose btn-sm" onClick={() => openReject('influencer', inf.id, inf.full_name)}>✗ Reject</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── PROJECT REVIEW ── */}
              {page === 'proj-review' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Project Submission Review</div><div className="ph-sub">Approve or reject campaign project submissions</div></div>
                  </div>
                  <div className="card">
                    <div className="card-title" style={{ marginBottom:14 }}>Pending Project Submissions</div>
                    {loading && <div style={{ color:'var(--muted)', fontSize:13 }}>Loading…</div>}
                    {!loading && pendingProjs.length === 0 && <div style={{ color:'var(--muted)', fontSize:13 }}>No pending project submissions.</div>}
                    {pendingProjs.map(p => (
                      <div key={p.id} className="review-card pending">
                        <div className="flex jb ic">
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{p.title}</div>
                            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                              NPO: {p.npo_name || p.organization} · Category: {p.category} · Goal: {p.goal} · Submitted: {fmt(p.created_at)}
                            </div>
                          </div>
                          <div className="flex gap10">
                            {p.status === 'approved' && <span className="badge b-teal">✓ Approved</span>}
                            {p.status === 'rejected' && <span className="badge b-rose">✗ Rejected</span>}
                            {p.status === 'pending' && (
                              <>
                                <button className="btn btn-teal btn-sm" onClick={() => openApprove('project', p.id, p.title)}>✓ Approve</button>
                                <button className="btn btn-rose btn-sm" onClick={() => openReject('project', p.id, p.title)}>✗ Reject</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── LIVE PROJECTS ── */}
              {page === 'proj-live' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Live Projects</div><div className="ph-sub">All currently active campaigns on Socia</div></div>
                    <button className="btn btn-teal btn-sm">⬇ Export</button>
                  </div>
                  <div className="card">
                    {loading && <div style={{ color:'var(--muted)', fontSize:13, padding:12 }}>Loading…</div>}
                    {!loading && approvedProjects.length === 0 && <div style={{ color:'var(--muted)', fontSize:13, padding:12 }}>No approved projects yet.</div>}
                    {approvedProjects.length > 0 && (
                      <div className="tbl-wrap">
                        <table>
                          <thead><tr><th>Project</th><th>NPO</th><th>Platform</th><th>Goal</th><th>Category</th><th>Deadline</th><th>Approved</th><th></th></tr></thead>
                          <tbody>
                            {approvedProjects.map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight:600, minWidth:200 }}>{p.emoji || '🌍'} {p.title}</td>
                                <td>{p.npo_name || p.organization}</td>
                                <td><span className="badge b-sky">{p.platform}</span></td>
                                <td style={{ fontWeight:700 }}>{p.goal || (p.goal_amount ? `$${Number(p.goal_amount).toLocaleString()}` : '—')}</td>
                                <td><span className={`badge ${CATBADGE[p.category] || 'b-gray'}`}>{p.category}</span></td>
                                <td className="td-mono">{p.deadline ? new Date(p.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</td>
                                <td className="td-mono">{fmt(p.reviewed_at || p.created_at)}</td>
                                <td><button className="btn btn-outline btn-xs" onClick={() => openProjectDetail(p)}>View →</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── PROJECT DETAIL ── */}
              {page === 'proj-detail' && selectedProject && (
                <>
                  <div className="ph">
                    <div className="ph-left">
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>
                        <span style={{ cursor:'pointer', color:'var(--teal)' }} onClick={() => nav('proj-live')}>Live Projects</span>
                        <span className="sep">/</span><b>{selectedProject.title}</b>
                      </div>
                      <div className="ph-title">{selectedProject.emoji || '🌍'} {selectedProject.title}</div>
                      <div className="ph-sub">{selectedProject.organization} · {selectedProject.platform} · {selectedProject.category}</div>
                    </div>
                  </div>
                  <div className="g-12">
                    <div>
                      <div className="card" style={{ marginBottom:14 }}>
                        <div className="card-title">Project Info</div>
                        <div style={{ fontSize:12.5, display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
                          {[
                            ['Title', selectedProject.title],
                            ['Organization', selectedProject.organization],
                            ['Platform', selectedProject.platform],
                            ['Category', selectedProject.category || '—'],
                            ['Goal', selectedProject.goal || (selectedProject.goal_amount ? `$${Number(selectedProject.goal_amount).toLocaleString()}` : '—')],
                            ['Deadline', selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'],
                            ['Status', selectedProject.status],
                          ].map(([k, v]) => (
                            <div key={k} className="flex jb"><span style={{ color:'var(--muted)' }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                          ))}
                        </div>
                      </div>
                      {selectedProject.description && (
                        <div className="card">
                          <div className="card-title">Description</div>
                          <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:8, lineHeight:1.6 }}>{selectedProject.description}</div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="card">
                        <div className="card-title">Enrolled Influencers</div>
                        <div className="card-sub">Creators participating in this project</div>
                        {detailLoading && <div style={{ color:'var(--muted)', fontSize:13, padding:8 }}>Loading…</div>}
                        {!detailLoading && detailProjectInfluencers.length === 0 && (
                          <div style={{ color:'var(--muted)', fontSize:13, padding:8 }}>No influencers enrolled yet.</div>
                        )}
                        {!detailLoading && detailProjectInfluencers.length > 0 && (
                          <div className="tbl-wrap" style={{ marginTop:10 }}>
                            <table>
                              <thead><tr><th>Creator</th><th>Email</th><th>Country</th><th>Status</th><th>Enrolled</th></tr></thead>
                              <tbody>
                                {detailProjectInfluencers.map((inf, i) => {
                                  const initials = (inf.full_name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
                                  const grads = ['linear-gradient(135deg,#0F9B8E,#0EA5E9)','linear-gradient(135deg,#7C3AED,#4F46E5)','linear-gradient(135deg,#E8A020,#D97706)','linear-gradient(135deg,#E8365D,#BE123C)'];
                                  return (
                                    <tr key={inf.id}>
                                      <td><div className="flex ic gap10"><div className="av" style={{ background: grads[i % grads.length], width:28, height:28, fontSize:10 }}>{initials}</div><span style={{ fontWeight:600 }}>{inf.full_name}</span></div></td>
                                      <td style={{ fontSize:12, color:'var(--muted)' }}>{inf.email}</td>
                                      <td>{inf.country || '—'}</td>
                                      <td><span className="badge b-teal">{inf.enrollment_status}</span></td>
                                      <td className="td-mono">{fmt(inf.enrolled_at)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── PAYOUTS ── */}
              {page === 'payouts' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Payouts & Fees</div><div className="ph-sub">Creator stipends and platform fee management</div></div>
                    <button className="btn btn-teal btn-sm">Process Batch Payout</button>
                  </div>
                  <div className="kpi-grid">
                    {[
                      { icon:'💵', bg:'rgba(15,155,142,0.1)', lbl:'Total Paid Out', val:'$84K', delta:'All time', type:'up' },
                      { icon:'⏳', bg:'rgba(232,160,32,0.12)', lbl:'Pending Payouts', val:'$12K', delta:'6 creators', type:'dn' },
                      { icon:'🏦', bg:'rgba(14,165,233,0.1)', lbl:'Platform Fees Collected', val:'$9.8K', delta:'3.5% of disbursements', type:'up' },
                      { icon:'📅', bg:'rgba(124,58,237,0.1)', lbl:'Next Batch', val:'May 1', delta:'Monthly cycle', type:'up' },
                    ].map(k => (
                      <div key={k.lbl} className="kpi-card">
                        <div className="kpi-icon" style={{ background: k.bg }}>{k.icon}</div>
                        <div className="kpi-label">{k.lbl}</div>
                        <div className="kpi-value">{k.val}</div>
                        <div className={`kpi-delta ${k.type}`}>{k.delta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-title" style={{ marginBottom:14 }}>Pending Creator Payouts</div>
                    <div className="tbl-wrap">
                      <table>
                        <thead><tr><th>Creator</th><th>Campaign</th><th>Gross Stipend</th><th>Platform Fee</th><th>Net Payout</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                          {[
                            ['Jamie Rivera','Ghana School Build','$400','$14','$386','Pending'],
                            ['Sofia Chen','Feed the Future','$450','$15.75','$434.25','Pending'],
                            ['Noah Impact','Clean Water Wells','$350','$12.25','$337.75','Processing'],
                          ].map(([name, campaign, gross, fee, net, status]) => (
                            <tr key={name + campaign}>
                              <td style={{ fontWeight:600 }}>{name}</td>
                              <td>{campaign}</td>
                              <td style={{ fontWeight:700 }}>{gross}</td>
                              <td style={{ color:'var(--rose)' }}>{fee}</td>
                              <td style={{ fontWeight:700, color:'var(--teal)' }}>{net}</td>
                              <td><span className={`badge ${status === 'Pending' ? 'b-amber' : 'b-sky'}`}>{status}</span></td>
                              <td><button className="btn btn-outline btn-xs">Process</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ── COMPLIANCE ── */}
              {page === 'compliance' && (
                <>
                  <div className="ph">
                    <div className="ph-left"><div className="ph-title">Compliance</div><div className="ph-sub">Platform compliance flags and watchlist checks</div></div>
                  </div>
                  <div className="card">
                    <div className="card-title" style={{ marginBottom:14 }}>Active Compliance Flags</div>
                    {[
                      { entity:'HopeForward Foundation', type:'NPO', issue:'Bank re-verification required — routing number mismatch', severity:'medium', dt:'3 days ago' },
                      { entity:'@noah.impact', type:'Creator', issue:'Content revision flag — post missing required campaign hashtags', severity:'low', dt:'2 days ago' },
                      { entity:'IRC', type:'NPO', issue:'Annual report 2024 not yet uploaded', severity:'low', dt:'5 days ago' },
                    ].map((f, i) => (
                      <div key={i} className="review-card pending" style={{ borderLeftColor: f.severity === 'medium' ? 'var(--amber)' : 'var(--muted)' }}>
                        <div className="flex jb ic">
                          <div>
                            <div style={{ fontWeight:700, fontSize:13.5 }}>{f.entity} <span className="badge b-gray">{f.type}</span></div>
                            <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:4 }}>{f.issue}</div>
                            <div style={{ fontSize:11, color:'var(--muted-2)', marginTop:2 }}>{f.dt}</div>
                          </div>
                          <div className="flex gap10">
                            <span className={`badge ${f.severity === 'medium' ? 'b-amber' : 'b-gray'}`}>{f.severity}</span>
                            <button className="btn btn-outline btn-sm">Resolve</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* ── APPROVAL MODAL ── */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">
                {modal.action === 'approve' ? '✓ Confirm Approval' : '✗ Confirm Rejection'}
              </div>
              <div className="modal-sub">
                {modal.action === 'approve'
                  ? `Approve "${modal.name}"? This will activate their account on Socia.`
                  : `Reject "${modal.name}"? They will be notified with your reason.`
                }
              </div>
              {modal.action === 'reject' && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--ink)', marginBottom:5 }}>Rejection Reason *</label>
                  <textarea
                    className="fi"
                    rows={3}
                    style={{ resize:'vertical' }}
                    placeholder="e.g. Documents incomplete, invalid tax ID..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap10" style={{ justifyContent:'flex-end' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Cancel</button>
                <button
                  className={`btn btn-sm ${modal.action === 'approve' ? 'btn-teal' : 'btn-rose'}`}
                  onClick={handleAction}
                  disabled={processing || (modal.action === 'reject' && !rejectReason.trim())}
                >
                  {processing ? 'Processing...' : modal.action === 'approve' ? '✓ Approve' : '✗ Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
