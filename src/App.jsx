import { useState, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"

const LINKS = ["About","Skills","Experience","Projects","Contact"]

function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  const pos = useRef({x:0,y:0}), rpos = useRef({x:0,y:0})
  const [big, setBig] = useState(false)
  useEffect(() => {
    const onMove = e => { pos.current={x:e.clientX,y:e.clientY}; if(dot.current) dot.current.style.transform=`translate(${e.clientX-4}px,${e.clientY-4}px)` }
    const onOver = e => { if(e.target.closest("a,button")) setBig(true) }
    const onOut = () => setBig(false)
    window.addEventListener("mousemove",onMove)
    document.addEventListener("mouseover",onOver)
    document.addEventListener("mouseout",onOut)
    let raf
    const tick = () => { rpos.current.x+=(pos.current.x-rpos.current.x)*0.1; rpos.current.y+=(pos.current.y-rpos.current.y)*0.1; if(ring.current) ring.current.style.transform=`translate(${rpos.current.x-17}px,${rpos.current.y-17}px)`; raf=requestAnimationFrame(tick) }
    tick()
    return () => { window.removeEventListener("mousemove",onMove); document.removeEventListener("mouseover",onOver); document.removeEventListener("mouseout",onOut); cancelAnimationFrame(raf) }
  }, [])
  return (<><div ref={dot} className="cursor-dot"/><div ref={ring} className={`cursor-ring${big?" big":""}`}/></>)
}

function Particles() {
  const canvas = useRef(null)
  useEffect(() => {
    const c=canvas.current, ctx=c.getContext("2d")
    let W,H,pts=[],raf
    const resize=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight }
    resize(); window.addEventListener("resize",resize)
    const make=()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.2,vy:(Math.random()-0.5)*0.2,r:Math.random()*1.1+0.3,a:Math.random()*0.3+0.05,p:Math.random()*Math.PI*2})
    for(let i=0;i<80;i++) pts.push(make())
    const draw=()=>{
      ctx.clearRect(0,0,W,H)
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.p+=0.012; if(p.x<0||p.x>W||p.y<0||p.y>H) Object.assign(p,make()); const a=p.a*(0.6+0.4*Math.sin(p.p)); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(201,168,76,${a})`; ctx.fill() })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){ const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<120){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(201,168,76,${0.1*(1-d/120)})`; ctx.lineWidth=0.5; ctx.stroke() } }
      raf=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ window.removeEventListener("resize",resize); cancelAnimationFrame(raf) }
  },[])
  return <canvas ref={canvas} className="hero-canvas"/>
}

const ROLES=["Full-Stack Software Engineer","Backend Engineer","Generative AI Developer","Python & React Developer"]
function Typewriter() {
  const [text,setText]=useState(""), [idx,setIdx]=useState(0), [del,setDel]=useState(false), [hold,setHold]=useState(false)
  useEffect(()=>{
    if(hold) return
    const cur=ROLES[idx]
    const t=setTimeout(()=>{
      if(!del){ const next=cur.slice(0,text.length+1); setText(next); if(next===cur){setHold(true); setTimeout(()=>{setDel(true);setHold(false)},2000)} }
      else { const next=cur.slice(0,text.length-1); setText(next); if(next===""){setDel(false);setIdx(i=>(i+1)%ROLES.length)} }
    },del?42:78)
    return ()=>clearTimeout(t)
  },[text,del,idx,hold])
  return <span><span className="typed">{text}</span><span className="blink"/></span>
}

function Reveal({children,delay=0,className=""}) {
  const {ref,inView}=useInView({threshold:0.1,triggerOnce:true})
  return <div ref={ref} className={`reveal${inView?" up":""} ${delay?`d${delay}`:""} ${className}`}>{children}</div>
}

