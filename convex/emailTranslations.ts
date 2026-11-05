/**
 * Email template translations for Convex actions (newsletter, welcome).
 * Used by sendNewsletters.ts. Locales match lib/i18n SUPPORTED_LOCALES.
 */

export type EmailLocale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "ja"
  | "zh"
  | "pt"
  | "it"
  | "ko";

export type CategorySlug =
  | "ai"
  | "eng"
  | "sec"
  | "biz"
  | "tech"
  | "cloud-devops"
  | "web3-crypto"
  | "design-ux-frontend"
  | "emerging-tech-science"
  | "opensource-languages";

export interface EmailTemplateStrings {
  // Daily newsletter
  today: string;
  dailyDoseOfTech: string;
  featuredStories: string;
  keyNumbers: string;
  underTheRadar: string;
  tryThis: string;
  quoteOfTheDay: string;
  quickLinks: string;
  readOnSite: string;
  /** New design (2026 rebrand) */
  inBrief: string;
  minRead: string;
  minShort: string;
  readArticle: string;
  tryItCta: string;
  sourceLabel: string;
  feedbackQuestion: string;
  feedbackHint: string;
  feedbackYes: string;
  feedbackNo: string;
  forwardToColleague: string;
  footerBlurb: string;
  receivingBecause: string;
  /** Weekly digest footer */
  receivingBecauseWeeklyDigest: string;
  /** Weekly digest email section titles */
  weeklyDigestTitle: string;
  weeklyDigestOverview: string;
  weeklyDigestTrends: string;
  weeklyDigestTopStories: string;
  weeklyDigestByCategory: string;
  /** Magic-link sign-in email + weekly digest extras */
  authSubject: string;
  authPreheader: string;
  authHeaderLabel: string;
  authTitle: string;
  authBody: string;
  authButton: string;
  authFallback: string;
  authIgnore: string;
  authBlurb: string;
  weeklyThreeTrends: string;
  weeklyFeedbackQuestion: string;
  weeklyKeyNumbers: string;
  unsubscribe: string;
  managePreferences: string;
  // Subject line templates ({{headline}}, {{topics}}, {{date}})
  subjectFallback: string;
  subjectWithTopics: string;
  subjectWithHeadline: string;
  andMore: string;
  categoryShortNames: Record<CategorySlug, string>;
  // Welcome email
  welcomeTitle: string;
  welcomeSubtitle: string;
  thanksForSigningUp: string;
  whatYouGet: string;
  deepDivesDesc: string;
  keyStatsDesc: string;
  quickLinksDesc: string;
  weCover: string;
  headToSettings: string;
  customizePreferences: string;
  receivingBecauseSignup: string;
  welcomeSubject: string;
}

const CATEGORY_SLUGS: CategorySlug[] = [
  "ai",
  "eng",
  "sec",
  "biz",
  "tech",
  "cloud-devops",
  "web3-crypto",
  "design-ux-frontend",
  "emerging-tech-science",
  "opensource-languages",
];

function categoryShortNames(
  ai: string,
  eng: string,
  sec: string,
  biz: string,
  tech: string,
  cloudDevops: string,
  web3Crypto: string,
  designUx: string,
  emerging: string,
  opensource: string
): Record<CategorySlug, string> {
  return {
    ai,
    eng,
    sec,
    biz,
    tech,
    "cloud-devops": cloudDevops,
    "web3-crypto": web3Crypto,
    "design-ux-frontend": designUx,
    "emerging-tech-science": emerging,
    "opensource-languages": opensource,
  };
}

