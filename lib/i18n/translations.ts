// ────────────────────────────────────────────────
// Translation dictionaries for TheNode.tech
// 9 supported languages
// ────────────────────────────────────────────────

import type { Locale } from "./locales";

export type { Locale };

export const SUPPORTED_LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

export interface TranslationDict {
  // Navigation
  nav: {
    premium: string;
    settings: string;
    home: string;
    pricing: string;
    signIn: string;
    signOut: string;
  };
  // Auth
  auth: {
    signInTitle: string;
    signInDescription: string;
    emailPlaceholder: string;
    sendMagicLink: string;
    sending: string;
    checkEmail: string;
    checkEmailDescription: string;
    signOutConfirm: string;
  };
  // Onboarding
  onboarding: {
    title: string;
    subtitle: string;
    selectAll: string;
    deselectAll: string;
    continue: string;
    selectAtLeastOne: string;
  };
  // Common
  common: {
    loading: string;
    backToHome: string;
    backToCategories: string;
    allRightsReserved: string;
    somethingWentWrong: string;
    tryAgain: string;
    today: string;
    yesterday: string;
  };
  // Home page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    subscribe: string;
    subscribePlaceholder: string;
    subscribeSuccess: string;
    freeNote: string;
    learnMore: string;
    noNewsletters: string;
    viewFullEdition: string;
  };
  // Categories
  categories: {
    ai: string;
    aiShort: string;
    eng: string;
    engShort: string;
    sec: string;
    secShort: string;
    biz: string;
    bizShort: string;
    tech: string;
    techShort: string;
    cloudDevops: string;
    cloudDevopsShort: string;
    web3Crypto: string;
    web3CryptoShort: string;
    designUxFrontend: string;
    designUxFrontendShort: string;
    emergingTechScience: string;
    emergingTechScienceShort: string;
    opensourceLanguages: string;
    opensourceLanguagesShort: string;
    aiDesc: string;
    engDesc: string;
    secDesc: string;
    bizDesc: string;
    techDesc: string;
    cloudDevopsDesc: string;
    web3CryptoDesc: string;
    designUxFrontendDesc: string;
    emergingTechScienceDesc: string;
    opensourceLanguagesDesc: string;
  };
  // Pricing page
  pricing: {
    title: string;
    subtitle: string;
    free: string;
    freePriceLabel: string;
    freeDescription: string;
    freeFeatures: string[];
    getStartedFree: string;
    premium: string;
    premiumPriceLabel: string;
    premiumDescription: string;
    premiumFeatures: string[];
    recommended: string;
    subscribeWithPolar: string;
    signInToSubscribe: string;
    perMonth: string;
    faqTitle: string;
    faqLanguagesQ: string;
    faqLanguagesA: string;
    faqScheduleQ: string;
    faqScheduleA: string;
    faqSourcesQ: string;
    faqSourcesA: string;
    faqCancelQ: string;
    faqCancelA: string;
  };
  // Settings page
  settings: {
    title: string;
    subtitle: string;
    emailLookupLabel: string;
    emailPlaceholder: string;
    lookUp: string;
    noAccountFound: string;
    subscribeFirst: string;
    account: string;
    premiumBadge: string;
    freeBadge: string;
    upgradeToPremium: string;
    language: string;
    languageDescPremium: string;
    languageDescFree: string;
    deliveryTime: string;
    deliveryTimeDescPremium: string;
    deliveryTimeDescFree: string;
    timezone: string;
    timezoneDesc: string;
    timezonePlaceholder: string;
    categoriesTitle: string;
    categoriesDesc: string;
    saving: string;
    saved: string;
    savePreferences: string;
  };
  // Newsletter detail page
  newsletter: {
    notFound: string;
    readOriginal: string;
    languageNames: Record<string, string>;
  };
}

// ────── English (base) ──────
const en: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Settings",
    home: "Home",
    pricing: "Pricing",
    signIn: "Sign in",
    signOut: "Sign out",
  },
  auth: {
    signInTitle: "Sign in to TheNode.tech",
    signInDescription: "Enter your email and we'll send you a magic link to sign in.",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "Send magic link",
    sending: "Sending...",
    checkEmail: "Check your email!",
    checkEmailDescription: "We sent a magic link to your email. Click it to sign in.",
    signOutConfirm: "Are you sure you want to sign out?",
  },
  onboarding: {
    title: "Choose your categories",
    subtitle: "Pick the topics you want in your daily newsletter. You can change this anytime in settings.",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    continue: "Continue",
    selectAtLeastOne: "Please select at least one category.",
  },
  common: {
    loading: "Loading...",
    backToHome: "← Back to home",
    backToCategories: "← Back to all categories",
    allRightsReserved: "All rights reserved.",
    somethingWentWrong: "Something went wrong. Please try again.",
    tryAgain: "Try again",
    today: "Today",
    yesterday: "Yesterday",
  },
  home: {
    heroTitle: "Tech news, summarized by AI.",
    heroSubtitle: "Delivered daily.",
    heroDescription:
      "275+ sources. 10 categories. AI-curated summaries. Get the most impactful stories from the tech world in 5 minutes.",
    subscribe: "Subscribe",
    subscribePlaceholder: "you@example.com",
    subscribeSuccess: "You're in! Check your email to verify your subscription.",
    freeNote: "Free daily newsletter. Premium users get it in their language.",
    learnMore: "Learn more",
    noNewsletters: "No newsletters yet. Stay tuned!",
    viewFullEdition: "View full edition →",
  },
  categories: {
    ai: "AI & Machine Learning",
    aiShort: "AI",
    eng: "Software Engineering & Web Dev",
    engShort: "Engineering",
    sec: "Cybersecurity & InfoSec",
    secShort: "Security",
    biz: "Startups & Venture Capital",
    bizShort: "Business",
    tech: "Big Tech & General Innovation",
    techShort: "Tech",
    cloudDevops: "Cloud Computing & DevOps",
    cloudDevopsShort: "Cloud & DevOps",
    web3Crypto: "Web3 & Cryptocurrency",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Design, UX & Frontend",
    designUxFrontendShort: "Design/UX",
    emergingTechScience: "Emerging Tech & Science",
    emergingTechScienceShort: "Emerging Tech",
    opensourceLanguages: "Open Source & Programming Languages",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Stay ahead of the curve with daily updates on large language models, research papers, and corporate AI lab announcements. From OpenAI to DeepMind, we cover the breakthroughs shaping the future.",
    engDesc: "Your daily dose of frameworks, DevOps practices, and tutorials from the best engineering blogs. Covers everything from frontend to backend, system design, and developer productivity.",
    secDesc: "Never miss a critical vulnerability. Get daily coverage of data breaches, CVEs, privacy developments, and threat intelligence from the top cybersecurity sources.",
    bizDesc: "Track the latest funding rounds, mergers & acquisitions, and market trends in the startup ecosystem. Insights from VCs, founders, and industry analysts.",
    techDesc: "The big picture of technology: hardware launches, policy changes, gadget reviews, and innovation stories from the world's leading tech publications.",
    cloudDevopsDesc: "Everything about cloud platforms, infrastructure-as-code, CI/CD pipelines, and DevOps best practices. From AWS to Kubernetes and beyond.",
    web3CryptoDesc: "Daily updates on blockchain technology, DeFi protocols, NFT ecosystems, and cryptocurrency market movements. From Ethereum to Solana and the broader Web3 landscape.",
    designUxFrontendDesc: "Curated insights on UI/UX design, frontend trends, design systems, and creative tools. From Figma to CSS, covering what designers and frontend developers need to know.",
    emergingTechScienceDesc: "Explore the frontier of quantum computing, biotech, space technology, and scientific breakthroughs. Discover the innovations that will define the next decade.",
    opensourceLanguagesDesc: "Keep up with open source project releases, programming language updates, and developer tools. From Rust to TypeScript, covering the ecosystem that powers modern software.",
  },
  pricing: {
    title: "Simple pricing",
    subtitle: "Free for everyone. Premium for power users.",
    free: "Free",
    freePriceLabel: "$0",
    freeDescription: "Perfect for staying informed.",
    freeFeatures: [
      "Daily newsletter in English",
      "All 10 tech categories",
      "AI-curated top stories",
      "5-7 articles per category",
      "Mobile-friendly emails",
    ],
    getStartedFree: "Get started free",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "For the serious tech enthusiast.",
    premiumFeatures: [
      "Everything in Free, plus:",
      "Newsletter in your language (9 languages)",
      "Priority delivery",
      "Category customization",
      "Weekly Digest — AI-powered week-in-review",
      "Early access to new features",
    ],
    recommended: "Recommended",
    subscribeWithPolar: "Subscribe with Polar",
    signInToSubscribe: "Sign in to subscribe",
    perMonth: "/month",
    faqTitle: "Frequently asked questions",
    faqLanguagesQ: "What languages are supported?",
    faqLanguagesA:
      "We support English, Spanish, French, German, Japanese, Chinese, Portuguese, Italian, and Korean. More coming soon.",
    faqScheduleQ: "When is the newsletter sent?",
    faqScheduleA:
      "Every day at 8 AM in your timezone. Premium users can choose their preferred delivery hour in settings.",
    faqSourcesQ: "What sources do you use?",
    faqSourcesA:
      "We aggregate 275+ RSS feeds from top tech publications, research labs, engineering blogs, and industry leaders across 10 categories.",
    faqCancelQ: "Can I cancel anytime?",
    faqCancelA:
      "Yes! You can cancel your Premium subscription at any time. Your subscription is managed through Polar.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your newsletter preferences.",
    emailLookupLabel: "Enter your email to manage preferences",
    emailPlaceholder: "you@example.com",
    lookUp: "Look up",
    noAccountFound: "No account found with this email.",
    subscribeFirst: "Subscribe first",
    account: "Account",
    premiumBadge: "Premium",
    freeBadge: "Free",
    upgradeToPremium: "Upgrade to Premium",
    language: "Language",
    languageDescPremium: "Choose the language for your newsletter.",
    languageDescFree:
      "Upgrade to Premium to receive newsletters in your language.",
    deliveryTime: "Delivery time",
    deliveryTimeDescPremium:
      "Standard delivery is 8 AM. As a premium user you can choose the hour you receive the newsletter.",
    deliveryTimeDescFree:
      "Upgrade to Premium to choose your preferred delivery hour.",
    timezone: "Timezone",
    timezoneDesc: "We'll send your newsletter at 8 AM in your timezone.",
    timezonePlaceholder: "e.g., America/New_York",
    categoriesTitle: "Categories",
    categoriesDesc: "Choose which categories to include in your newsletter.",
    saving: "Saving...",
    saved: "Saved!",
    savePreferences: "Save preferences",
  },
  newsletter: {
    notFound: "Newsletter not found",
    readOriginal: "Read original →",
    languageNames: {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      ja: "Japanese",
      zh: "Chinese",
      pt: "Portuguese",
      it: "Italian",
      ko: "Korean",
    },
  },
};

