import { Link } from 'react-router-dom';

/* ── Design tokens (mirrors tokens.css) ──────────────────────── */
const T = {
  shell:       '#404E59',
  shellHover:  '#4f6272',
  mid:         '#7E9AAF',
  hoverLight:  '#94B5CD',
  punch:       '#FF5F1F',
  punchHover:  '#E04D10',
  ink:         '#1C2730',
  slate:       '#5C7080',
  muted:       '#7E9AAF',
  ghost:       '#F0F4F7',
  border:      '#7E9AAF',
  white:       '#FFFFFF',
  surface:     '#F7F9FA',
};

/* ── Editor mockup ───────────────────────────────────────────── */

function MockNav() {
  return (
    <div style={{
      width: 48, height: '100%',
      background: T.shell,
      borderRight: '1.5px solid rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: 10, gap: 6, flexShrink: 0,
    }}>
      <div style={{ width: 24, height: 24, background: T.punch, marginBottom: 8 }} />
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          width: 28, height: 28,
          borderLeft: i === 0 ? `3px solid ${T.punch}` : '3px solid transparent',
          background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent',
        }} />
      ))}
    </div>
  );
}

function MockTopBar() {
  return (
    <div style={{
      height: 40, background: T.white,
      borderBottom: '1.5px solid #000',
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 8, flexShrink: 0,
    }}>
      <div style={{ width: 90, height: 8, background: T.ghost }} />
      <div style={{ flex: 1 }} />
      <div style={{ width: 44, height: 22, border: `1.5px solid ${T.mid}` }} />
      <div style={{ width: 52, height: 22, background: T.punch }} />
    </div>
  );
}

function MockCanvas() {
  return (
    <div style={{
      flex: 1, overflow: 'hidden',
      background: T.shell,
      backgroundImage: `
        linear-gradient(rgba(148,181,205,0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148,181,205,0.12) 1px, transparent 1px)
      `,
      backgroundSize: '32px 32px',
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '18px 14px',
    }}>
      <div style={{
        width: '100%', maxWidth: 240,
        background: T.white,
        border: '1.5px solid #000',
        padding: '16px 14px',
      }}>
        {/* image placeholder */}
        <div style={{ width: '100%', height: 52, background: T.ghost, border: `1px solid ${T.mid}`, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 18, height: 14, background: T.mid }} />
        </div>
        {/* heading lines */}
        <div style={{ width: '72%', height: 11, background: T.ink, marginBottom: 5 }} />
        <div style={{ width: '52%', height: 7, background: T.ghost, marginBottom: 12 }} />
        {/* text lines */}
        {[100, 92, 96, 68].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 6, background: T.ghost, marginBottom: 4 }} />
        ))}
        {/* button */}
        <div style={{ width: 80, height: 24, background: T.punch, marginTop: 10 }} />
        {/* divider */}
        <div style={{ borderTop: `1.5px solid ${T.mid}`, margin: '12px 0' }} />
        {/* more text */}
        {[100, 88].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 6, background: T.ghost, marginBottom: 4 }} />
        ))}
      </div>
    </div>
  );
}

function MockPanel() {
  return (
    <div style={{
      width: 148, flexShrink: 0,
      background: T.white, borderLeft: '1.5px solid #000',
      padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ width: '60%', height: 6, background: T.mid, marginBottom: 2 }} />
      {[
        { label: 72, value: 90 },
        { label: 55, value: 75 },
        { label: 68, value: 60 },
        { label: 50, value: 80 },
      ].map(({ label, value }, i) => (
        <div key={i}>
          <div style={{ width: `${label}%`, height: 5, background: T.ghost, marginBottom: 5 }} />
          <div style={{ width: `${value}%`, height: 20, border: `1.5px solid ${T.mid}` }} />
        </div>
      ))}
    </div>
  );
}

function EditorMockup() {
  return (
    <div style={{
      width: '100%', maxWidth: 860,
      border: '1.5px solid #000',
      background: T.white,
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 34, background: T.shell,
        borderBottom: '1.5px solid #000',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 5,
      }}>
        {['#f87171', '#fbbf24', '#34d399'].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
        ))}
        <div style={{
          flex: 1, maxWidth: 200, height: 16,
          background: 'rgba(255,255,255,0.12)',
          marginLeft: 10,
        }} />
      </div>

      {/* App shell */}
      <div style={{ display: 'flex', height: 360 }}>
        <MockNav />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MockTopBar />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <MockCanvas />
            <MockPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Feature card ────────────────────────────────────────────── */

function Feature({ num, title, desc }) {
  return (
    <div style={{ borderTop: `1.5px solid #000`, paddingTop: 24, paddingBottom: 24 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: T.mid, marginBottom: 14,
      }}>
        {String(num).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8, color: T.ink }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.65, color: T.slate }}>
        {desc}
      </div>
    </div>
  );
}

/* ── Step ────────────────────────────────────────────────────── */

function Step({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', borderTop: `1px solid ${T.mid}`, paddingTop: 20, paddingBottom: 4 }}>
      <div style={{
        width: 32, height: 32, flexShrink: 0,
        background: T.shell, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, letterSpacing: '0.02em',
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: T.ink, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: T.slate }}>{desc}</div>
      </div>
    </div>
  );
}

/* ── Layout constants ────────────────────────────────────────── */