const en: EmailTemplateStrings = {
  today: "Today",
  dailyDoseOfTech: "Your daily dose of tech",
  featuredStories: "Featured Stories",
  keyNumbers: "Key Numbers",
  underTheRadar: "Under the Radar",
  tryThis: "Try This",
  quoteOfTheDay: "Quote of the Day",
  quickLinks: "Quick Links",
  readOnSite: "Read online",
  inBrief: "In brief",
  minRead: "{{n}} min read",
  minShort: "{{n}} min",
  readArticle: "Read article →",
  tryItCta: "Check it out →",
  sourceLabel: "Source",
  feedbackQuestion: "Was this issue useful?",
  feedbackHint: "One click is enough — it shapes the next one.",
  feedbackYes: "Yes, useful",
  feedbackNo: "Not really",
  forwardToColleague: "Forward to a colleague →",
  footerBlurb: "Tech news, one channel at a time.",
  receivingBecause:
    "You're receiving this because you subscribed to TheNode.tech newsletter.",
  receivingBecauseWeeklyDigest:
    "You're receiving this because you enabled the weekly digest.",
  weeklyDigestTitle: "Week in Review",
  weeklyDigestOverview: "The Week That Was",
  weeklyDigestTrends: "Trends Across the Board",
  weeklyDigestTopStories: "Top Stories",
  weeklyDigestByCategory: "By Category",
  authSubject: "Your TheNode sign-in link",
  authPreheader: "Tap the button to sign in. The link expires in 15 minutes.",
  authHeaderLabel: "Sign in",
  authTitle: "Sign in to TheNode",
  authBody: "Tap the button below to sign in. The link expires in 15 minutes.",
  authButton: "Sign in",
  authFallback: "Button not working? Copy and paste this link into your browser:",
  authIgnore: "If you didn't ask for this email, you can ignore it. Nobody can sign in without the link.",
  authBlurb: "You're receiving this because someone asked to sign in to TheNode.tech with this address.",
  weeklyThreeTrends: "Three trends this week",
  weeklyFeedbackQuestion: "Was this week's review useful?",
  weeklyKeyNumbers: "Key numbers",
  unsubscribe: "Unsubscribe",
  managePreferences: "Manage preferences",
  subjectFallback: "Your daily tech digest — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "& more",
  categoryShortNames: categoryShortNames(
    "AI",
    "Engineering",
    "Security",
    "Business",
    "Tech",
    "Cloud & DevOps",
    "Web3/Crypto",
    "Design/UX",
    "Emerging Tech",
    "Open Source"
  ),
  welcomeTitle: "Welcome to TheNode.tech",
  welcomeSubtitle: "Your daily tech intelligence, delivered.",
  thanksForSigningUp:
    "Thanks for signing up! Every morning, we comb through hundreds of tech news sources and use AI to distill the signal from the noise — so you don't have to.",
  whatYouGet: "Here's what you'll get in each edition:",
  deepDivesDesc: "Deep Dives — Expert analysis of the 2-3 biggest stories of the day",
  keyStatsDesc: "Key Stats — Notable numbers and data points you should know",
  quickLinksDesc: "Quick Links — Scannable summaries of everything else worth reading",
  weCover: "We cover 10 categories across the tech landscape:",
  headToSettings:
    "Head to your settings to pick the categories you care about, set your timezone, and choose your preferred delivery time. Your first newsletter will arrive tomorrow morning.",
  customizePreferences: "Customize Your Preferences",
  receivingBecauseSignup:
    "You're receiving this because you signed up for TheNode.tech.",
  welcomeSubject: "Welcome to TheNode.tech — Your daily tech digest starts now",
};

const es: EmailTemplateStrings = {
  ...en,
  authSubject: "Tu enlace para iniciar sesión en TheNode",
  authPreheader: "Toca el botón para iniciar sesión. El enlace caduca en 15 minutos.",
  authHeaderLabel: "Iniciar sesión",
  authTitle: "Inicia sesión en TheNode",
  authBody: "Toca el botón para iniciar sesión. El enlace caduca en 15 minutos.",
  authButton: "Iniciar sesión",
  authFallback: "¿El botón no funciona? Copia y pega este enlace en tu navegador:",
  authIgnore: "Si no pediste este correo, puedes ignorarlo. Nadie puede iniciar sesión sin el enlace.",
  authBlurb: "Recibes esto porque alguien pidió iniciar sesión en TheNode.tech con esta dirección.",
  weeklyDigestTitle: "Resumen semanal",
  weeklyDigestOverview: "La semana en resumen",
  weeklyDigestTrends: "Tendencias generales",
  weeklyDigestTopStories: "Noticias destacadas",
  weeklyDigestByCategory: "Por categoría",
  weeklyThreeTrends: "Tres tendencias de la semana",
  weeklyFeedbackQuestion: "¿Te resultó útil el resumen de esta semana?",
  weeklyKeyNumbers: "Cifras clave",
  today: "Hoy",
  dailyDoseOfTech: "Tu dosis diaria de tech",
  featuredStories: "Historias destacadas",
  keyNumbers: "Cifras clave",
  underTheRadar: "Under the Radar",
  tryThis: "Prueba esto",
  quoteOfTheDay: "Cita del día",
  quickLinks: "Enlaces rápidos",
  readOnSite: "Leer en línea",
  inBrief: "En breve",
  minRead: "{{n}} min de lectura",
  minShort: "{{n}} min",
  readArticle: "Leer el artículo →",
  tryItCta: "Descubrir →",
  sourceLabel: "Fuente",
  feedbackQuestion: "¿Te resultó útil esta edición?",
  feedbackHint: "Un clic basta: nos ayuda a mejorar la próxima.",
  feedbackYes: "Sí, útil",
  feedbackNo: "No mucho",
  forwardToColleague: "Reenviar a un colega →",
  footerBlurb: "Noticias tech, un canal a la vez.",
  receivingBecause:
    "Recibes este correo porque te suscribiste al newsletter de TheNode.tech.",
  receivingBecauseWeeklyDigest:
    "Recibes este correo porque activaste el resumen semanal.",
  unsubscribe: "Darse de baja",
  managePreferences: "Gestionar preferencias",
  subjectFallback: "Tu resumen tech diario — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "y más",
  categoryShortNames: categoryShortNames(
    "IA",
    "Ingeniería",
    "Seguridad",
    "Negocios",
    "Tech",
    "Cloud y DevOps",
    "Web3/Crypto",
    "Diseño/UX",
    "Tech emergente",
    "Open Source"
  ),
  welcomeTitle: "Bienvenido a TheNode.tech",
  welcomeSubtitle: "Tu inteligencia tech diaria, entregada.",
  thanksForSigningUp:
    "¡Gracias por registrarte! Cada mañana revisamos cientos de fuentes de noticias tech y usamos IA para extraer lo importante.",
  whatYouGet: "Esto es lo que recibirás en cada edición:",
  deepDivesDesc: "Deep Dives — Análisis experto de las 2-3 mayores historias del día",
  keyStatsDesc: "Cifras clave — Números y datos que debes conocer",
  quickLinksDesc: "Enlaces rápidos — Resúmenes de todo lo demás que vale la pena leer",
  weCover: "Cubrimos 10 categorías del ecosistema tech:",
  headToSettings:
    "Entra en ajustes para elegir categorías, zona horaria y hora de envío. Tu primera newsletter llegará mañana.",
  customizePreferences: "Personalizar preferencias",
  receivingBecauseSignup: "Recibes este correo porque te registraste en TheNode.tech.",
};

