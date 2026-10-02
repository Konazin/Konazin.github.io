const copy = {
  "pt-BR": {
    navLabel: "Navegação principal", navAbout: "Sobre", navProjects: "Projetos", navFocus: "Foco", navContact: "Contato", languageLabel: "Mudar idioma para inglês",
    heroEyebrow: "SOFTWARE · IA APLICADA", heroLineOne: "Software.", heroLineTwo: "IA em uso.", heroDescription: "Construo software que aproxima modelos de IA de fluxos de trabalho reais, com atenção a contexto, controle e comportamento previsível.", heroProjects: "Ver projetos", heroLinkedin: "LinkedIn", heroFootnote: "Ferramentas para desenvolvimento, modelos locais e sistemas confiáveis.",
    sceneLabel: "Camadas de um fluxo com assistente de programação", sceneLocal: "MODELO LOCAL", sceneSystems: "CONTEXTO DE PROJETO", sceneCurrent: "ASSISTENTE DE CÓDIGO", sceneProjectType: "FLUXO LOCAL", sceneConfig: "Projeto", sceneNorm: "Sessão", sceneNext: "Provedor", sceneStatus: "CONTEXTO · MODELO · FERRAMENTAS", sceneNote: "da intenção ao código",
    areasLabel: "Áreas de trabalho", areaSoftware: "FERRAMENTAS DE DESENVOLVIMENTO", areaAi: "MODELOS LOCAIS E IA", areaSystems: "SISTEMAS LINUX",
    aboutLabel: "Perfil", aboutHeading: "Gosto de entender o que existe por baixo da interface.", aboutParagraphOne: "Sou Kona, desenvolvedor de software e estudante de tecnologia. Trabalho em aplicações e ferramentas com atenção à arquitetura, aos fluxos reais e ao que acontece quando algo falha.", aboutParagraphTwo: "Meu trabalho passa por assistentes de programação com modelos locais, sistemas Linux e aplicações que precisam continuar úteis mesmo sem conexão.", aboutGithub: "Explore meu trabalho no GitHub",
    projectsLabel: "Projetos selecionados", projectsHeading: "Trabalho com forma e função.", projectsIntro: "Projetos escolhidos pelo que demonstram, com links para o código público quando disponível.",
    zeroCodingKind: "ASSISTENTE DE CÓDIGO · OPEN SOURCE", zeroCodingDescription: "Assistente de programação no terminal que conecta Ollama e provedores compatíveis a sessões, contexto de projeto e skills escolhidas pela pessoa.",
    fenrirKind: "SISTEMAS · LINUX", fenrirDescription: "Daemon para Linux que observa pressão de memória e coordena sessões com políticas graduais, modo de simulação inicial e recuperação reversível.",
    trainingKind: "APP · OFFLINE-FIRST", trainingDescription: "Aplicativo mobile de treino com dados locais, sessões recuperáveis e exportação e restauração de backups.",
    caseKind: "CASO ANÔNIMO", caseTitle: "Fluxo de conteúdo com IA", caseDescription: "Automação que transforma um briefing em conteúdo e peças visuais para revisão. O exemplo não inclui nomes, marcas, imagens ou dados identificáveis.", caseTagOne: "IA generativa", caseTagTwo: "Automação", casePrivacy: "MATERIAIS OMITIDOS", viewRepository: "Ver repositório",
    focusLabel: "Áreas de interesse", focusHeading: "Software útil depende de bons fundamentos.", focusOneTitle: "Ferramentas para quem programa", focusOneDescription: "Interfaces de terminal, contexto explícito e integrações com modelos locais.", focusTwoTitle: "Sistemas Linux", focusTwoDescription: "Observabilidade, políticas seguras e recuperação previsível.", focusThreeTitle: "Aplicações locais", focusThreeDescription: "Persistência clara e fluxos que seguem úteis sem depender de conexão.",
    contactLabel: "Contato", contactHeading: "Vamos construir algo útil.", contactDescription: "Se você trabalha com software, IA ou sistemas e quer trocar ideias, me encontre por aqui:", footerNote: "Feito para a web aberta."
  },
  en: {
    navLabel: "Main navigation", navAbout: "About", navProjects: "Projects", navFocus: "Focus", navContact: "Contact", languageLabel: "Mudar idioma para português",
    heroEyebrow: "SOFTWARE · APPLIED AI", heroLineOne: "Software.", heroLineTwo: "AI at work.", heroDescription: "I build software that brings AI models into real workflows, with attention to context, control, and predictable behavior.", heroProjects: "View projects", heroLinkedin: "LinkedIn", heroFootnote: "Developer tools, local models, and dependable systems.",
    sceneLabel: "Layers of a coding assistant workflow", sceneLocal: "LOCAL MODEL", sceneSystems: "PROJECT CONTEXT", sceneCurrent: "CODING ASSISTANT", sceneProjectType: "LOCAL WORKFLOW", sceneConfig: "Project", sceneNorm: "Session", sceneNext: "Provider", sceneStatus: "CONTEXT · MODEL · TOOLS", sceneNote: "from intent to code",
    areasLabel: "Areas of work", areaSoftware: "DEVELOPER TOOLS", areaAi: "LOCAL MODELS AND AI", areaSystems: "LINUX SYSTEMS",
    aboutLabel: "Profile", aboutHeading: "I like understanding what sits beneath the interface.", aboutParagraphOne: "I’m Kona, a software developer and technology student. I build applications and tools with attention to architecture, real user flows, and what happens when something fails.", aboutParagraphTwo: "My work spans coding assistants with local models, Linux systems, and applications that need to stay useful without a network connection.", aboutGithub: "Explore my work on GitHub",
    projectsLabel: "Selected projects", projectsHeading: "Work with form and function.", projectsIntro: "Projects selected for what they demonstrate, with links to public source code where available.",
    zeroCodingKind: "CODING ASSISTANT · OPEN SOURCE", zeroCodingDescription: "A terminal coding assistant that connects Ollama and compatible providers with sessions, project context, and user-selected skills.",
    fenrirKind: "SYSTEMS · LINUX", fenrirDescription: "A Linux daemon that observes memory pressure and coordinates sessions with gradual policies, simulation by default, and reversible recovery.",
    trainingKind: "APP · OFFLINE-FIRST", trainingDescription: "A mobile training app with local data, recoverable sessions, and backup export and restore.",
    caseKind: "ANONYMIZED CASE", caseTitle: "AI content workflow", caseDescription: "An automation that turns a brief into content and visual assets for review. The example includes no names, brands, images, or identifying data.", caseTagOne: "Generative AI", caseTagTwo: "Automation", casePrivacy: "MATERIALS OMITTED", viewRepository: "View repository",
    focusLabel: "Areas of interest", focusHeading: "Useful software depends on solid foundations.", focusOneTitle: "Tools for developers", focusOneDescription: "Terminal interfaces, explicit context, and integrations with local models.", focusTwoTitle: "Linux systems", focusTwoDescription: "Observability, safe policies, and predictable recovery.", focusThreeTitle: "Local applications", focusThreeDescription: "Clear persistence and workflows that remain useful without a connection.",
    contactLabel: "Contact", contactHeading: "Let’s build something useful.", contactDescription: "If you work with software, AI, or systems and want to connect, find me here:", footerNote: "Made for the open web."
  }
};