function Avatar() {
  return (
    <div className="hero-right">
      <div className="profile-card">
        <div className="profile-glow" />
        <div className="profile-top">
          <div className="profile-photo" aria-label="Arfan Basha Shaik profile avatar">
            <span>AB</span>
          </div>
          <div className="status-pill"><span /> Open to SWE / AI Roles</div>
        </div>

        <div className="profile-copy">
          <p className="profile-kicker">MS Computer Science · UTA</p>
          <h3>Software Engineer</h3>
          <p>Building scalable APIs, full-stack products, and applied AI systems.</p>
        </div>

        <div className="profile-metrics">
          <div><strong>2+</strong><span>Years Experience</span></div>
          <div><strong>150+</strong><span>Users Served</span></div>
          <div><strong>25%</strong><span>Query Gain</span></div>
        </div>

        <div className="profile-terminal">
          <div className="terminal-bar"><i /><i /><i /></div>
          <code>{`const focus = ["React", "Python", "FastAPI", "GenAI"];`}</code>
          <code>{`build(ideas).ship().improve();`}</code>
        </div>
      </div>
    </div>
  )
}

function Nav() {
  const [scrolled,setScrolled]=useState(false)
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",fn); return ()=>window.removeEventListener("scroll",fn) },[])
  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="nav-logo">A<span>.</span>Shaik</a>
      <ul className="nav-links">{LINKS.map(l=><li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}</ul>
      <a href="#contact" className="nav-hire">Hire Me</a>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero">
      <Particles/>
      <div className="hero-vline" style={{left:"6%"}}/>
      <div className="hero-vline" style={{right:"6%"}}/>
      <div className="hero-left">
        <div className="hero-eyebrow"><div className="eyebrow-line"/><span className="eyebrow-text">Software Engineer · Arlington, TX</span></div>
        <h1 className="hero-name">Arfan Basha<span className="hero-name-gold"> Shaik</span></h1>
        <div className="hero-role"><Typewriter/></div>
        <p className="hero-desc">Building scalable backend systems, clean APIs, and intelligent applications — where solid engineering meets applied AI.</p>
        <div className="hero-btns">
          <a href="#projects" className="btn-gold">View My Work</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
      </div>
      <Avatar/>
      <div className="hero-scroll"><div className="scroll-line"/><span>Scroll to explore</span></div>
    </section>
  )
}