// ────── Spanish ──────
const es: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Ajustes",
    home: "Inicio",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
  },
  auth: {
    signInTitle: "Iniciar sesión en TheNode.tech",
    signInDescription: "Introduce tu email y te enviaremos un enlace mágico para iniciar sesión.",
    emailPlaceholder: "tu@email.com",
    sendMagicLink: "Enviar enlace mágico",
    sending: "Enviando...",
    checkEmail: "¡Revisa tu email!",
    checkEmailDescription: "Te enviamos un enlace mágico. Haz clic para iniciar sesión.",
    signOutConfirm: "¿Estás seguro de que quieres cerrar sesión?",
  },
  onboarding: {
    title: "Elige tus categorías",
    subtitle: "Selecciona los temas que quieres recibir en tu newsletter diaria. Puedes cambiarlos en cualquier momento en los ajustes.",
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    continue: "Continuar",
    selectAtLeastOne: "Por favor, selecciona al menos una categoría.",
  },
  common: {
    loading: "Cargando...",
    backToHome: "← Volver al inicio",
    backToCategories: "← Volver a categorías",
    allRightsReserved: "Todos los derechos reservados.",
    somethingWentWrong: "Algo salió mal. Inténtalo de nuevo.",
    tryAgain: "Reintentar",
    today: "Hoy",
    yesterday: "Ayer",
  },
  home: {
    heroTitle: "Noticias tech, resumidas por IA.",
    heroSubtitle: "Entregadas a diario.",
    heroDescription:
      "275+ fuentes. 10 categorías. Resúmenes curados por IA. Las noticias tech más importantes en 5 minutos.",
    subscribe: "Suscribirse",
    subscribePlaceholder: "tu@email.com",
    subscribeSuccess:
      "¡Estás dentro! Revisa tu email para verificar tu suscripción.",
    freeNote:
      "Newsletter diaria gratuita. Los usuarios Premium la reciben en su idioma.",
    learnMore: "Más información",
    noNewsletters: "Aún no hay newsletters. ¡Mantente atento!",
    viewFullEdition: "Ver edición completa →",
  },
  categories: {
    ai: "IA y Aprendizaje Automático",
    aiShort: "IA",
    eng: "Ingeniería de Software y Web",
    engShort: "Ingeniería",
    sec: "Ciberseguridad",
    secShort: "Seguridad",
    biz: "Startups y Capital de Riesgo",
    bizShort: "Negocios",
    tech: "Big Tech e Innovación",
    techShort: "Tech",
    cloudDevops: "Cloud Computing y DevOps",
    cloudDevopsShort: "Cloud y DevOps",
    web3Crypto: "Web3 y Criptomonedas",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Diseño, UX y Frontend",
    designUxFrontendShort: "Diseño/UX",
    emergingTechScience: "Tecnología Emergente y Ciencia",
    emergingTechScienceShort: "Tech Emergente",
    opensourceLanguages: "Open Source y Lenguajes de Programación",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Mantente a la vanguardia con actualizaciones diarias sobre modelos de lenguaje, artículos de investigación y anuncios de laboratorios de IA. Desde OpenAI hasta DeepMind, cubrimos los avances que están dando forma al futuro.",
    engDesc: "Tu dosis diaria de frameworks, prácticas DevOps y tutoriales de los mejores blogs de ingeniería. Cubre todo, desde frontend hasta backend, diseño de sistemas y productividad del desarrollador.",
    secDesc: "No te pierdas ninguna vulnerabilidad crítica. Cobertura diaria de brechas de datos, CVEs, desarrollos en privacidad e inteligencia de amenazas de las principales fuentes de ciberseguridad.",
    bizDesc: "Sigue las últimas rondas de financiación, fusiones y adquisiciones, y tendencias del mercado en el ecosistema startup. Perspectivas de VCs, fundadores y analistas de la industria.",
    techDesc: "La visión general de la tecnología: lanzamientos de hardware, cambios de política, reseñas de gadgets e historias de innovación de las principales publicaciones tecnológicas del mundo.",
    cloudDevopsDesc: "Todo sobre plataformas en la nube, infraestructura como código, pipelines CI/CD y mejores prácticas DevOps. Desde AWS hasta Kubernetes y más allá.",
    web3CryptoDesc: "Actualizaciones diarias sobre tecnología blockchain, protocolos DeFi, ecosistemas NFT y movimientos del mercado de criptomonedas. Desde Ethereum hasta Solana y el ecosistema Web3.",
    designUxFrontendDesc: "Insights curados sobre diseño UI/UX, tendencias frontend, sistemas de diseño y herramientas creativas. Desde Figma hasta CSS, cubriendo lo que diseñadores y desarrolladores frontend necesitan saber.",
    emergingTechScienceDesc: "Explora la frontera de la computación cuántica, biotecnología, tecnología espacial y avances científicos. Descubre las innovaciones que definirán la próxima década.",
    opensourceLanguagesDesc: "Mantente al día con lanzamientos de proyectos open source, actualizaciones de lenguajes de programación y herramientas para desarrolladores. Desde Rust hasta TypeScript, cubriendo el ecosistema que impulsa el software moderno.",
  },
  pricing: {
    title: "Precios simples",
    subtitle: "Gratis para todos. Premium para usuarios avanzados.",
    free: "Gratis",
    freePriceLabel: "$0",
    freeDescription: "Perfecto para mantenerte informado.",
    freeFeatures: [
      "Newsletter diaria en inglés",
      "Las 10 categorías tech",
      "Artículos curados por IA",
      "5-7 artículos por categoría",
      "Emails optimizados para móvil",
    ],
    getStartedFree: "Empezar gratis",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "Para el entusiasta tech exigente.",
    premiumFeatures: [
      "Todo lo del plan Gratis, más:",
      "Newsletter en tu idioma (9 idiomas)",
      "Entrega prioritaria",
      "Personalización de categorías",
      "Resumen semanal — resumen de la semana con IA",
      "Acceso anticipado a nuevas funciones",
    ],
    recommended: "Recomendado",
    subscribeWithPolar: "Suscribirse con Polar",
    signInToSubscribe: "Inicia sesión para suscribirte",
    perMonth: "/mes",
    faqTitle: "Preguntas frecuentes",
    faqLanguagesQ: "¿Qué idiomas están disponibles?",
    faqLanguagesA:
      "Soportamos inglés, español, francés, alemán, japonés, chino, portugués, italiano y coreano. Próximamente más idiomas.",
    faqScheduleQ: "¿Cuándo se envía la newsletter?",
    faqScheduleA:
      "Todos los días a las 8 AM en tu zona horaria. Los usuarios Premium pueden elegir su hora preferida en los ajustes.",
    faqSourcesQ: "¿Qué fuentes utilizan?",
    faqSourcesA:
      "Agregamos más de 275 feeds RSS de las mejores publicaciones tech, laboratorios de investigación, blogs de ingeniería y líderes del sector en 10 categorías.",
    faqCancelQ: "¿Puedo cancelar en cualquier momento?",
    faqCancelA:
      "¡Sí! Puedes cancelar tu suscripción Premium en cualquier momento. Tu suscripción se gestiona a través de Polar.",
  },
  settings: {
    title: "Ajustes",
    subtitle: "Gestiona tus preferencias de newsletter.",
    emailLookupLabel: "Introduce tu email para gestionar preferencias",
    emailPlaceholder: "tu@email.com",
    lookUp: "Buscar",
    noAccountFound: "No se encontró ninguna cuenta con este email.",
    subscribeFirst: "Suscríbete primero",
    account: "Cuenta",
    premiumBadge: "Premium",
    freeBadge: "Gratis",
    upgradeToPremium: "Actualizar a Premium",
    language: "Idioma",
    languageDescPremium: "Elige el idioma para tu newsletter.",
    languageDescFree:
      "Actualiza a Premium para recibir newsletters en tu idioma.",
    deliveryTime: "Hora de entrega",
    deliveryTimeDescPremium:
      "La entrega estándar es a las 8 AM. Como usuario Premium puedes elegir la hora de recepción.",
    deliveryTimeDescFree:
      "Actualiza a Premium para elegir tu hora de entrega preferida.",
    timezone: "Zona horaria",
    timezoneDesc:
      "Enviaremos tu newsletter a las 8 AM en tu zona horaria.",
    timezonePlaceholder: "ej., America/New_York",
    categoriesTitle: "Categorías",
    categoriesDesc: "Elige qué categorías incluir en tu newsletter.",
    saving: "Guardando...",
    saved: "¡Guardado!",
    savePreferences: "Guardar preferencias",
  },
  newsletter: {
    notFound: "Newsletter no encontrada",
    readOriginal: "Leer original →",
    languageNames: {
      en: "Inglés",
      es: "Español",
      fr: "Francés",
      de: "Alemán",
      ja: "Japonés",
      zh: "Chino",
      pt: "Portugués",
      it: "Italiano",
      ko: "Coreano",
    },
  },
};

