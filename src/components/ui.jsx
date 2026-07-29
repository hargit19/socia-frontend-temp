/* Shared low-level UI primitives used across all three dashboards */
export function yen(amount) {
  return `¥${Math.round(Number(amount) || 0).toLocaleString()}`;
}

export function Badge({ variant = 'gray', children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function Btn({ variant = 'outline', size, onClick, children, type = 'button', disabled }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}${size ? ` btn-${size}` : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, color = '#14B8A6' }) {
  return (
    <div className="prog-wrap">
      <div className="prog-bar" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
    </div>
  );
}

export function Timeline({ items }) {
  return (
    <div className="tl">
      {items.map((item, i) => (
        <div className="tl-item" key={i}>
          <div className={`tl-dot${item.done ? ' done' : item.wait ? ' wait' : ''}`} />
          <div className="tl-title" style={item.color ? { color: item.color } : {}}>
            {item.title}
          </div>
          <div className="tl-meta">{item.meta}</div>
        </div>
      ))}
    </div>
  );
}

export function StatCard({ icon, iconBg, value, label, delta, deltaType = 'up', onClick }) {
  return (
    <div className="stat-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {delta && <div className={`stat-delta ${deltaType}`}>{delta}</div>}
      </div>
    </div>
  );
}

export function Card({ title, sub, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <div className="card-title">{title}</div>}
      {sub && <div className="card-sub">{sub}</div>}
      {children}
    </div>
  );
}

export function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className={`step-item${done ? ' done' : active ? ' current' : ''}`}>
            <div className="step-circle">{done ? '✓' : i + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        );
      })}
    </div>
  );
}

export function UploadBox({ icon, text, subtext, accepted }) {
  return (
    <div className="upload-box">
      <div className="upload-icon">{icon}</div>
      <div className="upload-text">
        {accepted ? (
          <>
            <strong>{text}</strong>
            <div style={{ fontSize: 11, color: 'var(--teal-mid, #14B8A6)', marginTop: 4 }}>✓ File accepted</div>
          </>
        ) : (
          <>
            <strong style={{ color: 'inherit' }}>Click to upload</strong> {text}
            {subtext && <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{subtext}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export function FormGroup({ label, children }) {
  return (
    <div className="form-group fg">
      {label && <label className="form-label fl">{label}</label>}
      {children}
    </div>
  );
}

export function NotifItem({ icon, iconBg, text, time }) {
  return (
    <div className="notif-item notif">
      <div className="notif-icon notif-ic" style={{ background: iconBg }}>{icon}</div>
      <div>
        <div className="notif-text notif-txt" dangerouslySetInnerHTML={{ __html: text }} />
        <div className="notif-time notif-t">{time}</div>
      </div>
    </div>
  );
}

export function SocialLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#1A2B4A" />
      <path d="M20 8 C20 8, 28 12, 32 20 C28 28, 20 32, 12 28 C8 24, 10 14, 20 8Z" fill="#1E88E5" opacity="0.8" />
      <path d="M20 8 C12 10, 8 18, 12 28 C14 28, 16 26, 18 22 C16 18, 16 14, 20 8Z" fill="#43A047" opacity="0.85" />
      <path d="M32 20 C30 26, 24 30, 18 32 C18 28, 20 24, 24 22 C28 20, 30 18, 32 20Z" fill="#FB8C00" opacity="0.9" />
      <circle cx="20" cy="16" r="4" fill="white" opacity="0.9" />
    </svg>
  );
}