const fr: EmailTemplateStrings = {
  ...en,
  authSubject: "Votre lien de connexion TheNode",
  authPreheader: "Touchez le bouton pour vous connecter. Le lien expire dans 15 minutes.",
  authHeaderLabel: "Connexion",
  authTitle: "Connectez-vous à TheNode",
  authBody: "Touchez le bouton ci-dessous pour vous connecter. Le lien expire dans 15 minutes.",
  authButton: "Se connecter",
  authFallback: "Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :",
  authIgnore: "Si vous n'avez pas demandé cet e-mail, ignorez-le. Personne ne peut se connecter sans ce lien.",
  authBlurb: "Vous recevez ceci car quelqu'un a demandé à se connecter à TheNode.tech avec cette adresse.",
  weeklyDigestTitle: "La semaine en revue",
  weeklyDigestOverview: "La semaine écoulée",
  weeklyDigestTrends: "Tendances de fond",
  weeklyDigestTopStories: "À la une",
  weeklyDigestByCategory: "Par catégorie",
  weeklyThreeTrends: "Trois tendances cette semaine",
  weeklyFeedbackQuestion: "La revue de cette semaine vous a été utile ?",
  weeklyKeyNumbers: "Chiffres clés",
  today: "Aujourd'hui",
  dailyDoseOfTech: "Votre dose quotidienne de tech",
  featuredStories: "À la une",
  keyNumbers: "Chiffres clés",
  underTheRadar: "Sous le radar",
  tryThis: "À essayer",
  quoteOfTheDay: "Citation du jour",
  quickLinks: "Liens rapides",
  readOnSite: "Lire en ligne",
  inBrief: "En bref",
  minRead: "{{n}} min de lecture",
  minShort: "{{n}} min",
  readArticle: "Lire l'article →",
  tryItCta: "Découvrir →",
  sourceLabel: "Source",
  feedbackQuestion: "Cette édition vous a été utile ?",
  feedbackHint: "Un clic suffit, ça oriente la prochaine.",
  feedbackYes: "Oui, utile",
  feedbackNo: "Pas vraiment",
  forwardToColleague: "Transférer à un collègue →",
  footerBlurb: "La veille tech, un canal à la fois.",
  receivingBecause:
    "Vous recevez ceci car vous êtes inscrit à la newsletter TheNode.tech.",
  receivingBecauseWeeklyDigest:
    "Vous recevez ceci car vous avez activé la synthèse hebdomadaire.",
  unsubscribe: "Se désabonner",
  managePreferences: "Gérer les préférences",
  subjectFallback: "Votre digest tech quotidien — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "et plus",
  categoryShortNames: categoryShortNames(
    "IA",
    "Ingénierie",
    "Sécurité",
    "Business",
    "Tech",
    "Cloud et DevOps",
    "Web3/Crypto",
    "Design/UX",
    "Tech émergente",
    "Open Source"
  ),
  welcomeTitle: "Bienvenue sur TheNode.tech",
  welcomeSubtitle: "Votre veille tech quotidienne, livrée.",
  thanksForSigningUp:
    "Merci de vous être inscrit ! Chaque matin, nous parcourons des centaines de sources tech et utilisons l'IA pour en extraire l'essentiel.",
  whatYouGet: "Voici ce que vous recevrez dans chaque édition :",
  deepDivesDesc:
    "Deep Dives — Analyse experte des 2-3 plus grandes actualités du jour",
  keyStatsDesc: "Chiffres clés — Données et statistiques à connaître",
  quickLinksDesc: "Liens rapides — Résumés de tout le reste.",
  weCover: "Nous couvrons 10 catégories tech :",
  headToSettings:
    "Allez dans les paramètres pour choisir vos catégories, fuseau et heure d'envoi. Votre première newsletter arrivera demain matin.",
  customizePreferences: "Personnaliser les préférences",
  receivingBecauseSignup:
    "Vous recevez ceci car vous vous êtes inscrit à TheNode.tech.",
};

