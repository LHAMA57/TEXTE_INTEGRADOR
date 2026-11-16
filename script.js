const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const spectrumInfo = {
  "Rádio":"Ondas utilizadas em transmissões de rádio, televisão e comunicação.",
  "Micro-ondas":"Utilizadas em radares, comunicações e aquecimento de alimentos.",
  "Infravermelho":"Associado à radiação térmica emitida pelos corpos.",
  "Visível":"Faixa do espectro que pode ser percebida pelo olho humano.",
  "Ultravioleta":"Radiação com frequência maior que a luz visível.",
  "Raios X":"Radiação de alta energia utilizada em exames de imagem.",
  "Gama":"Radiação de frequência muito elevada e grande energia por fóton."
};
$$("[data-spectrum]").forEach(btn => btn.addEventListener("click", () => {
  $$("[data-spectrum]").forEach(b => {b.classList.remove("active"); b.setAttribute("aria-pressed","false");});
  btn.classList.add("active"); btn.setAttribute("aria-pressed","true");
  $("#spectrumTitle").textContent = btn.dataset.spectrum;
  $("#spectrumText").textContent = spectrumInfo[btn.dataset.spectrum];
}));

const particleScene = $("#particleScene");
const particles = Array.from({length:34}, () => {
  const el=document.createElement("span"); el.className="particle"; particleScene.append(el);
  return {el,x:Math.random()*96,y:Math.random()*86,vx:Math.random()*2-1,vy:Math.random()*2-1};
});
function updateParticles(){
  const temp=Number($("#particleTemp").value);
  $("#particleOutput").textContent=`${temp} °C`;
  const speed=.12+(temp/500)*1.25;
  particles.forEach(p=>{
    p.x+=p.vx*speed;p.y+=p.vy*speed;
    if(p.x<1||p.x>98)p.vx*=-1;if(p.y<1||p.y>96)p.vy*=-1;
    p.el.style.left=p.x+"%";p.el.style.top=p.y+"%";
  });
}
$("#particleTemp").addEventListener("input",updateParticles);updateParticles();
let particleFrame;
function animateParticles(){updateParticles();particleFrame=requestAnimationFrame(animateParticles)}
if(!matchMedia("(prefers-reduced-motion: reduce)").matches) animateParticles();

const sigma=5.670374419e-8;
function calculate(){
  const c=Number($("#calcTemp").value), e=Number($("#emissivity").value), a=Number($("#area").value), k=c+273.15;
  const p=e*sigma*a*Math.pow(k,4);
  $("#calcTempOut").textContent=`${c} °C`;
  $("#emissivityOut").textContent=e.toFixed(2).replace(".",",");
  $("#areaOut").textContent=`${a.toFixed(1).replace(".",",")} m²`;
  $("#kelvinOut").textContent=`Temperatura absoluta: ${k.toFixed(2).replace(".",",")} K`;
  $("#powerOut").textContent=p.toLocaleString("pt-BR",{maximumFractionDigits:2})+" W";
}
["calcTemp","emissivity","area"].forEach(id=>$("#"+id).addEventListener("input",calculate));calculate();

const mechanisms={
 radiacao:["MECANISMO 01","Radiação","A superfície da piscina emite ondas eletromagnéticas, principalmente na faixa do infravermelho. Esse processo não depende da presença de vento."],
 evaporacao:["MECANISMO 02","Evaporação","Moléculas de água passam para o estado gasoso levando energia. A evaporação pode continuar mesmo quando o ar está parado."],
 conveccao:["MECANISMO 03","Convecção","Ocorre troca de calor entre a superfície da água e o ar próximo. Pode existir convecção natural, causada por diferenças de temperatura e densidade."]
};
$$("[data-mechanism]").forEach(btn=>btn.addEventListener("click",()=>{
  $$("[data-mechanism]").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-pressed","false")});
  btn.classList.add("active");btn.setAttribute("aria-pressed","true");
  const data=mechanisms[btn.dataset.mechanism];
  $("#mechanismKicker").textContent=data[0];$("#mechanismTitle").textContent=data[1];$("#mechanismText").textContent=data[2];
}));
$("#coverToggle").addEventListener("click",()=>{
  const active=$("#coverToggle").getAttribute("aria-pressed")!=="true";
  $("#coverToggle").setAttribute("aria-pressed",String(active));
  $("#coverToggle").textContent=active?"Remover cobertura":"Ativar cobertura";
  $("#poolDemo").classList.toggle("covered",active);
  $("#poolDemo").setAttribute("aria-label",active?"Ilustração de piscina com cobertura":"Ilustração de piscina sem cobertura");
  $("#coverStatus").textContent=active?"Cobertura ativada: a barreira ajuda a reduzir principalmente a evaporação e também pode diminuir outras trocas de energia.":"Cobertura desativada: a evaporação ocorre mais livremente.";
});