// ────── French ──────
const fr: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Paramètres",
    home: "Accueil",
    pricing: "Tarifs",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
  },
  auth: {
    signInTitle: "Connectez-vous à TheNode.tech",
    signInDescription: "Entrez votre email et nous vous enverrons un lien magique pour vous connecter.",
    emailPlaceholder: "vous@email.com",
    sendMagicLink: "Envoyer le lien magique",
    sending: "Envoi...",
    checkEmail: "Vérifiez votre email !",
    checkEmailDescription: "Nous avons envoyé un lien magique à votre email. Cliquez dessus pour vous connecter.",
    signOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
  },
  onboarding: {
    title: "Choisissez vos catégories",
    subtitle: "Sélectionnez les sujets que vous souhaitez recevoir dans votre newsletter quotidienne. Vous pourrez les modifier à tout moment dans les paramètres.",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    continue: "Continuer",
    selectAtLeastOne: "Veuillez sélectionner au moins une catégorie.",
  },
  common: {
    loading: "Chargement...",
    backToHome: "← Retour à l'accueil",
    backToCategories: "← Retour aux catégories",
    allRightsReserved: "Tous droits réservés.",
    somethingWentWrong: "Une erreur est survenue. Veuillez réessayer.",
    tryAgain: "Réessayer",
    today: "Aujourd'hui",
    yesterday: "Hier",
  },
  home: {
    heroTitle: "L'actu tech, résumée par l'IA.",
    heroSubtitle: "Livrée chaque jour.",
    heroDescription:
      "275+ sources. 10 catégories. Résumés IA. Les articles tech les plus importants en 5 minutes.",
    subscribe: "S'abonner",
    subscribePlaceholder: "vous@email.com",
    subscribeSuccess:
      "C'est fait ! Vérifiez votre email pour confirmer votre abonnement.",
    freeNote:
      "Newsletter quotidienne gratuite. Les abonnés Premium la reçoivent dans leur langue.",
    learnMore: "En savoir plus",
    noNewsletters: "Pas encore de newsletters. Restez à l'écoute !",
    viewFullEdition: "Voir l'édition complète →",
  },
  categories: {
    ai: "IA et Machine Learning",
    aiShort: "IA",
    eng: "Génie Logiciel et Web",
    engShort: "Ingénierie",
    sec: "Cybersécurité",
    secShort: "Sécurité",
    biz: "Startups et Capital-Risque",
    bizShort: "Business",
    tech: "Big Tech et Innovation",
    techShort: "Tech",
    cloudDevops: "Cloud Computing et DevOps",
    cloudDevopsShort: "Cloud & DevOps",
    web3Crypto: "Web3 et Cryptomonnaies",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Design, UX et Frontend",
    designUxFrontendShort: "Design/UX",
    emergingTechScience: "Technologies Émergentes et Science",
    emergingTechScienceShort: "Tech Émergente",
    opensourceLanguages: "Open Source et Langages de Programmation",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Restez à la pointe avec des mises à jour quotidiennes sur les grands modèles de langage, les articles de recherche et les annonces des laboratoires d'IA. De OpenAI à DeepMind, nous couvrons les percées qui façonnent l'avenir.",
    engDesc: "Votre dose quotidienne de frameworks, pratiques DevOps et tutoriels des meilleurs blogs d'ingénierie. Couvre tout, du frontend au backend, en passant par la conception de systèmes et la productivité des développeurs.",
    secDesc: "Ne manquez jamais une vulnérabilité critique. Couverture quotidienne des violations de données, CVEs, développements en matière de confidentialité et renseignements sur les menaces des meilleures sources de cybersécurité.",
    bizDesc: "Suivez les dernières levées de fonds, fusions-acquisitions et tendances du marché dans l'écosystème startup. Analyses de VCs, fondateurs et analystes du secteur.",
    techDesc: "La vision globale de la technologie : lancements matériels, évolutions réglementaires, tests de gadgets et histoires d'innovation des principales publications tech mondiales.",
    cloudDevopsDesc: "Tout sur les plateformes cloud, l'infrastructure en tant que code, les pipelines CI/CD et les meilleures pratiques DevOps. D'AWS à Kubernetes et au-delà.",
    web3CryptoDesc: "Mises à jour quotidiennes sur la technologie blockchain, les protocoles DeFi, les écosystèmes NFT et les mouvements du marché des cryptomonnaies. D'Ethereum à Solana et le paysage Web3.",
    designUxFrontendDesc: "Insights sélectionnés sur le design UI/UX, les tendances frontend, les systèmes de design et les outils créatifs. De Figma au CSS, couvrant ce que les designers et développeurs frontend doivent savoir.",
    emergingTechScienceDesc: "Explorez les frontières de l'informatique quantique, des biotechnologies, de la technologie spatiale et des percées scientifiques. Découvrez les innovations qui définiront la prochaine décennie.",
    opensourceLanguagesDesc: "Suivez les sorties de projets open source, les mises à jour de langages de programmation et les outils pour développeurs. De Rust à TypeScript, couvrant l'écosystème qui propulse le logiciel moderne.",
  },
  pricing: {
    title: "Tarifs simples",
    subtitle: "Gratuit pour tous. Premium pour les passionnés.",
    free: "Gratuit",
    freePriceLabel: "0 €",
    freeDescription: "Parfait pour rester informé.",
    freeFeatures: [
      "Newsletter quotidienne en anglais",
      "Les 10 catégories tech",
      "Articles sélectionnés par IA",
      "5 à 7 articles par catégorie",
      "Emails optimisés mobile",
    ],
    getStartedFree: "Commencer gratuitement",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "Pour les passionnés de tech exigeants.",
    premiumFeatures: [
      "Tout le plan Gratuit, plus :",
      "Newsletter dans votre langue (9 langues)",
      "Livraison prioritaire",
      "Personnalisation des catégories",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
    recommended: "Recommandé",
    subscribeWithPolar: "S'abonner avec Polar",
    signInToSubscribe: "Connectez-vous pour vous abonner",
    perMonth: "/mois",
    faqTitle: "Questions fréquentes",
    faqLanguagesQ: "Quelles langues sont supportées ?",
    faqLanguagesA:
      "Nous supportons l'anglais, l'espagnol, le français, l'allemand, le japonais, le chinois, le portugais, l'italien et le coréen. D'autres langues arrivent bientôt.",
    faqScheduleQ: "Quand la newsletter est-elle envoyée ?",
    faqScheduleA:
      "Chaque jour à 8h dans votre fuseau horaire. Les abonnés Premium peuvent choisir leur heure préférée dans les paramètres.",
    faqSourcesQ: "Quelles sources utilisez-vous ?",
    faqSourcesA:
      "Nous agrégeons plus de 275 flux RSS des meilleures publications tech, laboratoires de recherche, blogs d'ingénierie et leaders du secteur dans 10 catégories.",
    faqCancelQ: "Puis-je annuler à tout moment ?",
    faqCancelA:
      "Oui ! Vous pouvez annuler votre abonnement Premium à tout moment. Votre abonnement est géré via Polar.",
  },
  settings: {
    title: "Paramètres",
    subtitle: "Gérez vos préférences de newsletter.",
    emailLookupLabel: "Entrez votre email pour gérer vos préférences",
    emailPlaceholder: "vous@email.com",
    lookUp: "Rechercher",
    noAccountFound: "Aucun compte trouvé avec cet email.",
    subscribeFirst: "Abonnez-vous d'abord",
    account: "Compte",
    premiumBadge: "Premium",
    freeBadge: "Gratuit",
    upgradeToPremium: "Passer à Premium",
    language: "Langue",
    languageDescPremium: "Choisissez la langue de votre newsletter.",
    languageDescFree:
      "Passez à Premium pour recevoir les newsletters dans votre langue.",
    deliveryTime: "Heure de livraison",
    deliveryTimeDescPremium:
      "La livraison standard est à 8h. En tant qu'abonné Premium, vous pouvez choisir l'heure de réception.",
    deliveryTimeDescFree:
      "Passez à Premium pour choisir votre heure de livraison préférée.",
    timezone: "Fuseau horaire",
    timezoneDesc:
      "Nous enverrons votre newsletter à 8h dans votre fuseau horaire.",
    timezonePlaceholder: "ex., Europe/Paris",
    categoriesTitle: "Catégories",
    categoriesDesc:
      "Choisissez les catégories à inclure dans votre newsletter.",
    saving: "Enregistrement...",
    saved: "Enregistré !",
    savePreferences: "Enregistrer les préférences",
  },
  newsletter: {
    notFound: "Newsletter introuvable",
    readOriginal: "Lire l'original →",
    languageNames: {
      en: "Anglais",
      es: "Espagnol",
      fr: "Français",
      de: "Allemand",
      ja: "Japonais",
      zh: "Chinois",
      pt: "Portugais",
      it: "Italien",
      ko: "Coréen",
    },
  },
};