const de: EmailTemplateStrings = {
  ...en,
  authSubject: "Dein Anmeldelink für TheNode",
  authPreheader: "Tippe auf den Button, um dich anzumelden. Der Link läuft in 15 Minuten ab.",
  authHeaderLabel: "Anmelden",
  authTitle: "Bei TheNode anmelden",
  authBody: "Tippe auf den Button unten, um dich anzumelden. Der Link läuft in 15 Minuten ab.",
  authButton: "Anmelden",
  authFallback: "Button funktioniert nicht? Kopiere diesen Link in deinen Browser:",
  authIgnore: "Wenn du diese E-Mail nicht angefordert hast, ignoriere sie. Ohne den Link kann sich niemand anmelden.",
  authBlurb: "Du erhältst diese E-Mail, weil jemand mit dieser Adresse eine Anmeldung bei TheNode.tech angefordert hat.",
  weeklyDigestTitle: "Wochenrückblick",
  weeklyDigestOverview: "Die Woche im Überblick",
  weeklyDigestTrends: "Übergreifende Trends",
  weeklyDigestTopStories: "Top-Storys",
  weeklyDigestByCategory: "Nach Kategorie",
  weeklyThreeTrends: "Drei Trends dieser Woche",
  weeklyFeedbackQuestion: "War der Wochenrückblick hilfreich?",
  weeklyKeyNumbers: "Wichtige Zahlen",
  today: "Heute",
  dailyDoseOfTech: "Deine tägliche Tech-Dosis",
  featuredStories: "Top-Stories",
  keyNumbers: "Zahlen & Fakten",
  underTheRadar: "Unter dem Radar",
  tryThis: "Probier's",
  quoteOfTheDay: "Zitat des Tages",
  quickLinks: "Schnelllinks",
  readOnSite: "Online lesen",
  inBrief: "Kurz gesagt",
  minRead: "{{n}} Min. Lesezeit",
  minShort: "{{n}} Min.",
  readArticle: "Artikel lesen →",
  tryItCta: "Ansehen →",
  sourceLabel: "Quelle",
  feedbackQuestion: "War diese Ausgabe hilfreich?",
  feedbackHint: "Ein Klick genügt – er prägt die nächste Ausgabe.",
  feedbackYes: "Ja, hilfreich",
  feedbackNo: "Nicht wirklich",
  forwardToColleague: "An Kollegen weiterleiten →",
  footerBlurb: "Tech-News, ein Kanal nach dem anderen.",
  receivingBecause:
    "Du erhältst diese E-Mail, weil du den TheNode.tech-Newsletter abonniert hast.",
  receivingBecauseWeeklyDigest:
    "Du erhältst diese E-Mail, weil du den wöchentlichen Digest aktiviert hast.",
  unsubscribe: "Abmelden",
  managePreferences: "Einstellungen",
  subjectFallback: "Dein täglicher Tech-Überblick — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "& mehr",
  categoryShortNames: categoryShortNames(
    "KI",
    "Engineering",
    "Sicherheit",
    "Business",
    "Tech",
    "Cloud & DevOps",
    "Web3/Crypto",
    "Design/UX",
    "Emerging Tech",
    "Open Source"
  ),
  welcomeTitle: "Willkommen bei TheNode.tech",
  welcomeSubtitle: "Deine tägliche Tech-Intelligenz, geliefert.",
  thanksForSigningUp:
    "Danke für die Anmeldung! Jeden Morgen durchsuchen wir hunderte Tech-Quellen und nutzen KI, um das Wichtigste für dich zu filtern.",
  whatYouGet: "Das erhältst du in jeder Ausgabe:",
  deepDivesDesc:
    "Deep Dives — Expertenanalyse der 2-3 wichtigsten Stories des Tages",
  keyStatsDesc: "Zahlen & Fakten — Wichtige Kennzahlen und Daten",
  quickLinksDesc: "Schnelllinks — Übersichtliche Zusammenfassungen des Rests",
  weCover: "Wir decken 10 Tech-Kategorien ab:",
  headToSettings:
    "Gehe in die Einstellungen, um Kategorien, Zeitzone und Lieferzeit zu wählen. Dein erster Newsletter kommt morgen.",
  customizePreferences: "Einstellungen anpassen",
  receivingBecauseSignup:
    "Du erhältst diese E-Mail, weil du dich bei TheNode.tech angemeldet hast.",
  welcomeSubject: "Willkommen bei TheNode.tech — Dein täglicher Tech-Überblick startet",
};