const dialog=$("#accessDialog");
$("#accessOpen").addEventListener("click",()=>dialog.showModal());
$("#accessClose").addEventListener("click",()=>dialog.close());
$("#fontDown").addEventListener("click",()=>changeFont(-1));
$("#fontUp").addEventListener("click",()=>changeFont(1));
let fontSize=16;
function changeFont(delta){fontSize=Math.min(21,Math.max(14,fontSize+delta));document.documentElement.style.setProperty("--base",fontSize+"px")}
function toggleClass(button,cls){const on=!document.body.classList.contains(cls);document.body.classList.toggle(cls,on);button.setAttribute("aria-pressed",String(on))}
$("#contrastToggle").addEventListener("click",()=>toggleClass($("#contrastToggle"),"high-contrast"));
$("#motionToggle").addEventListener("click",()=>toggleClass($("#motionToggle"),"reduce-motion"));
$("#readingToggle").addEventListener("click",()=>toggleClass($("#readingToggle"),"reading-mode"));
$("#resetAccess").addEventListener("click",()=>{
  fontSize=16;document.documentElement.style.setProperty("--base","16px");
  ["high-contrast","reduce-motion","reading-mode"].forEach(c=>document.body.classList.remove(c));
  ["contrastToggle","motionToggle","readingToggle"].forEach(id=>$("#"+id).setAttribute("aria-pressed","false"));
});


// Tema escuro como padrão. A troca para claro fica disponível apenas em Acessibilidade.
const themeToggle = $("#themeToggle");
const themeLabel = $("#themeLabel");
const themeIcon = $("#themeIcon");
const savedTheme = localStorage.getItem("site-theme");
function applyTheme(theme){
  const light = theme === "light";
  document.body.classList.toggle("light-theme", light);
  document.body.classList.remove("dark-theme");
  themeToggle.setAttribute("aria-pressed", String(light));
  themeToggle.setAttribute("aria-label", light ? "Modo claro ativo. Ativar modo escuro" : "Modo escuro ativo. Ativar modo claro");
  themeLabel.textContent = light ? "Ativar modo escuro" : "Ativar modo claro";
  themeIcon.textContent = light ? "☾" : "☼";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#fff8f4" : "#100d16");
}
applyTheme(savedTheme === "light" ? "light" : "dark");
themeToggle.addEventListener("click",()=>{
  const next = document.body.classList.contains("light-theme") ? "dark" : "light";
  localStorage.setItem("site-theme",next);
  applyTheme(next);
});

// Microinterações com o cursor: brilho, anel e resposta ao hover.
// Só ativa em dispositivos com mouse/trackpad e respeita redução de movimento.
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !reducedMotion) {
  const glow = $(".cursor-glow");
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX, ringY = pointerY;

  document.body.classList.add("cursor-active");
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    dot.style.left = pointerX + "px";
    dot.style.top = pointerY + "px";
    glow.style.left = pointerX + "px";
    glow.style.top = pointerY + "px";
  }, { passive: true });

  function moveRing() {
    ringX += (pointerX - ringX) * 0.18;
    ringY += (pointerY - ringY) * 0.18;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(moveRing);
  }
  moveRing();

  $$("a,button,input,[role='button'],.interactive-card").forEach((element) => {
    element.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    element.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });

  // Inclinação sutil nos painéis, sem interferir no foco pelo teclado.
  $$(".panel,.fact-card,.timeline article,.hero-visual").forEach((card) => {
    card.classList.add("interactive-card");
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - .5) * 4;
      const rotateX = (.5 - y) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Revelação progressiva ao entrar na área visível.
if (!reducedMotion && "IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");
  const revealTargets = $$(".section-heading,.panel,.fact-card,.mechanisms,.timeline article,.hero-grid > div");
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = (index % 3) * 70 + "ms";
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
}

// Barra de leitura no topo, atualizada de forma eficiente.
const progressBar = $("#scrollProgress");
let progressTicking = false;
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  progressTicking = false;
}
window.addEventListener("scroll", () => {
  if (!progressTicking) {
    requestAnimationFrame(updateScrollProgress);
    progressTicking = true;
  }
}, { passive: true });
updateScrollProgress();

// Halo visual no ponto pressionado: funciona com mouse, caneta e toque.
$$(".button,.mechanism,.spectrum button,.access-actions button,.close-button").forEach((element) => {
  element.classList.add("tap-ripple");
  element.addEventListener("pointerdown", (event) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--tap-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--tap-y", `${event.clientY - rect.top}px`);
    element.classList.remove("is-tapped");
    void element.offsetWidth;
    element.classList.add("is-tapped");
  });
  element.addEventListener("animationend", () => element.classList.remove("is-tapped"));
});
if (matchMedia("(pointer: coarse)").matches) {
  $$(".panel,.fact-card,.timeline article,.hero-visual").forEach((card) => {
    card.addEventListener("pointerdown", () => card.classList.add("touch-active"), {passive:true});
    const release = () => card.classList.remove("touch-active");
    card.addEventListener("pointerup", release, {passive:true});
    card.addEventListener("pointercancel", release, {passive:true});
    card.addEventListener("pointerleave", release, {passive:true});
  });
}
