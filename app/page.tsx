'use client';
import { useEffect, useRef, useState } from 'react';

const BG = '#0e1a2e';
const ACC = '#a8c8e8';
const ACC2 = '#6a8fc0';
const TEXT = '#e8f0f8';
const MUTED = 'rgba(232,240,248,0.82)';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('opacity-100', 'translate-y-0');
          e.target.classList.remove('opacity-0', 'translate-y-8');
        }
      }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 ease-out" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else { setDone(true); clearInterval(interval); }
    }, 75);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}{!done && <span style={{ color: ACC, animation: 'blink 1s infinite' }}>|</span>}</span>;
}

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 40);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <div ref={ref} style={{ fontSize: '2.4rem', fontWeight: 700, color: ACC }}>{count}{suffix}</div>;
}

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, size: 2 + (i * 2.1) % 4,
    left: (i * 17.3) % 100, top: (i * 13.7) % 100,
    duration: 5 + (i * 1.1) % 6, delay: (i * 0.6) % 5,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', width: p.size, height: p.size,
          left: `${p.left}%`, top: `${p.top}%`,
          borderRadius: '50%', background: 'rgba(168,200,232,0.18)',
          animation: `floatP ${p.duration}s ease-in-out infinite ${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      await fetch('https://formspree.io/f/mzdoadlw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.9rem 1.2rem', borderRadius: 12, fontSize: 14,
    background: 'rgba(168,200,232,0.07)', color: TEXT,
    border: '1px solid rgba(168,200,232,0.2)', outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'inherit',
  };
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle}
          onFocus={e => (e.target.style.borderColor = ACC)} onBlur={e => (e.target.style.borderColor = 'rgba(168,200,232,0.2)')} />
        <input placeholder="Your email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle}
          onFocus={e => (e.target.style.borderColor = ACC)} onBlur={e => (e.target.style.borderColor = 'rgba(168,200,232,0.2)')} />
      </div>
      <textarea placeholder="Your message..." value={form.message} rows={5} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        style={{ ...inputStyle, resize: 'vertical', marginBottom: '1rem', display: 'block' }}
        onFocus={e => (e.target.style.borderColor = ACC)} onBlur={e => (e.target.style.borderColor = 'rgba(168,200,232,0.2)')} />
      <button onClick={handleSubmit} disabled={status === 'sending' || status === 'sent'}
        style={{ width: '100%', padding: '0.9rem', borderRadius: 100, fontSize: 14, fontWeight: 600,
          background: status === 'sent' ? 'rgba(100,200,150,0.15)' : 'rgba(168,200,232,0.12)',
          color: status === 'sent' ? '#80d0a0' : ACC,
          border: `1.5px solid ${status === 'sent' ? 'rgba(100,200,150,0.4)' : 'rgba(168,200,232,0.3)'}`,
          cursor: status === 'sending' || status === 'sent' ? 'default' : 'pointer',
          transition: 'all 0.22s', fontFamily: 'inherit' }}
        onMouseEnter={e => { if (status === 'idle') { e.currentTarget.style.background = 'rgba(168,200,232,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
        onMouseLeave={e => { e.currentTarget.style.background = status === 'sent' ? 'rgba(100,200,150,0.15)' : 'rgba(168,200,232,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {status === 'sending' ? 'Sending...' : status === 'sent' ? "✓ Message sent! I'll get back to you soon." : status === 'error' ? 'Something went wrong — try again' : 'Send Message'}
      </button>
    </div>
  );
}

const JOBS = [
  {
    company: 'The Home Depot', location: 'Atlanta, GA', role: 'Sr. Software Engineer',
    period: 'July 2024 – Present', domain: 'Retail',
    points: [
      'Spearheaded end-to-end architecture of a large-scale retail e-commerce platform using FastAPI, React.js, Next.js, and AWS EKS',
      'Decomposed a tightly coupled monolith into microservices with GraphQL and RESTful APIs',
      'Built LLM-powered assistant using OpenAI API, LangChain, and RAG pipeline backed by FAISS',
      'Provisioned all infrastructure with Terraform and automated delivery via GitHub Actions CI/CD',
      'Actively mentored junior and mid-level engineers through structured code reviews, architectural walkthroughs, and 1:1 technical coaching — accelerating team velocity and driving a measurable reduction in production incidents',
    ]
  },
  {
    company: 'HP', location: 'Vancouver, WA', role: 'Software Developer',
    period: 'Aug 2022 – June 2024', domain: 'Enterprise Technology',
    points: [
      'Owned full-stack development of a patient data management platform using Django, React.js, and GCP',
      'Integrated Hugging Face transformer models for ICD-10 clinical note classification',
      'Streamed real-time clinical events via GCP Pub/Sub into BigQuery for population health reporting',
      'Deployed on GCP Cloud Run with VPC-native networking and strict IAM access controls',
    ]
  },
  {
    company: 'Avalon Healthcare', location: 'Salt Lake City, UT', role: 'Software Developer',
    period: 'Dec 2020 – July 2022', domain: 'Healthcare',
    points: [
      'Built member enrollment, care plan management, and prior authorization workflows using FastAPI and React.js',
      'Secured all HIPAA-sensitive APIs with JWT and OAuth2 across web, mobile, and internal clients',
      'Deployed on Azure Container Apps with Terraform and Azure DevOps Pipelines',
      'Migrated batch jobs to Azure Functions for claims summaries and enrollment report processing',
    ]
  },
  {
    company: 'Knoah Solutions', location: 'Hyderabad, India', role: 'Software Engineer',
    period: 'June 2019 – Nov 2020', domain: 'Enterprise',
    points: [
      'Built full-stack business management tools using Python, Django, React.js, and PostgreSQL',
      'Created RESTful APIs with Django REST Framework and deployed on AWS EC2',
      'Packaged applications using Docker for consistent development and deployment environments',
    ]
  },
];

const SKILLS = [
  { label: 'Languages', items: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL'] },
  { label: 'Backend', items: ['FastAPI', 'Django', 'Flask', 'DRF', 'Celery', 'GraphQL', 'REST APIs', 'WebSockets', 'Microservices'] },
  { label: 'Frontend', items: ['React.js', 'Next.js', 'Redux Toolkit', 'Context API', 'Tailwind CSS', 'Bootstrap', 'Chart.js'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'GitLab CI/CD', 'Azure DevOps'] },
  { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'Cassandra', 'Oracle', 'SQLAlchemy'] },
  { label: 'AI & ML', items: ['OpenAI API', 'LangChain', 'RAG', 'FAISS', 'Hugging Face', 'PySpark', 'LLMs'] },
  { label: 'Distributed Systems', items: ['Apache Kafka', 'RabbitMQ', 'Apache Spark', 'Prometheus', 'Grafana', 'ELK Stack'] },
  { label: 'Testing & Quality', items: ['Pytest', 'TDD', 'SonarQube', 'pytest-cov', 'Unit Testing', 'Integration Testing'] },
];

export default function Home() {
  return (
    <main style={{ background: BG, color: TEXT, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes floatP { 0%,100%{transform:translateY(0) translateX(0);} 33%{transform:translateY(-22px) translateX(12px);} 66%{transform:translateY(12px) translateX(-12px);} }
        @keyframes spinRing { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: rgba(168,200,232,0.72); }
      `}</style>

      {/* ── NAV — floating pill ── */}
      <nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: 'calc(100% - 48px)', maxWidth: 1100 }}>
        <div style={{
          background: 'rgba(10,18,35,0.85)', backdropFilter: 'blur(20px)',
          borderRadius: 100, border: '1px solid rgba(168,200,232,0.15)',
          padding: '0.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}>
          <span style={{ color: ACC, fontWeight: 700, fontSize: 17, letterSpacing: '0.04em' }}>Bhavya Meghana</span>
          <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
            {['about', 'experience', 'skills', 'education', 'contact'].map(s => (
              <a key={s} href={`#${s}`}
                style={{ color: MUTED, textDecoration: 'none', textTransform: 'capitalize', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = ACC)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
              >{s}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 2rem 3rem', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse at 20% 40%, rgba(80,130,200,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(50,100,180,0.12) 0%, transparent 55%), ${BG}` }}>
        <Particles />
        <div style={{ maxWidth: 1140, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 230, height: 230 }}>
              <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: `conic-gradient(${ACC} 0deg, ${ACC2} 180deg, ${ACC} 360deg)`, animation: 'spinRing 7s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: BG }} />
              <img src="/photo.jpg" alt="Bhavya Meghana Chippada" style={{ position: 'absolute', inset: 5, width: 220, height: 220, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACC, marginBottom: '1rem', opacity: 0.85 }}>Sr. Python Full Stack Developer</p>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.3rem', color: TEXT }}>
              <TypingText text="Bhavya Meghana Chippada" />
            </h1>
            <p style={{ color: MUTED, fontSize: 17, marginBottom: '0.7rem' }}>7+ Years · Retail & Healthcare · Los Angeles, CA</p>
            <p style={{ color: 'rgba(232,240,248,0.72)', maxWidth: 500, marginBottom: '2.2rem', lineHeight: 1.75, fontSize: 15 }}>
              Building scalable, production-grade web applications across Python, React, AWS, GCP, and Azure.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhavya-meghana-chippada-408aa420b/', primary: true },
                { label: 'GitHub', href: 'https://github.com/Meghanachippada', primary: false },
                { label: 'Medium', href: 'https://medium.com/@BhavyaMeghanaChippada', primary: false },
                { label: 'Email', href: 'mailto:bhavyameghanach@gmail.com', primary: false },
              ].map(btn => (
                <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '0.75rem 1.6rem', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.22s', background: btn.primary ? ACC : 'transparent', color: btn.primary ? BG : ACC, border: `1.5px solid ${btn.primary ? ACC : 'rgba(168,200,232,0.35)'}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACC; e.currentTarget.style.color = BG; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = btn.primary ? ACC : 'transparent'; e.currentTarget.style.color = btn.primary ? BG : ACC; e.currentTarget.style.transform = 'translateY(0)'; }}
                >{btn.label}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{ padding: '3.5rem 2rem', borderTop: '1px solid rgba(168,200,232,0.1)', borderBottom: '1px solid rgba(168,200,232,0.1)', background: BG }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {[{ n: 7, s: '+', l: 'Years Experience' }, { n: 4, s: '', l: 'Companies' }, { n: 2, s: '', l: 'Domains' }, { n: 20, s: '+', l: 'Technologies' }].map(c => (
            <div key={c.l}>
              <Counter end={c.n} suffix={c.s} />
              <p style={{ color: MUTED, marginTop: 8, fontSize: 13 }}>{c.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '6rem 2rem', background: BG }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <FadeIn>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: ACC, marginBottom: '1.5rem' }}>About Me</h2>
            <p style={{ color: MUTED, fontSize: 17, lineHeight: 1.9 }}>
              I'm a Senior Python Full Stack Developer with 8+ years of experience building and scaling
              production-grade web applications across Retail and Healthcare domains. I take end-to-end
              ownership — from architecture and system design through deployment and production support.
              I've led platform-level engineering, decomposed monoliths into microservices, delivered
              LLM-powered features, and mentored engineers across multiple enterprise environments.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <FadeIn><h2 style={{ fontSize: '2rem', fontWeight: 700, color: ACC, marginBottom: '3rem' }}>Experience</h2></FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {JOBS.map((job, i) => (
              <FadeIn key={job.company} delay={i * 100}>
                <div
                  style={{ borderLeft: '2px solid rgba(168,200,232,0.2)', paddingLeft: '1.6rem', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderLeftColor = ACC)}
                  onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'rgba(168,200,232,0.2)')}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{job.company}</h3>
                      <p style={{ color: ACC, fontSize: 14, marginTop: 4 }}>{job.role} · {job.location}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                      <span style={{ color: MUTED, fontSize: 13 }}>{job.period}</span>
                      <span style={{ background: 'rgba(168,200,232,0.1)', color: ACC, fontSize: 11, padding: '3px 11px', borderRadius: 100, border: '1px solid rgba(168,200,232,0.22)' }}>{job.domain}</span>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                    {job.points.map(p => (
                      <li key={p} style={{ color: MUTED, fontSize: 14, display: 'flex', gap: 10, lineHeight: 1.65 }}>
                        <span style={{ color: ACC, marginTop: 3, flexShrink: 0 }}>▸</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: '6rem 2rem', background: BG }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn><h2 style={{ fontSize: '2rem', fontWeight: 700, color: ACC, marginBottom: '3rem' }}>Technical Skills</h2></FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SKILLS.map((group, i) => (
              <FadeIn key={group.label} delay={i * 60}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', padding: '1.6rem 0', borderBottom: '1px solid rgba(168,200,232,0.08)' }}>
                  <div style={{ minWidth: 150, paddingTop: 5 }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACC, fontWeight: 600, opacity: 0.85 }}>{group.label}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {group.items.map(item => (
                      <span key={item}
                        style={{ background: 'rgba(168,200,232,0.1)', color: TEXT, border: '1px solid rgba(168,200,232,0.22)', padding: '5px 15px', borderRadius: 100, fontSize: 13, transition: 'all 0.2s', cursor: 'default' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,200,232,0.22)'; e.currentTarget.style.borderColor = 'rgba(168,200,232,0.5)'; e.currentTarget.style.color = ACC; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,200,232,0.1)'; e.currentTarget.style.borderColor = 'rgba(168,200,232,0.22)'; e.currentTarget.style.color = TEXT; }}
                      >{item}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <FadeIn><h2 style={{ fontSize: '2rem', fontWeight: 700, color: ACC, marginBottom: '3rem' }}>Education</h2></FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { degree: "Master's in Computer Science", school: 'California State University, Fullerton, CA' },
              { degree: "Bachelor's in Computer Science", school: 'JNTU-GV, Andhra Pradesh, India' },
            ].map((edu, i) => (
              <FadeIn key={edu.degree} delay={i * 120}>
                <div
                  style={{ background: 'rgba(168,200,232,0.06)', borderRadius: 14, padding: '1.5rem 1.8rem', border: '1px solid rgba(168,200,232,0.15)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,200,232,0.4)'; e.currentTarget.style.background = 'rgba(168,200,232,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,200,232,0.15)'; e.currentTarget.style.background = 'rgba(168,200,232,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: TEXT }}>{edu.degree}</h3>
                  <p style={{ color: ACC, marginTop: 6, fontSize: 14 }}>{edu.school}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '6rem 2rem', background: BG }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: ACC, marginBottom: '1rem' }}>Get In Touch</h2>
            <p style={{ color: MUTED, marginBottom: '2.5rem', fontSize: 15 }}>Open to full-time Python Full Stack Developer roles</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {[
                { label: 'bhavyameghanach@gmail.com', href: 'mailto:bhavyameghanach@gmail.com', primary: true },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhavya-meghana-chippada-408aa420b/', primary: false },
                { label: 'GitHub', href: 'https://github.com/Meghanachippada', primary: false },
              ].map(btn => (
                <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '0.8rem 1.7rem', borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.22s', background: btn.primary ? ACC : 'transparent', color: btn.primary ? BG : ACC, border: `1.5px solid ${btn.primary ? ACC : 'rgba(168,200,232,0.35)'}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACC; e.currentTarget.style.color = BG; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = btn.primary ? ACC : 'transparent'; e.currentTarget.style.color = btn.primary ? BG : ACC; e.currentTarget.style.transform = 'translateY(0)'; }}
                >{btn.label}</a>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(168,200,232,0.12)' }} />
              <span style={{ color: MUTED, fontSize: 13 }}>or send me a message directly</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(168,200,232,0.12)' }} />
            </div>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: 'center', color: 'rgba(232,240,248,0.25)', fontSize: 13, padding: '2rem', borderTop: '1px solid rgba(168,200,232,0.08)', background: BG }}>
        © 2026 Bhavya Meghana Chippada · Built with Next.js & Tailwind CSS
      </footer>

    </main>
  );
}