const ja: EmailTemplateStrings = {
  ...en,
  authSubject: "TheNode のサインインリンク",
  authPreheader: "ボタンをタップしてサインインしてください。リンクの有効期限は15分です。",
  authHeaderLabel: "サインイン",
  authTitle: "TheNode にサインイン",
  authBody: "下のボタンをタップしてサインインしてください。リンクの有効期限は15分です。",
  authButton: "サインイン",
  authFallback: "ボタンが機能しない場合は、このリンクをブラウザに貼り付けてください：",
  authIgnore: "このメールに心当たりがない場合は無視してください。リンクなしでサインインすることはできません。",
  authBlurb: "このアドレスで TheNode.tech へのサインインがリクエストされたため、このメールをお送りしています。",
  weeklyDigestTitle: "週間レビュー",
  weeklyDigestOverview: "今週のまとめ",
  weeklyDigestTrends: "全体のトレンド",
  weeklyDigestTopStories: "トップニュース",
  weeklyDigestByCategory: "カテゴリー別",
  weeklyThreeTrends: "今週の3つのトレンド",
  weeklyFeedbackQuestion: "今週のレビューは役に立ちましたか？",
  weeklyKeyNumbers: "注目の数字",
  today: "今日",
  dailyDoseOfTech: "毎日のテックニュース",
  featuredStories: "注目記事",
  keyNumbers: "重要数字",
  underTheRadar: "アンダー・ザ・レーダー",
  tryThis: "試してみる",
  quoteOfTheDay: "今日の一言",
  quickLinks: "クイックリンク",
  readOnSite: "オンラインで読む",
  inBrief: "要点",
  minRead: "{{n}}分で読めます",
  minShort: "{{n}}分",
  readArticle: "記事を読む →",
  tryItCta: "チェックする →",
  sourceLabel: "出典",
  feedbackQuestion: "この号は役に立ちましたか？",
  feedbackHint: "ワンクリックで次号の改善に役立ちます。",
  feedbackYes: "はい、役立った",
  feedbackNo: "あまり",
  forwardToColleague: "同僚に転送 →",
  footerBlurb: "テックニュースを、チャンネルごとに。",
  receivingBecause:
    "TheNode.techニュースレターに登録いただいたため、このメールをお送りしています。",
  receivingBecauseWeeklyDigest:
    "週次ダイジェストを有効にしたため、このメールをお送りしています。",
  unsubscribe: "配信停止",
  managePreferences: "設定を管理",
  subjectFallback: "本日のテックダイジェスト — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "ほか",
  categoryShortNames: categoryShortNames(
    "AI",
    "エンジニアリング",
    "セキュリティ",
    "ビジネス",
    "テック",
    "クラウド/DevOps",
    "Web3/暗号",
    "デザイン/UX",
    "新興テック",
    "オープンソース"
  ),
  welcomeTitle: "TheNode.techへようこそ",
  welcomeSubtitle: "毎日届くテックインテリジェンス。",
  thanksForSigningUp:
    "ご登録ありがとうございます。毎朝、数百のテックニュースをAIで要約し、重要な情報をお届けします。",
  whatYouGet: "各号の内容：",
  deepDivesDesc: "Deep Dives — その日の重要記事2〜3本の専門家分析",
  keyStatsDesc: "重要数字 — 知っておくべきデータ",
  quickLinksDesc: "クイックリンク — その他の要約",
  weCover: "10カテゴリをカバーしています：",
  headToSettings:
    "設定でカテゴリ・タイムゾーン・配信時刻を選択してください。初回は明日の朝届きます。",
  customizePreferences: "設定をカスタマイズ",
  receivingBecauseSignup:
    "TheNode.techに登録いただいたため、このメールをお送りしています。",
  welcomeSubject: "TheNode.techへようこそ — 毎日のテックダイジェストが始まります",
};