const MAX = 1100;
const G = '5%';

/* ── Landing Page ────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif", color: T.ink, background: T.white, minHeight: '100%' }}>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header style={{ background: T.white, borderBottom: '1.5px solid #000', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', padding: `0 ${G}`, height: 52, display: 'flex', alignItems: 'center' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 26, height: 26, background: T.punch,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <rect x="0.5" y="0.5" width="12" height="7" stroke="#fff" strokeWidth="1.2" fill="none" />
                <path d="M0.5 1.5L6.5 5.5L12.5 1.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="square" />
              </svg>
            </div>
            <span style={{ color: T.ink, fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              MailDraft
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <a href="#features" style={{ fontSize: 12, color: T.slate, textDecoration: 'none', padding: '4px 14px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: 12, color: T.slate, textDecoration: 'none', padding: '4px 14px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>How it works</a>
            <Link to="/" style={{
              marginLeft: 10,
              padding: '8px 18px',
              background: T.shell, color: '#fff',
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              Open builder →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1.5px solid #000', padding: `72px ${G} 64px`, background: T.white }}>
        <div style={{ maxWidth: MAX, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: T.shell, marginBottom: 28,
          }}>
            <div style={{ width: 24, height: 1.5, background: T.shell }} />
            Block-based email editor
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 800, lineHeight: 1.0,
            letterSpacing: '-0.04em',
            margin: '0 0 28px',
            maxWidth: 680,
          }}>
            Build email<br />templates.
            <span style={{ color: T.shell }}> Simply.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: T.slate, maxWidth: 460, margin: '0 0 40px' }}>
            A clean, block-based editor for crafting production-ready React Email templates — no code required.
          </p>

          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            <Link to="/" style={{
              padding: '12px 24px',
              background: T.shell, color: '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              border: `1.5px solid ${T.shell}`,
            }}>
              Start building →
            </Link>
            <a href="#how-it-works" style={{
              padding: '12px 24px',
              background: 'transparent', color: T.ink,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              border: '1.5px solid #000', borderLeft: 'none',
            }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Editor mockup ────────────────────────────────────── */}
      <section style={{
        padding: `56px ${G}`,
        borderBottom: '1.5px solid #000',
        background: T.shell,
        backgroundImage: `
          linear-gradient(rgba(148,181,205,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,181,205,0.10) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}>
        <div style={{ maxWidth: MAX, margin: '0 auto' }}>
          <EditorMockup />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: `64px ${G}`, borderBottom: '1.5px solid #000', background: T.white }}>
        <div style={{ maxWidth: MAX, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 48, borderBottom: '1.5px solid #000', paddingBottom: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.mid }}>Features</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
              Everything you need, nothing you don't.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 48px' }}>
            <Feature num={1} title="Drag & drop blocks" desc="Images, buttons, dividers, spacers, columns — each block maps to email-safe HTML. Arrange freely." />
            <Feature num={2} title="Live preview" desc="See your template rendered on desktop and mobile instantly. No back and forth." />
            <Feature num={3} title="React Email export" desc="One click exports a clean, production-ready React Email template ready to drop into any codebase." />
            <Feature num={4} title="Slash commands" desc="Type / anywhere to insert any block in one keystroke. Keyboard-first workflow, no menus to hunt through." />
            <Feature num={5} title="Template variables" desc="Use {{variables}} in your copy for dynamic personalisation. Preview with real values inline." />
            <Feature num={6} title="Shared blocks" desc="Save reusable sections — headers, footers, CTAs — and sync them across every template." />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: `64px ${G}`, borderBottom: '1.5px solid #000', background: T.surface }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.mid, marginBottom: 16 }}>
              How it works
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 20px', lineHeight: 1.05 }}>
              From blank to production in minutes.
            </h2>
            <p style={{ fontSize: 14, color: T.slate, lineHeight: 1.6, margin: 0, maxWidth: 340 }}>
              No config, no boilerplate. Open the editor, build your layout, export.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Step num={1} title="Create a template" desc="Name your template and open the editor. A blank canvas is ready immediately." />
            <Step num={2} title="Add blocks" desc="Type / to open the block menu. Insert text, images, buttons, columns, and more." />
            <Step num={3} title="Style & preview" desc="Use the inspector panel to adjust styles. Toggle the preview to check desktop and mobile." />
            <Step num={4} title="Export" desc="Click Export to copy your finished React Email template to clipboard or download as HTML." />
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section style={{ background: T.shell, padding: `64px ${G}`, borderBottom: '1.5px solid #000' }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.hoverLight, marginBottom: 12 }}>
              Get started
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 10px', lineHeight: 1.0 }}>
              Start building.
            </h2>
            <p style={{ fontSize: 14, color: T.hoverLight, margin: 0 }}>
              No signup. No install. Opens in your browser right now.
            </p>
          </div>
          <Link to="/" style={{
            padding: '14px 28px',
            background: T.punch, color: '#fff',
            fontSize: 13, fontWeight: 800, textDecoration: 'none',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            flexShrink: 0, border: `1.5px solid ${T.punch}`,
          }}>
            Open MailDraft →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background: T.white, borderTop: '1.5px solid #000', padding: `16px ${G}` }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.muted }}>
            MailDraft
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>
            Block-based email editor
          </span>
        </div>
      </footer>

    </div>
  );
}