// ────── German ──────
const de: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Einstellungen",
    home: "Startseite",
    pricing: "Preise",
    signIn: "Anmelden",
    signOut: "Abmelden",
  },
  auth: {
    signInTitle: "Bei TheNode.tech anmelden",
    signInDescription: "Gib deine E-Mail ein und wir senden dir einen magischen Link zum Anmelden.",
    emailPlaceholder: "du@email.com",
    sendMagicLink: "Magischen Link senden",
    sending: "Wird gesendet...",
    checkEmail: "Überprüfe deine E-Mail!",
    checkEmailDescription: "Wir haben dir einen magischen Link gesendet. Klicke darauf, um dich anzumelden.",
    signOutConfirm: "Bist du sicher, dass du dich abmelden möchtest?",
  },
  onboarding: {
    title: "Wähle deine Kategorien",
    subtitle: "Wähle die Themen, die du in deinem täglichen Newsletter erhalten möchtest. Du kannst sie jederzeit in den Einstellungen ändern.",
    selectAll: "Alle auswählen",
    deselectAll: "Alle abwählen",
    continue: "Weiter",
    selectAtLeastOne: "Bitte wähle mindestens eine Kategorie aus.",
  },
  common: {
    loading: "Laden...",
    backToHome: "← Zurück zur Startseite",
    backToCategories: "← Zurück zu allen Kategorien",
    allRightsReserved: "Alle Rechte vorbehalten.",
    somethingWentWrong: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    tryAgain: "Erneut versuchen",
    today: "Heute",
    yesterday: "Gestern",
  },
  home: {
    heroTitle: "Tech-News, zusammengefasst von KI.",
    heroSubtitle: "Täglich geliefert.",
    heroDescription:
      "275+ Quellen. 10 Kategorien. KI-kuratierte Zusammenfassungen. Die wichtigsten Tech-Stories in 5 Minuten.",
    subscribe: "Abonnieren",
    subscribePlaceholder: "du@email.com",
    subscribeSuccess:
      "Du bist dabei! Überprüfe deine E-Mail zur Bestätigung.",
    freeNote:
      "Kostenloser täglicher Newsletter. Premium-Nutzer erhalten ihn in ihrer Sprache.",
    learnMore: "Mehr erfahren",
    noNewsletters: "Noch keine Newsletter. Bleib dran!",
    viewFullEdition: "Vollständige Ausgabe ansehen →",
  },
  categories: {
    ai: "KI & Maschinelles Lernen",
    aiShort: "KI",
    eng: "Software-Engineering & Web-Entwicklung",
    engShort: "Engineering",
    sec: "Cybersicherheit & InfoSec",
    secShort: "Sicherheit",
    biz: "Startups & Risikokapital",
    bizShort: "Business",
    tech: "Big Tech & Innovation",
    techShort: "Tech",
    cloudDevops: "Cloud Computing & DevOps",
    cloudDevopsShort: "Cloud & DevOps",
    web3Crypto: "Web3 & Kryptowährungen",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Design, UX & Frontend",
    designUxFrontendShort: "Design/UX",
    emergingTechScience: "Aufstrebende Technologien & Wissenschaft",
    emergingTechScienceShort: "Neue Tech",
    opensourceLanguages: "Open Source & Programmiersprachen",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Bleiben Sie an der Spitze mit täglichen Updates zu großen Sprachmodellen, Forschungsarbeiten und Ankündigungen von KI-Laboren. Von OpenAI bis DeepMind – wir berichten über die Durchbrüche, die die Zukunft gestalten.",
    engDesc: "Ihre tägliche Dosis an Frameworks, DevOps-Praktiken und Tutorials aus den besten Engineering-Blogs. Alles von Frontend bis Backend, Systemdesign und Entwicklerproduktivität.",
    secDesc: "Verpassen Sie nie eine kritische Schwachstelle. Tägliche Berichterstattung über Datenschutzverletzungen, CVEs, Datenschutzentwicklungen und Bedrohungsintelligenz aus den führenden Cybersicherheitsquellen.",
    bizDesc: "Verfolgen Sie die neuesten Finanzierungsrunden, Fusionen & Übernahmen und Markttrends im Startup-Ökosystem. Einblicke von VCs, Gründern und Branchenanalysten.",
    techDesc: "Das große Bild der Technologie: Hardware-Launches, Politikänderungen, Gadget-Reviews und Innovationsgeschichten aus den weltweit führenden Tech-Publikationen.",
    cloudDevopsDesc: "Alles über Cloud-Plattformen, Infrastructure-as-Code, CI/CD-Pipelines und DevOps-Best-Practices. Von AWS bis Kubernetes und darüber hinaus.",
    web3CryptoDesc: "Tägliche Updates zu Blockchain-Technologie, DeFi-Protokollen, NFT-Ökosystemen und Kryptowährungsbewegungen. Von Ethereum bis Solana und die breitere Web3-Landschaft.",
    designUxFrontendDesc: "Kuratierte Einblicke in UI/UX-Design, Frontend-Trends, Design-Systeme und kreative Tools. Von Figma bis CSS – alles, was Designer und Frontend-Entwickler wissen müssen.",
    emergingTechScienceDesc: "Erkunden Sie die Grenzen von Quantencomputing, Biotechnologie, Raumfahrttechnologie und wissenschaftlichen Durchbrüchen. Entdecken Sie die Innovationen, die das nächste Jahrzehnt prägen werden.",
    opensourceLanguagesDesc: "Bleiben Sie auf dem Laufenden über Open-Source-Projekte, Programmiersprachen-Updates und Entwicklertools. Von Rust bis TypeScript – das Ökosystem, das moderne Software antreibt.",
  },
  pricing: {
    title: "Einfache Preise",
    subtitle: "Kostenlos für alle. Premium für Power-User.",
    free: "Kostenlos",
    freePriceLabel: "0 €",
    freeDescription: "Perfekt, um informiert zu bleiben.",
    freeFeatures: [
      "Täglicher Newsletter auf Englisch",
      "Alle 10 Tech-Kategorien",
      "KI-kuratierte Top-Stories",
      "5-7 Artikel pro Kategorie",
      "Mobilfreundliche E-Mails",
    ],
    getStartedFree: "Kostenlos starten",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "Für den anspruchsvollen Tech-Enthusiasten.",
    premiumFeatures: [
      "Alles aus dem kostenlosen Plan, plus:",
      "Newsletter in deiner Sprache (9 Sprachen)",
      "Prioritätslieferung",
      "Kategorie-Anpassung",
      "Wochenrückblick — KI-gestützter Wochenüberblick",
      "Frühzugang zu neuen Funktionen",
    ],
    recommended: "Empfohlen",
    subscribeWithPolar: "Mit Polar abonnieren",
    signInToSubscribe: "Anmelden zum Abonnieren",
    perMonth: "/Monat",
    faqTitle: "Häufig gestellte Fragen",
    faqLanguagesQ: "Welche Sprachen werden unterstützt?",
    faqLanguagesA:
      "Wir unterstützen Englisch, Spanisch, Französisch, Deutsch, Japanisch, Chinesisch, Portugiesisch, Italienisch und Koreanisch. Weitere folgen bald.",
    faqScheduleQ: "Wann wird der Newsletter versendet?",
    faqScheduleA:
      "Jeden Tag um 8 Uhr in deiner Zeitzone. Premium-Nutzer können ihre bevorzugte Lieferzeit in den Einstellungen wählen.",
    faqSourcesQ: "Welche Quellen verwendet ihr?",
    faqSourcesA:
      "Wir aggregieren über 275 RSS-Feeds von führenden Tech-Publikationen, Forschungslaboren, Engineering-Blogs und Branchenführern in 10 Kategorien.",
    faqCancelQ: "Kann ich jederzeit kündigen?",
    faqCancelA:
      "Ja! Du kannst dein Premium-Abonnement jederzeit kündigen. Dein Abonnement wird über Polar verwaltet.",
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Verwalte deine Newsletter-Einstellungen.",
    emailLookupLabel: "Gib deine E-Mail ein, um Einstellungen zu verwalten",
    emailPlaceholder: "du@email.com",
    lookUp: "Suchen",
    noAccountFound: "Kein Konto mit dieser E-Mail gefunden.",
    subscribeFirst: "Zuerst abonnieren",
    account: "Konto",
    premiumBadge: "Premium",
    freeBadge: "Kostenlos",
    upgradeToPremium: "Auf Premium upgraden",
    language: "Sprache",
    languageDescPremium: "Wähle die Sprache für deinen Newsletter.",
    languageDescFree:
      "Upgrade auf Premium, um Newsletter in deiner Sprache zu erhalten.",
    deliveryTime: "Lieferzeit",
    deliveryTimeDescPremium:
      "Standard-Lieferung ist um 8 Uhr. Als Premium-Nutzer kannst du deine bevorzugte Empfangszeit wählen.",
    deliveryTimeDescFree:
      "Upgrade auf Premium, um deine bevorzugte Lieferzeit zu wählen.",
    timezone: "Zeitzone",
    timezoneDesc:
      "Wir senden deinen Newsletter um 8 Uhr in deiner Zeitzone.",
    timezonePlaceholder: "z.B. Europe/Berlin",
    categoriesTitle: "Kategorien",
    categoriesDesc:
      "Wähle die Kategorien für deinen Newsletter.",
    saving: "Speichern...",
    saved: "Gespeichert!",
    savePreferences: "Einstellungen speichern",
  },
  newsletter: {
    notFound: "Newsletter nicht gefunden",
    readOriginal: "Original lesen →",
    languageNames: {
      en: "Englisch",
      es: "Spanisch",
      fr: "Französisch",
      de: "Deutsch",
      ja: "Japanisch",
      zh: "Chinesisch",
      pt: "Portugiesisch",
      it: "Italienisch",
      ko: "Koreanisch",
    },
  },
};