const zh: EmailTemplateStrings = {
  ...en,
  authSubject: "你的 TheNode 登录链接",
  authPreheader: "点击按钮即可登录。链接将在 15 分钟后失效。",
  authHeaderLabel: "登录",
  authTitle: "登录 TheNode",
  authBody: "点击下方按钮即可登录。链接将在 15 分钟后失效。",
  authButton: "登录",
  authFallback: "按钮无法使用？请将此链接复制到浏览器中：",
  authIgnore: "如果你没有请求此邮件，请忽略。没有此链接任何人都无法登录。",
  authBlurb: "你收到此邮件是因为有人使用此地址请求登录 TheNode.tech。",
  weeklyDigestTitle: "一周回顾",
  weeklyDigestOverview: "本周综述",
  weeklyDigestTrends: "整体趋势",
  weeklyDigestTopStories: "头条新闻",
  weeklyDigestByCategory: "按类别",
  weeklyThreeTrends: "本周三大趋势",
  weeklyFeedbackQuestion: "本周回顾对你有帮助吗？",
  weeklyKeyNumbers: "关键数字",
  today: "今天",
  dailyDoseOfTech: "你的每日科技简报",
  featuredStories: "精选报道",
  keyNumbers: "关键数据",
  underTheRadar: "冷门推荐",
  tryThis: "试试这个",
  quoteOfTheDay: "今日金句",
  quickLinks: "快链",
  readOnSite: "在线阅读",
  inBrief: "速览",
  minRead: "阅读约 {{n}} 分钟",
  minShort: "{{n}} 分钟",
  readArticle: "阅读文章 →",
  tryItCta: "去看看 →",
  sourceLabel: "来源",
  feedbackQuestion: "本期内容对你有帮助吗？",
  feedbackHint: "点一下就好，这将影响下一期。",
  feedbackYes: "有帮助",
  feedbackNo: "不太有",
  forwardToColleague: "转发给同事 →",
  footerBlurb: "科技资讯，一次一个频道。",
  receivingBecause: "您收到此邮件是因为订阅了 TheNode.tech 通讯。",
  receivingBecauseWeeklyDigest:
    "您收到此邮件是因为启用了每周摘要。",
  unsubscribe: "退订",
  managePreferences: "管理偏好",
  subjectFallback: "你的每日科技摘要 — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "等",
  categoryShortNames: categoryShortNames(
    "AI",
    "工程",
    "安全",
    "商业",
    "科技",
    "云与DevOps",
    "Web3/加密",
    "设计/UX",
    "新兴科技",
    "开源"
  ),
  welcomeTitle: "欢迎使用 TheNode.tech",
  welcomeSubtitle: "每日科技资讯，准时送达。",
  thanksForSigningUp:
    "感谢订阅！每天早晨，我们会筛选数百个科技来源并用 AI 提炼要点。",
  whatYouGet: "每期内容包含：",
  deepDivesDesc: "深度解读 — 当日 2–3 条重要新闻的专家分析",
  keyStatsDesc: "关键数据 — 值得关注的数据与统计",
  quickLinksDesc: "快链 — 其余内容的简要汇总",
  weCover: "我们覆盖 10 大科技类别：",
  headToSettings:
    "请前往设置选择类别、时区和送达时间。你的第一份通讯将于明日早晨送达。",
  customizePreferences: "自定义偏好",
  receivingBecauseSignup: "您收到此邮件是因为注册了 TheNode.tech。",
};

const pt: EmailTemplateStrings = {
  ...en,
  authSubject: "Seu link de acesso ao TheNode",
  authPreheader: "Toque no botão para entrar. O link expira em 15 minutos.",
  authHeaderLabel: "Entrar",
  authTitle: "Entre no TheNode",
  authBody: "Toque no botão abaixo para entrar. O link expira em 15 minutos.",
  authButton: "Entrar",
  authFallback: "O botão não funciona? Copie e cole este link no navegador:",
  authIgnore: "Se você não pediu este e-mail, ignore-o. Ninguém consegue entrar sem o link.",
  authBlurb: "Você está recebendo isto porque alguém pediu para entrar no TheNode.tech com este endereço.",
  weeklyDigestTitle: "Resumo da semana",
  weeklyDigestOverview: "A semana que passou",
  weeklyDigestTrends: "Tendências gerais",
  weeklyDigestTopStories: "Principais notícias",
  weeklyDigestByCategory: "Por categoria",
  weeklyThreeTrends: "Três tendências da semana",
  weeklyFeedbackQuestion: "O resumo desta semana foi útil?",
  weeklyKeyNumbers: "Números-chave",
  today: "Hoje",
  dailyDoseOfTech: "Sua dose diária de tech",
  featuredStories: "Destaques",
  keyNumbers: "Números-chave",
  underTheRadar: "Under the Radar",
  tryThis: "Experimente",
  quoteOfTheDay: "Citação do dia",
  quickLinks: "Links rápidos",
  readOnSite: "Ler online",
  inBrief: "Em resumo",
  minRead: "{{n}} min de leitura",
  minShort: "{{n}} min",
  readArticle: "Ler o artigo →",
  tryItCta: "Conferir →",
  sourceLabel: "Fonte",
  feedbackQuestion: "Esta edição foi útil?",
  feedbackHint: "Um clique basta — isso orienta a próxima.",
  feedbackYes: "Sim, útil",
  feedbackNo: "Não muito",
  forwardToColleague: "Encaminhar a um colega →",
  footerBlurb: "Notícias de tecnologia, um canal de cada vez.",
  receivingBecause:
    "Você recebe este e-mail porque se inscreveu na newsletter TheNode.tech.",
  receivingBecauseWeeklyDigest:
    "Você recebe este e-mail porque ativou o resumo semanal.",
  unsubscribe: "Cancelar inscrição",
  managePreferences: "Gerenciar preferências",
  subjectFallback: "Seu resumo tech diário — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "e mais",
  categoryShortNames: categoryShortNames(
    "IA",
    "Engenharia",
    "Segurança",
    "Negócios",
    "Tech",
    "Cloud e DevOps",
    "Web3/Crypto",
    "Design/UX",
    "Tech emergente",
    "Open Source"
  ),
  welcomeTitle: "Bem-vindo ao TheNode.tech",
  welcomeSubtitle: "Sua inteligência tech diária, entregue.",
  thanksForSigningUp:
    "Obrigado por se inscrever! Toda manhã analisamos centenas de fontes de notícias tech e usamos IA para extrair o que importa.",
  whatYouGet: "O que você recebe em cada edição:",
  deepDivesDesc:
    "Deep Dives — Análise especializada das 2-3 maiores histórias do dia",
  keyStatsDesc: "Números-chave — Dados e estatísticas que você deve conhecer",
  quickLinksDesc: "Links rápidos — Resumos do resto que vale a pena ler",
  weCover: "Cobrimos 10 categorias de tech:",
  headToSettings:
    "Vá às configurações para escolher categorias, fuso e horário. Sua primeira newsletter chega amanhã.",
  customizePreferences: "Personalizar preferências",
  receivingBecauseSignup:
    "Você recebe este e-mail porque se inscreveu no TheNode.tech.",
};