function About() {
  return (
    <section id="about">
      <Reveal><div className="s-tag">About Me</div></Reveal>
      <Reveal delay={1}><h2 className="s-heading">Crafting Systems<br/><span>That Scale</span></h2></Reveal>
      <div className="about-grid">
        <Reveal delay={2} className="about-text">
          <p>Software Engineer specializing in <strong>full-stack and backend development</strong>, with a strong foundation in building scalable systems, robust RESTful APIs, and high-quality responsive web applications.</p>
          <p>Proficient in <strong>Python, JavaScript/TypeScript, React.js, and Node.js</strong>, with solid command of API architecture, database management, and modern web technologies.</p>
          <p>Adept at building <strong>Generative AI applications</strong> powered by RAG, LLM APIs, and NLP using FastAPI, OpenAI, and vector databases — focused on clean engineering and reliable, data-driven solutions.</p>
        </Reveal>
        <Reveal delay={3}>
          <div className="about-stats">
            {[["2+","Years Experience"],["150+","Users Served"],["~25%","Query Performance Gain"],["~30%","UI Bug Reduction"]].map(([n,l])=>(
              <div key={l} className="stat-box"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const SKILLS_DATA=[
  {title:"Languages",sub:"Core Proficiency",tags:["Python","JavaScript","TypeScript","Java","SQL"],gold:true},
  {title:"AI / ML & GenAI",sub:"Applied Intelligence",tags:["Generative AI","RAG","LLMs","Prompt Engineering","NLP","LangChain","OpenAI API","Hugging Face","scikit-learn","Pandas","NumPy"],gold:true},
  {title:"Web & Backend",sub:"Full-Stack Engineering",tags:["React.js","Node.js","Next.js","FastAPI","GraphQL","REST APIs","WebSockets","OAuth 2.0","JWT"]},
  {title:"Databases & Storage",sub:"Data Management",tags:["PostgreSQL","MySQL","MongoDB","SQLite","Firebase","Qdrant (Vector DB)"]},
  {title:"Cloud & DevOps",sub:"Infrastructure",tags:["AWS EC2","AWS S3","Docker","Git","Jenkins","CI/CD","Linux","Postman"]},
]

function Skills() {
  return (
    <section id="skills">
      <Reveal><div className="s-tag">Technical Skills</div></Reveal>
      <Reveal delay={1}><h2 className="s-heading">What I <span>Work With</span></h2></Reveal>
      <div className="skills-grid">
        {SKILLS_DATA.map((s,i)=>(
          <Reveal key={s.title} delay={Math.min(i+1,4)}>
            <div className="skill-card">
              <div className="sk-title">{s.title}</div>
              <div className="sk-sub">{s.sub}</div>
              <div className="sk-tags">{s.tags.map(t=><span key={t} className={`stag${s.gold?" g":""}`}>{t}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const BULLETS=[
  <><strong>Python</strong> backend services — processing tracking events, handling business logic, validating requests, and exposing secure APIs for frontend and system integrations.</>,
  <>Responsive <strong>dashboard screens</strong> in React.js, JavaScript, HTML and CSS — used by <strong>150+ internal operations users</strong> to view tracking status, search records, and access reports.</>,
  <>Scalable <strong>RESTful APIs</strong> following OpenAPI/Swagger standards for reliable communication between frontend modules and backend services.</>,
  <>Secure auth with <strong>OAuth 2.0, JWT, and role-based access control</strong> across 3 distinct user roles, strengthening application security.</>,
  <><strong>GraphQL</strong> schema design and resolver development, cutting unnecessary API calls by <strong>~23%</strong> and improving frontend data-load efficiency.</>,
  <>Optimized <strong>SQL queries</strong> for tracking, user activity, and reporting data — improving query response time by <strong>~25%</strong> across analytics modules.</>,
  <>Refactored legacy <strong>JavaScript and React components</strong>, reducing UI bugs by <strong>~30%</strong> while improving maintainability and responsiveness.</>,
  <><strong>Agile</strong> collaboration — sprint planning, standups, code reviews, testing, and production issue resolution.</>,
]

function Experience() {
  return (
    <section id="experience">
      <Reveal><div className="s-tag">Experience</div></Reveal>
      <Reveal delay={1}><h2 className="s-heading">Where I've <span>Built</span></h2></Reveal>
      <Reveal delay={2}>
        <div className="exp-card">
          <div className="exp-top">
            <div><div className="exp-role">Software Engineer</div><div className="exp-co">Cognizant Technology Solutions</div></div>
            <div><div className="exp-date">Jan 2022 — Jul 2024</div><div className="exp-badge">Full-Time · India</div></div>
          </div>
          <div className="exp-body">
            <p className="exp-intro">Engineered and maintained a full-stack, real-time tracking and operations management platform monitoring status updates, operational workflows, and user activity across distributed application modules.</p>
            <ul className="exp-list">{BULLETS.map((b,i)=><li key={i}><span>{b}</span></li>)}</ul>
            <div className="env-box"><em>Environment</em>Python · React.js · JavaScript · HTML5 · CSS3 · REST APIs · GraphQL · OAuth 2.0 · JWT · SQL · OpenAPI/Swagger · Git · Jira · Agile/Scrum</div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={3} className="exp-edu">
        <div className="exp-card">
          <div className="exp-top">
            <div><div className="exp-role">Master of Science</div><div className="exp-co">Computer Science — AI/ML Specialization</div></div>
            <div><div className="exp-date">Aug 2024 — May 2026</div><div className="exp-badge">University of Texas at Arlington</div></div>
          </div>
          <div className="exp-body">
            <p className="exp-intro">Graduate studies focused on Artificial Intelligence and Machine Learning — with hands-on work in Generative AI, Retrieval-Augmented Generation, NLP, and intelligent application development.</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const PROJECTS=[
  {num:"01",tag:"Generative AI · RAG",name:"Runeva AI",sub:"GenAI Incident Investigation Assistant",desc:"A Generative AI assistant that streamlines incident investigation by enabling natural-language search across logs, alerts, and runbooks through a RAG-enabled workflow. Built with backend services and dashboards for automated incident summarization, troubleshooting, and remediation support.",tech:["Python","FastAPI","React.js","OpenAI API","Qdrant","RAG","SQLAlchemy","SQLite","Vite"],link:"https://github.com/Arfan2203/runeva-ai-agent"},
  {num:"02",tag:"Full Stack · AI-Assisted",name:"ReviewCodeAI",sub:"AI-Powered Code Review Platform",desc:"A full-stack code review platform that automatically identifies programming languages, analyzes code-quality issues, assigns severity-based scores, and generates corrected code drafts with downloadable reports — powered by REST APIs for submission, detection, scoring, and export.",tech:["React.js","Python","FastAPI","JavaScript","SQLite","REST APIs","Vite"],link:"https://github.com/Arfan2203/reviewcodeai"},
  {num:"03",tag:"NLP · ML Research",name:"DistilBERT vs BiLSTM",sub:"Sentiment Analysis on IMDB Reviews",desc:"Benchmarked transformer (DistilBERT) and sequential (BiLSTM) sentiment classifiers on IMDB movie reviews, with full text preprocessing, fine-tuning, and evaluation via accuracy, F1-score, and confusion matrices — comparing modern transformer vs. classical NLP approaches.",tech:["Python","NLP","DistilBERT","BiLSTM","Hugging Face","Pandas","NumPy"],link:"https://github.com/Arfan2203/distilbert-bilstm-imdb-sentiment"},
]

function Projects() {
  return (
    <section id="projects">
      <Reveal><div className="s-tag">Selected Projects</div></Reveal>
      <Reveal delay={1}><h2 className="s-heading">Things I've <span>Built</span></h2></Reveal>
      <div className="proj-grid">
        {PROJECTS.map((p,i)=>(
          <Reveal key={p.name} delay={Math.min(i+1,4)}>
            <div className="proj-card">
              <div className="proj-num">{p.num}</div>
              <div className="proj-tag">{p.tag}</div>
              <h3 className="proj-name">{p.name}</h3>
              <div className="proj-sub">{p.sub}</div>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-footer">
                <div className="proj-techs">{p.tech.map(t=><span key={t} className="ptag">{t}</span>)}</div>
                <a href={p.link} className="proj-link">View →</a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const [sent,setSent]=useState(false)
  const handle=e=>{ e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),3500); e.target.reset() }
  return (
    <section id="contact">
      <Reveal><div className="s-tag">Get In Touch</div></Reveal>
      <Reveal delay={1}><h2 className="s-heading">Let's <span>Connect</span></h2></Reveal>
      <div className="contact-grid">
        <Reveal delay={2} className="contact-left">
          <p>Open to Software Engineer, Full-Stack, and AI/ML opportunities. Whether it's a role, a collaboration, or just a conversation — feel free to reach out.</p>
          <div className="c-items">
            {[{icon:"✉",label:"Email",value:"basha.sk2203@gmail.com",href:"mailto:basha.sk2203@gmail.com"},{icon:"in",label:"LinkedIn",value:"Connect with me",href:"https://www.linkedin.com/in/arfan-basha-shaik-682a25246/"},{icon:"{}",label:"GitHub",value:"View my repositories",href:"https://github.com/repos?q=owner%3A%40me"}].map(c=>(
              <a key={c.label} href={c.href} className="c-item" target={c.href.startsWith("mailto")?undefined:"_blank"} rel="noreferrer">
                <div className="c-icon">{c.icon}</div>
                <div><div className="c-label">{c.label}</div><div className="c-value">{c.value}</div></div>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={3}>
          <form className="c-form" onSubmit={handle}>
            <div className="f-row">
              <div className="f-field"><label>Name</label><input type="text" placeholder="Your name" required/></div>
              <div className="f-field"><label>Email</label><input type="email" placeholder="your@email.com" required/></div>
            </div>
            <div className="f-field"><label>Subject</label><input type="text" placeholder="Job opportunity · Collaboration · Hello" required/></div>
            <div className="f-field"><label>Message</label><textarea placeholder="Tell me about the opportunity..." required/></div>
            <button type="submit" className="btn-submit">{sent?"Sent ✓":"Send Message →"}</button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="f-copy">Designed & Built by <span>Arfan Basha Shaik</span> · {new Date().getFullYear()}</div>
      <nav className="f-nav">{LINKS.map(l=><a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}</nav>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav/>
      <Hero/>
      <About/>
      <Skills/>
      <Experience/>
      <Projects/>
      <Contact/>
      <Footer/>
    </>
  )
}