// ────── Japanese ──────
const ja: TranslationDict = {
  nav: {
    premium: "プレミアム",
    settings: "設定",
    home: "ホーム",
    pricing: "料金",
    signIn: "サインイン",
    signOut: "サインアウト",
  },
  auth: {
    signInTitle: "TheNode.techにサインイン",
    signInDescription: "メールアドレスを入力すると、サインイン用のマジックリンクをお送りします。",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "マジックリンクを送信",
    sending: "送信中...",
    checkEmail: "メールを確認してください！",
    checkEmailDescription: "マジックリンクをメールに送信しました。クリックしてサインインしてください。",
    signOutConfirm: "サインアウトしてもよろしいですか？",
  },
  onboarding: {
    title: "カテゴリを選択",
    subtitle: "日刊ニュースレターで受け取りたいトピックを選んでください。設定でいつでも変更できます。",
    selectAll: "すべて選択",
    deselectAll: "すべて解除",
    continue: "続ける",
    selectAtLeastOne: "少なくとも1つのカテゴリを選択してください。",
  },
  common: {
    loading: "読み込み中...",
    backToHome: "← ホームに戻る",
    backToCategories: "← カテゴリ一覧に戻る",
    allRightsReserved: "All rights reserved.",
    somethingWentWrong: "問題が発生しました。もう一度お試しください。",
    tryAgain: "再試行",
    today: "今日",
    yesterday: "昨日",
  },
  home: {
    heroTitle: "テックニュース、AIがまとめました。",
    heroSubtitle: "毎日お届け。",
    heroDescription:
      "275以上のソース。10カテゴリ。AIキュレーション。テック界の重要ニュースを5分で。",
    subscribe: "登録する",
    subscribePlaceholder: "you@example.com",
    subscribeSuccess: "登録完了！確認メールをご確認ください。",
    freeNote:
      "無料の日刊ニュースレター。プレミアムユーザーはお好きな言語で受け取れます。",
    learnMore: "詳しく見る",
    noNewsletters: "まだニュースレターはありません。お楽しみに！",
    viewFullEdition: "全文を見る →",
  },
  categories: {
    ai: "AI＆機械学習",
    aiShort: "AI",
    eng: "ソフトウェアエンジニアリング＆Web開発",
    engShort: "エンジニアリング",
    sec: "サイバーセキュリティ",
    secShort: "セキュリティ",
    biz: "スタートアップ＆VC",
    bizShort: "ビジネス",
    tech: "ビッグテック＆イノベーション",
    techShort: "テック",
    cloudDevops: "クラウドコンピューティング＆DevOps",
    cloudDevopsShort: "クラウド＆DevOps",
    web3Crypto: "Web3＆暗号通貨",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "デザイン、UX＆フロントエンド",
    designUxFrontendShort: "デザイン/UX",
    emergingTechScience: "新興テクノロジー＆サイエンス",
    emergingTechScienceShort: "新興テック",
    opensourceLanguages: "オープンソース＆プログラミング言語",
    opensourceLanguagesShort: "オープンソース",
    aiDesc: "大規模言語モデル、研究論文、企業AIラボの発表に関する毎日の最新情報で、常に先を行きましょう。OpenAIからDeepMindまで、未来を形作る革新的な進歩をカバーします。",
    engDesc: "最高のエンジニアリングブログからのフレームワーク、DevOpsプラクティス、チュートリアルの毎日の情報。フロントエンドからバックエンド、システム設計、開発者の生産性まですべてをカバー。",
    secDesc: "重大な脆弱性を見逃さないでください。トップのサイバーセキュリティソースからのデータ侵害、CVE、プライバシーの進展、脅威インテリジェンスの毎日のカバレッジ。",
    bizDesc: "スタートアップエコシステムにおける最新の資金調達ラウンド、M&A、市場トレンドを追跡。VC、起業家、業界アナリストからのインサイト。",
    techDesc: "テクノロジーの全体像：ハードウェアの発売、政策の変更、ガジェットレビュー、世界をリードするテック出版物からのイノベーションストーリー。",
    cloudDevopsDesc: "クラウドプラットフォーム、Infrastructure-as-Code、CI/CDパイプライン、DevOpsのベストプラクティスについてのすべて。AWSからKubernetesまで。",
    web3CryptoDesc: "ブロックチェーン技術、DeFiプロトコル、NFTエコシステム、暗号通貨市場の動きに関する毎日の更新。EthereumからSolana、そしてより広いWeb3の世界まで。",
    designUxFrontendDesc: "UI/UXデザイン、フロントエンドトレンド、デザインシステム、クリエイティブツールに関する厳選されたインサイト。FigmaからCSSまで、デザイナーとフロントエンド開発者が知るべきことをカバー。",
    emergingTechScienceDesc: "量子コンピューティング、バイオテクノロジー、宇宙技術、科学的ブレイクスルーの最前線を探求。次の10年を定義するイノベーションを発見しましょう。",
    opensourceLanguagesDesc: "オープンソースプロジェクトのリリース、プログラミング言語のアップデート、開発者ツールの最新情報をキャッチアップ。RustからTypeScriptまで、現代のソフトウェアを支えるエコシステムをカバー。",
  },
  pricing: {
    title: "シンプルな料金",
    subtitle: "誰でも無料。パワーユーザーにはプレミアム。",
    free: "無料",
    freePriceLabel: "¥0",
    freeDescription: "情報を得るのに最適。",
    freeFeatures: [
      "英語の日刊ニュースレター",
      "全10テックカテゴリ",
      "AIキュレーションのトップ記事",
      "カテゴリごとに5〜7記事",
      "モバイル対応メール",
    ],
    getStartedFree: "無料で始める",
    premium: "プレミアム",
    premiumPriceLabel: "$2.99",
    premiumDescription: "テック愛好家のために。",
    premiumFeatures: [
      "無料プランの全機能に加えて：",
      "お好きな言語でニュースレター（9言語対応）",
      "優先配信",
      "カテゴリのカスタマイズ",
      "週間ダイジェスト — AIによる週間レビュー",
      "新機能への早期アクセス",
    ],
    recommended: "おすすめ",
    subscribeWithPolar: "Polarで購読",
    signInToSubscribe: "購読するにはサインイン",
    perMonth: "/月",
    faqTitle: "よくある質問",
    faqLanguagesQ: "対応言語は？",
    faqLanguagesA:
      "英語、スペイン語、フランス語、ドイツ語、日本語、中国語、ポルトガル語、イタリア語、韓国語に対応しています。他の言語も近日追加予定です。",
    faqScheduleQ: "ニュースレターはいつ届きますか？",
    faqScheduleA:
      "毎日あなたのタイムゾーンの午前8時にお届けします。プレミアムユーザーは設定でお好きな配信時間を選択できます。",
    faqSourcesQ: "どのような情報源を使用していますか？",
    faqSourcesA:
      "トップテック出版物、研究機関、エンジニアリングブログ、業界リーダーなど、10カテゴリにわたる275以上のRSSフィードを集約しています。",
    faqCancelQ: "いつでもキャンセルできますか？",
    faqCancelA:
      "はい！プレミアムサブスクリプションはいつでもキャンセルできます。サブスクリプションはPolarで管理されています。",
  },
  settings: {
    title: "設定",
    subtitle: "ニュースレターの設定を管理します。",
    emailLookupLabel: "設定を管理するにはメールアドレスを入力してください",
    emailPlaceholder: "you@example.com",
    lookUp: "検索",
    noAccountFound: "このメールアドレスのアカウントは見つかりません。",
    subscribeFirst: "まず登録してください",
    account: "アカウント",
    premiumBadge: "プレミアム",
    freeBadge: "無料",
    upgradeToPremium: "プレミアムにアップグレード",
    language: "言語",
    languageDescPremium: "ニュースレターの言語を選択してください。",
    languageDescFree:
      "プレミアムにアップグレードして、お好きな言語でニュースレターを受け取りましょう。",
    deliveryTime: "配信時間",
    deliveryTimeDescPremium:
      "標準配信は午前8時です。プレミアムユーザーはお好きな配信時間を選択できます。",
    deliveryTimeDescFree:
      "プレミアムにアップグレードして、配信時間を選択しましょう。",
    timezone: "タイムゾーン",
    timezoneDesc:
      "あなたのタイムゾーンの午前8時にニュースレターをお届けします。",
    timezonePlaceholder: "例: Asia/Tokyo",
    categoriesTitle: "カテゴリ",
    categoriesDesc: "ニュースレターに含めるカテゴリを選択してください。",
    saving: "保存中...",
    saved: "保存しました！",
    savePreferences: "設定を保存",
  },
  newsletter: {
    notFound: "ニュースレターが見つかりません",
    readOriginal: "原文を読む →",
    languageNames: {
      en: "英語",
      es: "スペイン語",
      fr: "フランス語",
      de: "ドイツ語",
      ja: "日本語",
      zh: "中国語",
      pt: "ポルトガル語",
      it: "イタリア語",
      ko: "韓国語",
    },
  },
};

// ────── Chinese (Simplified) ──────
const zh: TranslationDict = {
  nav: {
    premium: "高级版",
    settings: "设置",
    home: "首页",
    pricing: "价格",
    signIn: "登录",
    signOut: "退出",
  },
  auth: {
    signInTitle: "登录 TheNode.tech",
    signInDescription: "输入您的邮箱，我们将发送一个魔法链接供您登录。",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "发送魔法链接",
    sending: "发送中...",
    checkEmail: "请检查您的邮箱！",
    checkEmailDescription: "我们已向您的邮箱发送了一个魔法链接。点击它即可登录。",
    signOutConfirm: "确定要退出吗？",
  },
  onboarding: {
    title: "选择你的分类",
    subtitle: "选择你想在每日通讯中接收的主题。你可以随时在设置中更改。",
    selectAll: "全选",
    deselectAll: "取消全选",
    continue: "继续",
    selectAtLeastOne: "请至少选择一个分类。",
  },
  common: {
    loading: "加载中...",
    backToHome: "← 返回首页",
    backToCategories: "← 返回所有分类",
    allRightsReserved: "版权所有。",
    somethingWentWrong: "出了点问题，请重试。",
    tryAgain: "重试",
    today: "今天",
    yesterday: "昨天",
  },
  home: {
    heroTitle: "科技新闻，AI为你总结。",
    heroSubtitle: "每日推送。",
    heroDescription:
      "275+来源，10个分类，AI策划摘要。5分钟了解科技界最重要的新闻。",
    subscribe: "订阅",
    subscribePlaceholder: "you@example.com",
    subscribeSuccess: "订阅成功！请查看邮箱确认订阅。",
    freeNote: "免费每日通讯。高级用户可选择语言接收。",
    learnMore: "了解更多",
    noNewsletters: "暂无通讯，敬请期待！",
    viewFullEdition: "查看完整版 →",
  },
  categories: {
    ai: "人工智能与机器学习",
    aiShort: "AI",
    eng: "软件工程与Web开发",
    engShort: "工程",
    sec: "网络安全",
    secShort: "安全",
    biz: "创业与风投",
    bizShort: "商业",
    tech: "大型科技与创新",
    techShort: "科技",
    cloudDevops: "云计算与DevOps",
    cloudDevopsShort: "云与DevOps",
    web3Crypto: "Web3与加密货币",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "设计、UX与前端",
    designUxFrontendShort: "设计/UX",
    emergingTechScience: "新兴科技与科学",
    emergingTechScienceShort: "新兴科技",
    opensourceLanguages: "开源与编程语言",
    opensourceLanguagesShort: "开源",
    aiDesc: "通过每日更新大型语言模型、研究论文和企业AI实验室公告，始终保持领先。从OpenAI到DeepMind，我们涵盖塑造未来的突破性进展。",
    engDesc: "每日精选框架、DevOps实践和来自顶级工程博客的教程。涵盖前端到后端、系统设计和开发者生产力的一切内容。",
    secDesc: "绝不错过任何关键漏洞。每日报道来自顶级网络安全来源的数据泄露、CVE、隐私动态和威胁情报。",
    bizDesc: "追踪创业生态系统中最新的融资轮次、并购和市场趋势。来自风投、创始人和行业分析师的洞察。",
    techDesc: "科技大局：硬件发布、政策变化、设备评测和来自全球领先科技出版物的创新故事。",
    cloudDevopsDesc: "关于云平台、基础设施即代码、CI/CD管道和DevOps最佳实践的一切。从AWS到Kubernetes及更多。",
    web3CryptoDesc: "每日更新区块链技术、DeFi协议、NFT生态系统和加密货币市场动态。从以太坊到Solana，涵盖更广泛的Web3领域。",
    designUxFrontendDesc: "精选UI/UX设计、前端趋势、设计系统和创意工具的洞察。从Figma到CSS，涵盖设计师和前端开发者需要了解的内容。",
    emergingTechScienceDesc: "探索量子计算、生物技术、太空技术和科学突破的前沿。发现将定义下一个十年的创新。",
    opensourceLanguagesDesc: "跟踪开源项目发布、编程语言更新和开发者工具。从Rust到TypeScript，涵盖驱动现代软件的生态系统。",
  },
  pricing: {
    title: "简单定价",
    subtitle: "人人免费。高级版适合高级用户。",
    free: "免费",
    freePriceLabel: "¥0",
    freeDescription: "适合了解资讯。",
    freeFeatures: [
      "每日英文通讯",
      "全部10个科技分类",
      "AI策划的头条新闻",
      "每个分类5-7篇文章",
      "移动端友好的邮件",
    ],
    getStartedFree: "免费开始",
    premium: "高级版",
    premiumPriceLabel: "$2.99",
    premiumDescription: "专为科技发烧友打造。",
    premiumFeatures: [
      "包含免费版的全部功能，另外：",
      "以你的语言接收通讯（支持9种语言）",
      "优先推送",
      "分类自定义",
      "优先体验新功能",
    ],
    recommended: "推荐",
    subscribeWithPolar: "通过Polar订阅",
    signInToSubscribe: "登录以订阅",
    perMonth: "/月",
    faqTitle: "常见问题",
    faqLanguagesQ: "支持哪些语言？",
    faqLanguagesA:
      "我们支持英语、西班牙语、法语、德语、日语、中文、葡萄牙语、意大利语和韩语。更多语言即将推出。",
    faqScheduleQ: "通讯什么时候发送？",
    faqScheduleA: "每天你所在时区的早上8点。高级用户可以在设置中选择喜欢的发送时间。",
    faqSourcesQ: "你们使用哪些信息源？",
    faqSourcesA:
      "我们汇总了来自顶级科技媒体、研究实验室、工程博客和行业领袖的275多个RSS源，涵盖10个分类。",
    faqCancelQ: "可以随时取消吗？",
    faqCancelA: "当然！你可以随时取消高级订阅。订阅通过Polar管理。",
  },
  settings: {
    title: "设置",
    subtitle: "管理你的通讯偏好。",
    emailLookupLabel: "输入你的邮箱来管理偏好设置",
    emailPlaceholder: "you@example.com",
    lookUp: "查找",
    noAccountFound: "未找到与此邮箱关联的帐号。",
    subscribeFirst: "请先订阅",
    account: "帐号",
    premiumBadge: "高级版",
    freeBadge: "免费",
    upgradeToPremium: "升级到高级版",
    language: "语言",
    languageDescPremium: "选择你的通讯语言。",
    languageDescFree: "升级到高级版以你的语言接收通讯。",
    deliveryTime: "发送时间",
    deliveryTimeDescPremium:
      "标准发送时间为早上8点。作为高级用户，你可以选择接收通讯的时间。",
    deliveryTimeDescFree:
      "升级到高级版以选择你喜欢的发送时间。",
    timezone: "时区",
    timezoneDesc: "我们会在你所在时区的早上8点发送通讯。",
    timezonePlaceholder: "例如 Asia/Shanghai",
    categoriesTitle: "分类",
    categoriesDesc: "选择你的通讯中要包含的分类。",
    saving: "保存中...",
    saved: "已保存！",
    savePreferences: "保存偏好",
  },
  newsletter: {
    notFound: "通讯未找到",
    readOriginal: "阅读原文 →",
    languageNames: {
      en: "英语",
      es: "西班牙语",
      fr: "法语",
      de: "德语",
      ja: "日语",
      zh: "中文",
      pt: "葡萄牙语",
      it: "意大利语",
      ko: "韩语",
    },
  },
};