const it: EmailTemplateStrings = {
  ...en,
  authSubject: "Il tuo link di accesso a TheNode",
  authPreheader: "Tocca il pulsante per accedere. Il link scade tra 15 minuti.",
  authHeaderLabel: "Accedi",
  authTitle: "Accedi a TheNode",
  authBody: "Tocca il pulsante qui sotto per accedere. Il link scade tra 15 minuti.",
  authButton: "Accedi",
  authFallback: "Il pulsante non funziona? Copia e incolla questo link nel browser:",
  authIgnore: "Se non hai richiesto questa email, ignorala. Nessuno può accedere senza il link.",
  authBlurb: "Ricevi questa email perché qualcuno ha chiesto di accedere a TheNode.tech con questo indirizzo.",
  weeklyDigestTitle: "La settimana in rassegna",
  weeklyDigestOverview: "La settimana appena trascorsa",
  weeklyDigestTrends: "Tendenze generali",
  weeklyDigestTopStories: "Notizie principali",
  weeklyDigestByCategory: "Per categoria",
  weeklyThreeTrends: "Tre tendenze della settimana",
  weeklyFeedbackQuestion: "La rassegna di questa settimana ti è stata utile?",
  weeklyKeyNumbers: "Numeri chiave",
  today: "Oggi",
  dailyDoseOfTech: "La tua dose quotidiana di tech",
  featuredStories: "In evidenza",
  keyNumbers: "Cifre chiave",
  underTheRadar: "Sotto il radar",
  tryThis: "Prova questo",
  quoteOfTheDay: "Citazione del giorno",
  quickLinks: "Link rapidi",
  readOnSite: "Leggi online",
  inBrief: "In breve",
  minRead: "{{n}} min di lettura",
  minShort: "{{n}} min",
  readArticle: "Leggi l'articolo →",
  tryItCta: "Scopri →",
  sourceLabel: "Fonte",
  feedbackQuestion: "Questa edizione ti è stata utile?",
  feedbackHint: "Basta un clic: orienta la prossima.",
  feedbackYes: "Sì, utile",
  feedbackNo: "Non proprio",
  forwardToColleague: "Inoltra a un collega →",
  footerBlurb: "Notizie tech, un canale alla volta.",
  receivingBecause:
    "Ricevi questa email perché ti sei iscritto alla newsletter TheNode.tech.",
  receivingBecauseWeeklyDigest:
    "Ricevi questa email perché hai attivato il digest settimanale.",
  unsubscribe: "Annulla iscrizione",
  managePreferences: "Gestisci preferenze",
  subjectFallback: "Il tuo digest tech quotidiano — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "e altro",
  categoryShortNames: categoryShortNames(
    "AI",
    "Ingegneria",
    "Sicurezza",
    "Business",
    "Tech",
    "Cloud e DevOps",
    "Web3/Crypto",
    "Design/UX",
    "Tech emergente",
    "Open Source"
  ),
  welcomeTitle: "Benvenuto su TheNode.tech",
  welcomeSubtitle: "La tua intelligenza tech quotidiana, consegnata.",
  thanksForSigningUp:
    "Grazie per esserti iscritto! Ogni mattina analizziamo centinaia di fonti tech e usiamo l'IA per estrarre l'essenziale.",
  whatYouGet: "Ecco cosa riceverai in ogni edizione:",
  deepDivesDesc:
    "Deep Dives — Analisi esperta delle 2-3 storie più importanti del giorno",
  keyStatsDesc: "Cifre chiave — Dati e statistiche da conoscere",
  quickLinksDesc: "Link rapidi — Riassunti di tutto il resto",
  weCover: "Copriamo 10 categorie tech:",
  headToSettings:
    "Vai nelle impostazioni per scegliere categorie, fuso e orario. La tua prima newsletter arriverà domani mattina.",
  customizePreferences: "Personalizza preferenze",
  receivingBecauseSignup:
    "Ricevi questa email perché ti sei iscritto a TheNode.tech.",
};