const root = document.documentElement;
const languageButton = document.querySelector(".language-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

function setLanguage(language) {
  const translations = copy[language];
  root.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = translations[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  });
  document.title = language === "en" ? "Miguel Sousa (Kona) — Software & AI" : "Miguel Sousa (Kona) — Software & IA";
  document.querySelector('meta[name="description"]').content = language === "en"
    ? "Miguel Sousa (Kona) — software development, AI tooling, and dependable systems."
    : "Miguel Sousa (Kona) — desenvolvimento de software, ferramentas de IA e sistemas confiáveis.";
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = language === "en"
    ? "Developer tools, local models, and systems built for real workflows."
    : "Ferramentas de desenvolvimento, modelos locais e sistemas para fluxos reais.";
  languageButton.textContent = language === "en" ? "PT" : "EN";
  languageButton.setAttribute("aria-pressed", String(language === "en"));
}

setLanguage(root.lang);
languageButton.addEventListener("click", () => setLanguage(root.lang === "pt-BR" ? "en" : "pt-BR"));

if (!reducedMotion.matches) {
  const layers = [...document.querySelectorAll("[data-parallax]")];
  let frame = 0;
  const updateParallax = () => {
    const viewport = window.innerHeight;
    layers.forEach((layer) => {
      const bounds = layer.getBoundingClientRect();
      const factor = Number(layer.dataset.parallax);
      const offset = (bounds.top + bounds.height / 2 - viewport / 2) * factor;
      layer.style.setProperty("--parallax-y", `${Math.max(-22, Math.min(22, offset))}px`);
    });
    frame = 0;
  };
  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(updateParallax);
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (!frame) frame = window.requestAnimationFrame(updateParallax);
  }, { passive: true });
  updateParallax();

  if (finePointer.matches) {
    document.querySelectorAll("[data-tilt]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty("--rx", `${-y * 2.2}deg`);
        element.style.setProperty("--ry", `${x * 3.2}deg`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.removeProperty("--rx");
        element.style.removeProperty("--ry");
      });
    });
  }
}