// ────── Portuguese ──────
const pt: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Configurações",
    home: "Início",
    pricing: "Preços",
    signIn: "Entrar",
    signOut: "Sair",
  },
  auth: {
    signInTitle: "Entre no TheNode.tech",
    signInDescription: "Digite seu e-mail e enviaremos um link mágico para você entrar.",
    emailPlaceholder: "voce@email.com",
    sendMagicLink: "Enviar link mágico",
    sending: "Enviando...",
    checkEmail: "Verifique seu e-mail!",
    checkEmailDescription: "Enviamos um link mágico para seu e-mail. Clique nele para entrar.",
    signOutConfirm: "Tem certeza que deseja sair?",
  },
  onboarding: {
    title: "Escolha suas categorias",
    subtitle: "Selecione os temas que deseja receber na sua newsletter diária. Você pode alterar isso a qualquer momento nas configurações.",
    selectAll: "Selecionar tudo",
    deselectAll: "Desmarcar tudo",
    continue: "Continuar",
    selectAtLeastOne: "Por favor, selecione pelo menos uma categoria.",
  },
  common: {
    loading: "Carregando...",
    backToHome: "← Voltar ao início",
    backToCategories: "← Voltar às categorias",
    allRightsReserved: "Todos os direitos reservados.",
    somethingWentWrong: "Algo deu errado. Tente novamente.",
    tryAgain: "Tentar novamente",
    today: "Hoje",
    yesterday: "Ontem",
  },
  home: {
    heroTitle: "Notícias de tecnologia, resumidas por IA.",
    heroSubtitle: "Entregue diariamente.",
    heroDescription:
      "275+ fontes. 10 categorias. Resumos curados por IA. As notícias tech mais importantes em 5 minutos.",
    subscribe: "Inscrever-se",
    subscribePlaceholder: "voce@email.com",
    subscribeSuccess:
      "Você está dentro! Verifique seu e-mail para confirmar a inscrição.",
    freeNote:
      "Newsletter diária gratuita. Usuários Premium recebem no seu idioma.",
    learnMore: "Saiba mais",
    noNewsletters: "Nenhuma newsletter ainda. Fique atento!",
    viewFullEdition: "Ver edição completa →",
  },
  categories: {
    ai: "IA e Aprendizado de Máquina",
    aiShort: "IA",
    eng: "Engenharia de Software e Web",
    engShort: "Engenharia",
    sec: "Cibersegurança",
    secShort: "Segurança",
    biz: "Startups e Capital de Risco",
    bizShort: "Negócios",
    tech: "Big Tech e Inovação",
    techShort: "Tech",
    cloudDevops: "Cloud Computing e DevOps",
    cloudDevopsShort: "Cloud e DevOps",
    web3Crypto: "Web3 e Criptomoedas",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Design, UX e Frontend",
    designUxFrontendShort: "Design/UX",
    emergingTechScience: "Tecnologia Emergente e Ciência",
    emergingTechScienceShort: "Tech Emergente",
    opensourceLanguages: "Open Source e Linguagens de Programação",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Fique à frente com atualizações diárias sobre grandes modelos de linguagem, artigos de pesquisa e anúncios de laboratórios de IA. De OpenAI a DeepMind, cobrimos os avanços que estão moldando o futuro.",
    engDesc: "Sua dose diária de frameworks, práticas DevOps e tutoriais dos melhores blogs de engenharia. Cobre tudo, de frontend a backend, design de sistemas e produtividade do desenvolvedor.",
    secDesc: "Nunca perca uma vulnerabilidade crítica. Cobertura diária de violações de dados, CVEs, desenvolvimentos em privacidade e inteligência de ameaças das principais fontes de cibersegurança.",
    bizDesc: "Acompanhe as últimas rodadas de investimento, fusões e aquisições e tendências de mercado no ecossistema de startups. Insights de VCs, fundadores e analistas do setor.",
    techDesc: "A visão geral da tecnologia: lançamentos de hardware, mudanças de políticas, análises de gadgets e histórias de inovação das principais publicações tech do mundo.",
    cloudDevopsDesc: "Tudo sobre plataformas cloud, infraestrutura como código, pipelines CI/CD e melhores práticas DevOps. De AWS a Kubernetes e além.",
    web3CryptoDesc: "Atualizações diárias sobre tecnologia blockchain, protocolos DeFi, ecossistemas NFT e movimentos do mercado de criptomoedas. De Ethereum a Solana e o ecossistema Web3.",
    designUxFrontendDesc: "Insights selecionados sobre design UI/UX, tendências frontend, design systems e ferramentas criativas. De Figma a CSS, cobrindo o que designers e desenvolvedores frontend precisam saber.",
    emergingTechScienceDesc: "Explore as fronteiras da computação quântica, biotecnologia, tecnologia espacial e avanços científicos. Descubra as inovações que definirão a próxima década.",
    opensourceLanguagesDesc: "Acompanhe lançamentos de projetos open source, atualizações de linguagens de programação e ferramentas para desenvolvedores. De Rust a TypeScript, cobrindo o ecossistema que impulsiona o software moderno.",
  },
  pricing: {
    title: "Preços simples",
    subtitle: "Gratuito para todos. Premium para usuários avançados.",
    free: "Grátis",
    freePriceLabel: "R$0",
    freeDescription: "Perfeito para se manter informado.",
    freeFeatures: [
      "Newsletter diária em inglês",
      "Todas as 10 categorias tech",
      "Artigos selecionados por IA",
      "5-7 artigos por categoria",
      "E-mails otimizados para mobile",
    ],
    getStartedFree: "Começar grátis",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "Para o entusiasta de tecnologia.",
    premiumFeatures: [
      "Tudo do plano Grátis, mais:",
      "Newsletter no seu idioma (9 idiomas)",
      "Entrega prioritária",
      "Personalização de categorias",
      "Resumo semanal — revisão da semana com IA",
      "Acesso antecipado a novas funcionalidades",
    ],
    recommended: "Recomendado",
    subscribeWithPolar: "Assinar com Polar",
    signInToSubscribe: "Entre para assinar",
    perMonth: "/mês",
    faqTitle: "Perguntas frequentes",
    faqLanguagesQ: "Quais idiomas são suportados?",
    faqLanguagesA:
      "Suportamos inglês, espanhol, francês, alemão, japonês, chinês, português, italiano e coreano. Mais idiomas em breve.",
    faqScheduleQ: "Quando a newsletter é enviada?",
    faqScheduleA:
      "Todo dia às 8h no seu fuso horário. Usuários Premium podem escolher seu horário preferido nas configurações.",
    faqSourcesQ: "Quais fontes vocês usam?",
    faqSourcesA:
      "Agregamos mais de 275 feeds RSS das melhores publicações tech, laboratórios de pesquisa, blogs de engenharia e líderes do setor em 10 categorias.",
    faqCancelQ: "Posso cancelar a qualquer momento?",
    faqCancelA:
      "Sim! Você pode cancelar sua assinatura Premium a qualquer momento. Sua assinatura é gerenciada através do Polar.",
  },
  settings: {
    title: "Configurações",
    subtitle: "Gerencie suas preferências de newsletter.",
    emailLookupLabel: "Digite seu e-mail para gerenciar preferências",
    emailPlaceholder: "voce@email.com",
    lookUp: "Buscar",
    noAccountFound: "Nenhuma conta encontrada com este e-mail.",
    subscribeFirst: "Inscreva-se primeiro",
    account: "Conta",
    premiumBadge: "Premium",
    freeBadge: "Grátis",
    upgradeToPremium: "Atualizar para Premium",
    language: "Idioma",
    languageDescPremium: "Escolha o idioma da sua newsletter.",
    languageDescFree:
      "Atualize para Premium para receber newsletters no seu idioma.",
    deliveryTime: "Horário de entrega",
    deliveryTimeDescPremium:
      "A entrega padrão é às 8h. Como usuário Premium, você pode escolher o horário de recebimento.",
    deliveryTimeDescFree:
      "Atualize para Premium para escolher seu horário de entrega preferido.",
    timezone: "Fuso horário",
    timezoneDesc:
      "Enviaremos sua newsletter às 8h no seu fuso horário.",
    timezonePlaceholder: "ex., America/Sao_Paulo",
    categoriesTitle: "Categorias",
    categoriesDesc: "Escolha quais categorias incluir na sua newsletter.",
    saving: "Salvando...",
    saved: "Salvo!",
    savePreferences: "Salvar preferências",
  },
  newsletter: {
    notFound: "Newsletter não encontrada",
    readOriginal: "Ler original →",
    languageNames: {
      en: "Inglês",
      es: "Espanhol",
      fr: "Francês",
      de: "Alemão",
      ja: "Japonês",
      zh: "Chinês",
      pt: "Português",
      it: "Italiano",
      ko: "Coreano",
    },
  },
};