const ko: EmailTemplateStrings = {
  ...en,
  authSubject: "TheNode 로그인 링크",
  authPreheader: "버튼을 눌러 로그인하세요. 링크는 15분 후 만료됩니다.",
  authHeaderLabel: "로그인",
  authTitle: "TheNode에 로그인",
  authBody: "아래 버튼을 눌러 로그인하세요. 링크는 15분 후 만료됩니다.",
  authButton: "로그인",
  authFallback: "버튼이 작동하지 않나요? 이 링크를 브라우저에 붙여 넣으세요:",
  authIgnore: "이 이메일을 요청하지 않았다면 무시하세요. 링크 없이는 아무도 로그인할 수 없습니다.",
  authBlurb: "누군가 이 주소로 TheNode.tech 로그인을 요청해 이 이메일을 보내드렸습니다.",
  weeklyDigestTitle: "주간 리뷰",
  weeklyDigestOverview: "이번 주 요약",
  weeklyDigestTrends: "전반적인 트렌드",
  weeklyDigestTopStories: "주요 뉴스",
  weeklyDigestByCategory: "카테고리별",
  weeklyThreeTrends: "이번 주 3대 트렌드",
  weeklyFeedbackQuestion: "이번 주 리뷰가 도움이 되었나요?",
  weeklyKeyNumbers: "주요 수치",
  today: "오늘",
  dailyDoseOfTech: "매일 전달되는 테크 브리핑",
  featuredStories: "주요 기사",
  keyNumbers: "핵심 숫자",
  underTheRadar: "숨은 보석",
  tryThis: "한번 써보기",
  quoteOfTheDay: "오늘의 한마디",
  quickLinks: "퀵 링크",
  readOnSite: "온라인에서 읽기",
  inBrief: "한눈에 보기",
  minRead: "{{n}}분 소요",
  minShort: "{{n}}분",
  readArticle: "기사 읽기 →",
  tryItCta: "확인하기 →",
  sourceLabel: "출처",
  feedbackQuestion: "이번 호가 도움이 되었나요?",
  feedbackHint: "클릭 한 번이면 다음 호에 반영됩니다.",
  feedbackYes: "네, 유용했어요",
  feedbackNo: "별로요",
  forwardToColleague: "동료에게 전달 →",
  footerBlurb: "테크 뉴스, 한 번에 한 채널씩.",
  receivingBecause:
    "TheNode.tech 뉴스레터에 구독하신 관계로 이 메일을 보내드립니다.",
  receivingBecauseWeeklyDigest:
    "주간 다이제스트를 켜 두셨기에 이 메일을 보내드립니다.",
  unsubscribe: "구독 취소",
  managePreferences: "설정 관리",
  subjectFallback: "오늘의 테크 다이제스트 — {{date}}",
  subjectWithTopics: "{{topics}} — {{date}}",
  subjectWithHeadline: "{{headline}} — {{date}}",
  andMore: "외",
  categoryShortNames: categoryShortNames(
    "AI",
    "엔지니어링",
    "보안",
    "비즈니스",
    "테크",
    "클라우드/DevOps",
    "Web3/크립토",
    "디자인/UX",
    "신흥 테크",
    "오픈소스"
  ),
  welcomeTitle: "TheNode.tech에 오신 것을 환영합니다",
  welcomeSubtitle: "매일 전달되는 테크 인텔리전스.",
  thanksForSigningUp:
    "가입해 주셔서 감사합니다. 매일 아침 수백 개의 테크 소스를 AI로 요약해 전달합니다.",
  whatYouGet: "매 호 포함 내용:",
  deepDivesDesc: "딥 다이브 — 당일 2–3개 주요 기사 전문가 분석",
  keyStatsDesc: "핵심 숫자 — 알아두어야 할 데이터",
  quickLinksDesc: "퀵 링크 — 나머지 요약",
  weCover: "10개 카테고리를 다룹니다:",
  headToSettings:
    "설정에서 카테고리, 시간대, 수신 시간을 선택하세요. 첫 뉴스레터는 내일 아침 도착합니다.",
  customizePreferences: "설정 맞춤",
  receivingBecauseSignup:
    "TheNode.tech에 가입하신 관계로 이 메일을 보내드립니다.",
};

const emailTranslations: Record<EmailLocale, EmailTemplateStrings> = {
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

const VALID_LOCALES: EmailLocale[] = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "zh",
  "pt",
  "it",
  "ko",
];

const VALID_LOCALE_SET = new Set<string>(VALID_LOCALES);

/** Locale-prefixed origin for links in emails (keeps #hash on settings URLs). */
export function siteBaseUrlForEmailLocale(language: string): string {
  const raw = language && typeof language === "string" ? language : "en";
  const key = raw.split(/[-_]/)[0].toLowerCase();
  const loc = VALID_LOCALE_SET.has(key) ? key : "en";
  return `https://thenode.tech/${loc}`;
}

export function getEmailTranslations(locale: string): EmailTemplateStrings {
  const raw = locale && typeof locale === "string" ? locale : "en";
  const key = raw.split(/[-_]/)[0].toLowerCase();
  if (VALID_LOCALES.includes(key as EmailLocale)) {
    return emailTranslations[key as EmailLocale];
  }
  return en;
}