// ────── Italian ──────
const it: TranslationDict = {
  nav: {
    premium: "Premium",
    settings: "Impostazioni",
    home: "Home",
    pricing: "Prezzi",
    signIn: "Accedi",
    signOut: "Esci",
  },
  auth: {
    signInTitle: "Accedi a TheNode.tech",
    signInDescription: "Inserisci la tua email e ti invieremo un link magico per accedere.",
    emailPlaceholder: "tu@email.com",
    sendMagicLink: "Invia link magico",
    sending: "Invio...",
    checkEmail: "Controlla la tua email!",
    checkEmailDescription: "Ti abbiamo inviato un link magico. Cliccalo per accedere.",
    signOutConfirm: "Sei sicuro di voler uscire?",
  },
  onboarding: {
    title: "Scegli le tue categorie",
    subtitle: "Seleziona gli argomenti che vuoi ricevere nella tua newsletter quotidiana. Puoi modificarli in qualsiasi momento nelle impostazioni.",
    selectAll: "Seleziona tutto",
    deselectAll: "Deseleziona tutto",
    continue: "Continua",
    selectAtLeastOne: "Seleziona almeno una categoria.",
  },
  common: {
    loading: "Caricamento...",
    backToHome: "← Torna alla home",
    backToCategories: "← Torna alle categorie",
    allRightsReserved: "Tutti i diritti riservati.",
    somethingWentWrong: "Qualcosa è andato storto. Riprova.",
    tryAgain: "Riprova",
    today: "Oggi",
    yesterday: "Ieri",
  },
  home: {
    heroTitle: "Notizie tech, riassunte dall'IA.",
    heroSubtitle: "Consegnate ogni giorno.",
    heroDescription:
      "275+ fonti. 10 categorie. Riassunti curati dall'IA. Le notizie tech più importanti in 5 minuti.",
    subscribe: "Iscriviti",
    subscribePlaceholder: "tu@email.com",
    subscribeSuccess:
      "Ci sei! Controlla la tua email per verificare l'iscrizione.",
    freeNote:
      "Newsletter giornaliera gratuita. Gli utenti Premium la ricevono nella loro lingua.",
    learnMore: "Scopri di più",
    noNewsletters: "Nessuna newsletter ancora. Resta sintonizzato!",
    viewFullEdition: "Vedi edizione completa →",
  },
  categories: {
    ai: "IA e Machine Learning",
    aiShort: "IA",
    eng: "Ingegneria Software e Web",
    engShort: "Ingegneria",
    sec: "Cybersicurezza",
    secShort: "Sicurezza",
    biz: "Startup e Venture Capital",
    bizShort: "Business",
    tech: "Big Tech e Innovazione",
    techShort: "Tech",
    cloudDevops: "Cloud Computing e DevOps",
    cloudDevopsShort: "Cloud e DevOps",
    web3Crypto: "Web3 e Criptovalute",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "Design, UX e Frontend",
    designUxFrontendShort: "Design/UX",
    emergingTechScience: "Tecnologie Emergenti e Scienza",
    emergingTechScienceShort: "Tech Emergente",
    opensourceLanguages: "Open Source e Linguaggi di Programmazione",
    opensourceLanguagesShort: "Open Source",
    aiDesc: "Resta all'avanguardia con aggiornamenti quotidiani su grandi modelli linguistici, articoli di ricerca e annunci dei laboratori di IA. Da OpenAI a DeepMind, copriamo le innovazioni che stanno plasmando il futuro.",
    engDesc: "La tua dose quotidiana di framework, pratiche DevOps e tutorial dai migliori blog di ingegneria. Copre tutto, dal frontend al backend, progettazione di sistemi e produttività degli sviluppatori.",
    secDesc: "Non perdere mai una vulnerabilità critica. Copertura quotidiana di violazioni dei dati, CVE, sviluppi sulla privacy e intelligence sulle minacce dalle principali fonti di cybersicurezza.",
    bizDesc: "Segui gli ultimi round di finanziamento, fusioni e acquisizioni e tendenze di mercato nell'ecosistema startup. Approfondimenti da VC, fondatori e analisti del settore.",
    techDesc: "Il quadro generale della tecnologia: lanci hardware, cambiamenti normativi, recensioni di gadget e storie di innovazione dalle principali pubblicazioni tech mondiali.",
    cloudDevopsDesc: "Tutto sulle piattaforme cloud, infrastructure-as-code, pipeline CI/CD e best practice DevOps. Da AWS a Kubernetes e oltre.",
    web3CryptoDesc: "Aggiornamenti quotidiani su tecnologia blockchain, protocolli DeFi, ecosistemi NFT e movimenti del mercato delle criptovalute. Da Ethereum a Solana e il più ampio panorama Web3.",
    designUxFrontendDesc: "Approfondimenti curati su design UI/UX, tendenze frontend, design system e strumenti creativi. Da Figma a CSS, coprendo ciò che designer e sviluppatori frontend devono sapere.",
    emergingTechScienceDesc: "Esplora le frontiere del quantum computing, biotecnologia, tecnologia spaziale e scoperte scientifiche. Scopri le innovazioni che definiranno il prossimo decennio.",
    opensourceLanguagesDesc: "Resta aggiornato sui rilasci di progetti open source, aggiornamenti dei linguaggi di programmazione e strumenti per sviluppatori. Da Rust a TypeScript, coprendo l'ecosistema che alimenta il software moderno.",
  },
  pricing: {
    title: "Prezzi semplici",
    subtitle: "Gratuito per tutti. Premium per utenti avanzati.",
    free: "Gratuito",
    freePriceLabel: "0 €",
    freeDescription: "Perfetto per restare informati.",
    freeFeatures: [
      "Newsletter giornaliera in inglese",
      "Tutte le 10 categorie tech",
      "Articoli curati dall'IA",
      "5-7 articoli per categoria",
      "Email ottimizzate per mobile",
    ],
    getStartedFree: "Inizia gratis",
    premium: "Premium",
    premiumPriceLabel: "$2.99",
    premiumDescription: "Per l'appassionato di tecnologia esigente.",
    premiumFeatures: [
      "Tutto del piano Gratuito, più:",
      "Newsletter nella tua lingua (9 lingue)",
      "Consegna prioritaria",
      "Personalizzazione delle categorie",
      "Digest settimanale — riepilogo settimanale con IA",
      "Accesso anticipato alle nuove funzionalità",
    ],
    recommended: "Consigliato",
    subscribeWithPolar: "Iscriviti con Polar",
    signInToSubscribe: "Accedi per abbonarti",
    perMonth: "/mese",
    faqTitle: "Domande frequenti",
    faqLanguagesQ: "Quali lingue sono supportate?",
    faqLanguagesA:
      "Supportiamo inglese, spagnolo, francese, tedesco, giapponese, cinese, portoghese, italiano e coreano. Altre lingue in arrivo.",
    faqScheduleQ: "Quando viene inviata la newsletter?",
    faqScheduleA:
      "Ogni giorno alle 8 nel tuo fuso orario. Gli utenti Premium possono scegliere il loro orario preferito nelle impostazioni.",
    faqSourcesQ: "Quali fonti utilizzate?",
    faqSourcesA:
      "Aggreghiamo oltre 275 feed RSS dalle migliori pubblicazioni tech, laboratori di ricerca, blog di ingegneria e leader del settore in 10 categorie.",
    faqCancelQ: "Posso cancellare in qualsiasi momento?",
    faqCancelA:
      "Sì! Puoi cancellare il tuo abbonamento Premium in qualsiasi momento. L'abbonamento è gestito tramite Polar.",
  },
  settings: {
    title: "Impostazioni",
    subtitle: "Gestisci le tue preferenze per la newsletter.",
    emailLookupLabel: "Inserisci la tua email per gestire le preferenze",
    emailPlaceholder: "tu@email.com",
    lookUp: "Cerca",
    noAccountFound: "Nessun account trovato con questa email.",
    subscribeFirst: "Iscriviti prima",
    account: "Account",
    premiumBadge: "Premium",
    freeBadge: "Gratuito",
    upgradeToPremium: "Passa a Premium",
    language: "Lingua",
    languageDescPremium: "Scegli la lingua per la tua newsletter.",
    languageDescFree:
      "Passa a Premium per ricevere le newsletter nella tua lingua.",
    deliveryTime: "Orario di consegna",
    deliveryTimeDescPremium:
      "La consegna standard è alle 8. Come utente Premium puoi scegliere l'orario di ricezione.",
    deliveryTimeDescFree:
      "Passa a Premium per scegliere il tuo orario di consegna preferito.",
    timezone: "Fuso orario",
    timezoneDesc:
      "Invieremo la tua newsletter alle 8 nel tuo fuso orario.",
    timezonePlaceholder: "es., Europe/Rome",
    categoriesTitle: "Categorie",
    categoriesDesc:
      "Scegli quali categorie includere nella tua newsletter.",
    saving: "Salvataggio...",
    saved: "Salvato!",
    savePreferences: "Salva preferenze",
  },
  newsletter: {
    notFound: "Newsletter non trovata",
    readOriginal: "Leggi l'originale →",
    languageNames: {
      en: "Inglese",
      es: "Spagnolo",
      fr: "Francese",
      de: "Tedesco",
      ja: "Giapponese",
      zh: "Cinese",
      pt: "Portoghese",
      it: "Italiano",
      ko: "Coreano",
    },
  },
};

// ────── Korean ──────
const ko: TranslationDict = {
  nav: {
    premium: "프리미엄",
    settings: "설정",
    home: "홈",
    pricing: "가격",
    signIn: "로그인",
    signOut: "로그아웃",
  },
  auth: {
    signInTitle: "TheNode.tech에 로그인",
    signInDescription: "이메일을 입력하면 로그인용 매직 링크를 보내드립니다.",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "매직 링크 보내기",
    sending: "전송 중...",
    checkEmail: "이메일을 확인하세요!",
    checkEmailDescription: "매직 링크를 이메일로 보냈습니다. 클릭하여 로그인하세요.",
    signOutConfirm: "로그아웃 하시겠습니까?",
  },
  onboarding: {
    title: "카테고리를 선택하세요",
    subtitle: "일간 뉴스레터에서 받고 싶은 주제를 선택하세요. 설정에서 언제든지 변경할 수 있습니다.",
    selectAll: "전체 선택",
    deselectAll: "전체 해제",
    continue: "계속",
    selectAtLeastOne: "최소 하나의 카테고리를 선택해 주세요.",
  },
  common: {
    loading: "로딩 중...",
    backToHome: "← 홈으로 돌아가기",
    backToCategories: "← 카테고리 목록으로",
    allRightsReserved: "All rights reserved.",
    somethingWentWrong: "문제가 발생했습니다. 다시 시도해 주세요.",
    tryAgain: "다시 시도",
    today: "오늘",
    yesterday: "어제",
  },
  home: {
    heroTitle: "테크 뉴스, AI가 요약했습니다.",
    heroSubtitle: "매일 배달됩니다.",
    heroDescription:
      "275개 이상의 소스. 10개 카테고리. AI 큐레이션 요약. 5분 만에 테크 세계의 핵심 뉴스를 파악하세요.",
    subscribe: "구독하기",
    subscribePlaceholder: "you@example.com",
    subscribeSuccess: "등록 완료! 이메일을 확인하여 구독을 인증하세요.",
    freeNote: "무료 일간 뉴스레터. 프리미엄 사용자는 원하는 언어로 받을 수 있습니다.",
    learnMore: "자세히 알아보기",
    noNewsletters: "아직 뉴스레터가 없습니다. 곧 만나보세요!",
    viewFullEdition: "전체 에디션 보기 →",
  },
  categories: {
    ai: "AI 및 머신러닝",
    aiShort: "AI",
    eng: "소프트웨어 엔지니어링 및 웹 개발",
    engShort: "엔지니어링",
    sec: "사이버 보안",
    secShort: "보안",
    biz: "스타트업 및 벤처 캐피탈",
    bizShort: "비즈니스",
    tech: "빅테크 및 혁신",
    techShort: "테크",
    cloudDevops: "클라우드 컴퓨팅 및 DevOps",
    cloudDevopsShort: "클라우드 & DevOps",
    web3Crypto: "Web3 및 암호화폐",
    web3CryptoShort: "Web3/Crypto",
    designUxFrontend: "디자인, UX 및 프론트엔드",
    designUxFrontendShort: "디자인/UX",
    emergingTechScience: "신흥 기술 및 과학",
    emergingTechScienceShort: "신흥 테크",
    opensourceLanguages: "오픈소스 및 프로그래밍 언어",
    opensourceLanguagesShort: "오픈소스",
    aiDesc: "대규모 언어 모델, 연구 논문, 기업 AI 연구소 발표에 대한 매일 업데이트로 앞서 나가세요. OpenAI에서 DeepMind까지, 미래를 형성하는 혁신적 발전을 다룹니다.",
    engDesc: "최고의 엔지니어링 블로그에서 제공하는 프레임워크, DevOps 실무, 튜토리얼의 일일 정보. 프론트엔드에서 백엔드, 시스템 설계, 개발자 생산성까지 모든 것을 다룹니다.",
    secDesc: "중요한 취약점을 놓치지 마세요. 최고의 사이버 보안 소스에서 제공하는 데이터 유출, CVE, 프라이버시 동향, 위협 인텔리전스의 일일 보도.",
    bizDesc: "스타트업 생태계의 최신 투자 라운드, M&A, 시장 동향을 추적하세요. VC, 창업자, 업계 분석가의 인사이트.",
    techDesc: "기술의 큰 그림: 하드웨어 출시, 정책 변화, 가젯 리뷰, 세계 최고의 테크 매체에서 전하는 혁신 이야기.",
    cloudDevopsDesc: "클라우드 플랫폼, Infrastructure-as-Code, CI/CD 파이프라인, DevOps 모범 사례에 대한 모든 것. AWS에서 Kubernetes까지.",
    web3CryptoDesc: "블록체인 기술, DeFi 프로토콜, NFT 생태계, 암호화폐 시장 동향에 대한 매일 업데이트. 이더리움에서 솔라나, 그리고 더 넓은 Web3 세계까지.",
    designUxFrontendDesc: "UI/UX 디자인, 프론트엔드 트렌드, 디자인 시스템, 크리에이티브 도구에 대한 엄선된 인사이트. Figma에서 CSS까지, 디자이너와 프론트엔드 개발자가 알아야 할 내용을 다룹니다.",
    emergingTechScienceDesc: "양자 컴퓨팅, 바이오테크, 우주 기술, 과학적 발견의 최전선을 탐험하세요. 다음 10년을 정의할 혁신을 발견하세요.",
    opensourceLanguagesDesc: "오픈소스 프로젝트 릴리스, 프로그래밍 언어 업데이트, 개발자 도구의 최신 정보를 확인하세요. Rust에서 TypeScript까지, 현대 소프트웨어를 지탱하는 생태계를 다룹니다.",
  },
  pricing: {
    title: "간단한 가격",
    subtitle: "모든 사람에게 무료. 파워 유저를 위한 프리미엄.",
    free: "무료",
    freePriceLabel: "₩0",
    freeDescription: "정보를 얻기에 완벽합니다.",
    freeFeatures: [
      "영어 일간 뉴스레터",
      "전체 10개 테크 카테고리",
      "AI 큐레이션 톱 뉴스",
      "카테고리당 5-7개 기사",
      "모바일 최적화 이메일",
    ],
    getStartedFree: "무료로 시작",
    premium: "프리미엄",
    premiumPriceLabel: "$2.99",
    premiumDescription: "진지한 테크 애호가를 위해.",
    premiumFeatures: [
      "무료 플랜의 모든 기능 포함:",
      "원하는 언어로 뉴스레터 (9개 언어 지원)",
      "우선 배송",
      "카테고리 맞춤 설정",
      "주간 다이제스트 — AI 기반 주간 리뷰",
      "신기능 조기 접근",
    ],
    recommended: "추천",
    subscribeWithPolar: "Polar로 구독",
    signInToSubscribe: "구독하려면 로그인",
    perMonth: "/월",
    faqTitle: "자주 묻는 질문",
    faqLanguagesQ: "어떤 언어가 지원되나요?",
    faqLanguagesA:
      "영어, 스페인어, 프랑스어, 독일어, 일본어, 중국어, 포르투갈어, 이탈리아어, 한국어를 지원합니다. 더 많은 언어가 곧 추가됩니다.",
    faqScheduleQ: "뉴스레터는 언제 발송되나요?",
    faqScheduleA:
      "매일 당신의 시간대 기준 오전 8시에 발송됩니다. 프리미엄 사용자는 설정에서 원하는 배달 시간을 선택할 수 있습니다.",
    faqSourcesQ: "어떤 소스를 사용하나요?",
    faqSourcesA:
      "10개 카테고리에 걸쳐 최고의 테크 매체, 연구소, 엔지니어링 블로그, 업계 리더의 275개 이상의 RSS 피드를 수집합니다.",
    faqCancelQ: "언제든 취소할 수 있나요?",
    faqCancelA:
      "네! 프리미엄 구독은 언제든 취소할 수 있습니다. 구독은 Polar을 통해 관리됩니다.",
  },
  settings: {
    title: "설정",
    subtitle: "뉴스레터 환경설정을 관리합니다.",
    emailLookupLabel: "환경설정을 관리하려면 이메일을 입력하세요",
    emailPlaceholder: "you@example.com",
    lookUp: "검색",
    noAccountFound: "이 이메일로 등록된 계정이 없습니다.",
    subscribeFirst: "먼저 구독하세요",
    account: "계정",
    premiumBadge: "프리미엄",
    freeBadge: "무료",
    upgradeToPremium: "프리미엄으로 업그레이드",
    language: "언어",
    languageDescPremium: "뉴스레터 언어를 선택하세요.",
    languageDescFree:
      "프리미엄으로 업그레이드하여 원하는 언어로 뉴스레터를 받으세요.",
    deliveryTime: "배달 시간",
    deliveryTimeDescPremium:
      "기본 배달 시간은 오전 8시입니다. 프리미엄 사용자는 원하는 배달 시간을 선택할 수 있습니다.",
    deliveryTimeDescFree:
      "프리미엄으로 업그레이드하여 원하는 배달 시간을 선택하세요.",
    timezone: "시간대",
    timezoneDesc: "당신의 시간대 기준 오전 8시에 뉴스레터를 발송합니다.",
    timezonePlaceholder: "예: Asia/Seoul",
    categoriesTitle: "카테고리",
    categoriesDesc: "뉴스레터에 포함할 카테고리를 선택하세요.",
    saving: "저장 중...",
    saved: "저장됨!",
    savePreferences: "설정 저장",
  },
  newsletter: {
    notFound: "뉴스레터를 찾을 수 없습니다",
    readOriginal: "원문 읽기 →",
    languageNames: {
      en: "영어",
      es: "스페인어",
      fr: "프랑스어",
      de: "독일어",
      ja: "일본어",
      zh: "중국어",
      pt: "포르투갈어",
      it: "이탈리아어",
      ko: "한국어",
    },
  },
};

// ────── Export all translations ──────
export const translations: Record<Locale, TranslationDict> = {
  en,
  es,
  fr,
  de,
  ja,
  zh,
  pt,
  it,
  ko,
};

