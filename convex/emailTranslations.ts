/**
 * Email template translations for Convex actions (newsletter, welcome, premium, cancellation).
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
  quickLinks: string;
  readOnSite: string;
  receivingBecause: string;
  unsubscribe: string;
  managePreferences: string;
  upgradeToPremium: string;
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
  // Premium welcome
  premiumWelcomeTitle: string;
  premiumWelcomeSubtitle: string;
  premiumThanks: string;
  premiumUnlocked: string;
  customDeliveryTime: string;
  multiLanguageSupport: string;
  priorityContent: string;
  configurePremium: string;
  receivingBecauseUpgrade: string;
  premiumWelcomeSubject: string;
  // Cancellation
  cancellationTitle: string;
  cancellationSubtitle: string;
  cancellationWhatChanges: string;
  keepReceiving: string;
  deliveryReverts: string;
  languageReverts: string;
  freeContinues: string;
  resubscribe: string;
  receivingBecauseCancelled: string;
  cancellationSubject: string;
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
  quickLinks: "Quick Links",
  readOnSite: "Read on TheNode.tech",
  receivingBecause:
    "You're receiving this because you subscribed to TheNode.tech newsletter.",
  unsubscribe: "Unsubscribe",
  managePreferences: "Manage preferences",
  upgradeToPremium: "Upgrade to Premium",
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
  premiumWelcomeTitle: "Welcome to Premium!",
  premiumWelcomeSubtitle: "Thank you for upgrading your TheNode.tech experience.",
  premiumThanks: "You now have access to the full premium experience. Here's what's unlocked:",
  premiumUnlocked: "",
  customDeliveryTime:
    "Custom Delivery Time — Choose the exact hour you want your newsletter delivered",
  multiLanguageSupport:
    "Multi-Language Support — Receive your digest in your preferred language",
  priorityContent:
    "Priority Content — Get deeper analysis and more detailed coverage",
  configurePremium: "Configure Premium Settings",
  receivingBecauseUpgrade:
    "You're receiving this because you upgraded to TheNode.tech Premium.",
  premiumWelcomeSubject: "Welcome to Premium — Your upgraded experience starts now",
  cancellationTitle: "Subscription Cancelled",
  cancellationSubtitle: "We're sorry to see you go.",
  cancellationWhatChanges:
    "Your premium subscription has been cancelled. Here's what changes:",
  keepReceiving:
    "You'll keep receiving your daily newsletter with all your selected categories",
  deliveryReverts: "Delivery window reverts to the default 8 AM in your timezone",
  languageReverts: "Language will revert to English",
  freeContinues:
    "Your free newsletter will continue without interruption. If you change your mind, you can re-subscribe at any time.",
  resubscribe: "Re-subscribe to Premium",
  receivingBecauseCancelled:
    "You're receiving this because your TheNode.tech Premium subscription was cancelled.",
  cancellationSubject: "Your Premium subscription has been cancelled",
};

const es: EmailTemplateStrings = {
  ...en,
  today: "Hoy",
  dailyDoseOfTech: "Tu dosis diaria de tech",
  featuredStories: "Historias destacadas",
  keyNumbers: "Cifras clave",
  quickLinks: "Enlaces rápidos",
  readOnSite: "Leer en TheNode.tech",
  receivingBecause:
    "Recibes este correo porque te suscribiste al newsletter de TheNode.tech.",
  unsubscribe: "Darse de baja",
  managePreferences: "Gestionar preferencias",
  upgradeToPremium: "Pasar a Premium",
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
  premiumWelcomeTitle: "¡Bienvenido a Premium!",
  premiumWelcomeSubtitle: "Gracias por mejorar tu experiencia TheNode.tech.",
  premiumThanks:
    "Ahora tienes acceso a la experiencia premium. Esto es lo que se desbloquea:",
  customDeliveryTime:
    "Hora de envío — Elige la hora exacta para recibir tu newsletter",
  multiLanguageSupport:
    "Idioma — Recibe el resumen en tu idioma preferido",
  priorityContent:
    "Contenido prioritario — Análisis más profundo y cobertura detallada",
  configurePremium: "Configurar Premium",
  receivingBecauseUpgrade:
    "Recibes este correo porque pasaste a TheNode.tech Premium.",
  cancellationTitle: "Suscripción cancelada",
  cancellationSubtitle: "Lamentamos que te vayas.",
  cancellationWhatChanges:
    "Tu suscripción premium ha sido cancelada. Cambios:",
  keepReceiving:
    "Seguirás recibiendo tu newsletter diaria con tus categorías seleccionadas",
  deliveryReverts: "La entrega vuelve a las 8:00 en tu zona horaria",
  languageReverts: "El idioma volverá a ser inglés",
  freeContinues:
    "Tu newsletter gratuita continuará sin interrupciones. Puedes volver a suscribirte cuando quieras.",
  resubscribe: "Volver a Premium",
  receivingBecauseCancelled:
    "Recibes este correo porque tu suscripción Premium fue cancelada.",
};

const fr: EmailTemplateStrings = {
  ...en,
  today: "Aujourd'hui",
  dailyDoseOfTech: "Votre dose quotidienne de tech",
  featuredStories: "À la une",
  keyNumbers: "Chiffres clés",
  quickLinks: "Liens rapides",
  readOnSite: "Lire sur TheNode.tech",
  receivingBecause:
    "Vous recevez ceci car vous êtes inscrit à la newsletter TheNode.tech.",
  unsubscribe: "Se désabonner",
  managePreferences: "Gérer les préférences",
  upgradeToPremium: "Passer à Premium",
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
  premiumWelcomeTitle: "Bienvenue en Premium !",
  premiumWelcomeSubtitle: "Merci d'avoir amélioré votre expérience TheNode.tech.",
  premiumThanks:
    "Vous avez maintenant accès à l'expérience premium. Voici ce qui est débloqué :",
  customDeliveryTime:
    "Heure d'envoi — Choisissez l'heure exacte de réception",
  multiLanguageSupport:
    "Langue — Recevez le digest dans votre langue préférée",
  priorityContent:
    "Contenu prioritaire — Analyses plus approfondies et couverture détaillée",
  configurePremium: "Configurer Premium",
  receivingBecauseUpgrade:
    "Vous recevez ceci car vous êtes passé à TheNode.tech Premium.",
  cancellationTitle: "Abonnement annulé",
  cancellationSubtitle: "Nous sommes désolés de vous voir partir.",
  cancellationWhatChanges:
    "Votre abonnement premium a été annulé. Voici les changements :",
  keepReceiving:
    "Vous continuerez à recevoir la newsletter quotidienne avec vos catégories",
  deliveryReverts: "L'envoi revient à 8h dans votre fuseau",
  languageReverts: "La langue repasse à l'anglais",
  freeContinues:
    "Votre newsletter gratuite continue sans interruption. Vous pouvez vous réabonner à tout moment.",
  resubscribe: "Réabonnement Premium",
  receivingBecauseCancelled:
    "Vous recevez ceci car votre abonnement Premium a été annulé.",
};

const de: EmailTemplateStrings = {
  ...en,
  today: "Heute",
  dailyDoseOfTech: "Deine tägliche Tech-Dosis",
  featuredStories: "Top-Stories",
  keyNumbers: "Zahlen & Fakten",
  quickLinks: "Schnelllinks",
  readOnSite: "Auf TheNode.tech lesen",
  receivingBecause:
    "Du erhältst diese E-Mail, weil du den TheNode.tech-Newsletter abonniert hast.",
  unsubscribe: "Abmelden",
  managePreferences: "Einstellungen",
  upgradeToPremium: "Auf Premium upgraden",
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
  premiumWelcomeTitle: "Willkommen bei Premium!",
  premiumWelcomeSubtitle: "Danke, dass du dein TheNode.tech-Erlebnis verbessert hast.",
  premiumThanks:
    "Du hast jetzt Zugang zur vollen Premium-Erfahrung. Das ist freigeschaltet:",
  customDeliveryTime:
    "Lieferzeit — Wähle die genaue Stunde für deinen Newsletter",
  multiLanguageSupport:
    "Sprache — Erhalte den Digest in deiner bevorzugten Sprache",
  priorityContent:
    "Prioritäts-Inhalte — Tiefere Analysen und detaillierte Berichterstattung",
  configurePremium: "Premium einrichten",
  receivingBecauseUpgrade:
    "Du erhältst diese E-Mail, weil du auf TheNode.tech Premium upgegradet hast.",
  cancellationTitle: "Abonnement gekündigt",
  cancellationSubtitle: "Schade, dass du gehst.",
  cancellationWhatChanges:
    "Dein Premium-Abonnement wurde gekündigt. Das ändert sich:",
  keepReceiving:
    "Du erhältst weiterhin deinen täglichen Newsletter mit allen gewählten Kategorien",
  deliveryReverts: "Die Lieferung kehrt zu 8 Uhr in deiner Zeitzone zurück",
  languageReverts: "Die Sprache wechselt zurück auf Englisch",
  freeContinues:
    "Dein kostenloser Newsletter läuft unverändert weiter. Du kannst jederzeit wieder upgraden.",
  resubscribe: "Wieder zu Premium",
  receivingBecauseCancelled:
    "Du erhältst diese E-Mail, weil dein TheNode.tech Premium-Abonnement gekündigt wurde.",
  welcomeSubject: "Willkommen bei TheNode.tech — Dein täglicher Tech-Überblick startet",
  premiumWelcomeSubject: "Willkommen bei Premium — Dein Upgrade startet",
  cancellationSubject: "Dein Premium-Abonnement wurde gekündigt",
};

const ja: EmailTemplateStrings = {
  ...en,
  today: "今日",
  dailyDoseOfTech: "毎日のテックニュース",
  featuredStories: "注目記事",
  keyNumbers: "重要数字",
  quickLinks: "クイックリンク",
  readOnSite: "TheNode.techで読む",
  receivingBecause:
    "TheNode.techニュースレターに登録いただいたため、このメールをお送りしています。",
  unsubscribe: "配信停止",
  managePreferences: "設定を管理",
  upgradeToPremium: "プレミアムへ",
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
  premiumWelcomeTitle: "プレミアムへようこそ！",
  premiumWelcomeSubtitle: "TheNode.techプレミアムへのアップグレードありがとうございます。",
  premiumThanks: "プレミアムの全機能が利用可能です：",
  customDeliveryTime: "配信時刻 — 希望の時間に配信",
  multiLanguageSupport: "多言語 — 希望の言語でダイジェストを受信",
  priorityContent: "優先コンテンツ — より深い分析と詳細な報道",
  configurePremium: "プレミアム設定",
  receivingBecauseUpgrade:
    "TheNode.techプレミアムにアップグレードいただいたため、このメールをお送りしています。",
  cancellationTitle: "サブスクリプション解約",
  cancellationSubtitle: "解約いただき残念です。",
  cancellationWhatChanges: "プレミアムを解約しました。変更点：",
  keepReceiving: "選択したカテゴリの日刊ニュースレターは引き続き届きます",
  deliveryReverts: "配信はデフォルトの午前8時（お住まいのタイムゾーン）に戻ります",
  languageReverts: "言語は英語に戻ります",
  freeContinues:
    "無料ニュースレターは引き続き届きます。いつでも再登録できます。",
  resubscribe: "プレミアムに再登録",
  receivingBecauseCancelled:
    "TheNode.techプレミアムを解約いただいたため、このメールをお送りしています。",
  premiumWelcomeSubject: "プレミアムへようこそ — アップグレード体験が始まります",
  cancellationSubject: "プレミアムサブスクリプションが解約されました",
};

const zh: EmailTemplateStrings = {
  ...en,
  today: "今天",
  dailyDoseOfTech: "你的每日科技简报",
  featuredStories: "精选报道",
  keyNumbers: "关键数据",
  quickLinks: "快链",
  readOnSite: "在 TheNode.tech 阅读",
  receivingBecause: "您收到此邮件是因为订阅了 TheNode.tech 通讯。",
  unsubscribe: "退订",
  managePreferences: "管理偏好",
  upgradeToPremium: "升级到高级版",
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
  premiumWelcomeTitle: "欢迎使用高级版！",
  premiumWelcomeSubtitle: "感谢升级你的 TheNode.tech 体验。",
  premiumThanks: "你已解锁完整高级体验，包括：",
  customDeliveryTime: "自定义送达时间 — 选择每日收信时间",
  multiLanguageSupport: "多语言 — 以你选择的语言接收摘要",
  priorityContent: "优先内容 — 更深入的分析与更详尽的报道",
  configurePremium: "配置高级版",
  receivingBecauseUpgrade: "您收到此邮件是因为升级到了 TheNode.tech 高级版。",
  cancellationTitle: "订阅已取消",
  cancellationSubtitle: "很遗憾看到你离开。",
  cancellationWhatChanges: "你的高级订阅已取消。变更如下：",
  keepReceiving: "你仍将收到每日通讯及已选类别",
  deliveryReverts: "送达时间恢复为当地时间早上 8 点",
  languageReverts: "语言将恢复为英语",
  freeContinues: "免费通讯将照常送达。如需可随时重新订阅高级版。",
  resubscribe: "重新订阅高级版",
  receivingBecauseCancelled:
    "您收到此邮件是因为你的 TheNode.tech 高级订阅已取消。",
};

const pt: EmailTemplateStrings = {
  ...en,
  today: "Hoje",
  dailyDoseOfTech: "Sua dose diária de tech",
  featuredStories: "Destaques",
  keyNumbers: "Números-chave",
  quickLinks: "Links rápidos",
  readOnSite: "Ler no TheNode.tech",
  receivingBecause:
    "Você recebe este e-mail porque se inscreveu na newsletter TheNode.tech.",
  unsubscribe: "Cancelar inscrição",
  managePreferences: "Gerenciar preferências",
  upgradeToPremium: "Fazer upgrade para Premium",
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
  premiumWelcomeTitle: "Bem-vindo ao Premium!",
  premiumWelcomeSubtitle: "Obrigado por fazer upgrade no TheNode.tech.",
  premiumThanks:
    "Você agora tem acesso à experiência premium. O que está desbloqueado:",
  customDeliveryTime:
    "Horário de entrega — Escolha a hora exata para receber a newsletter",
  multiLanguageSupport:
    "Idioma — Receba o resumo no seu idioma preferido",
  priorityContent:
    "Conteúdo prioritário — Análises mais profundas e cobertura detalhada",
  configurePremium: "Configurar Premium",
  receivingBecauseUpgrade:
    "Você recebe este e-mail porque fez upgrade para TheNode.tech Premium.",
  cancellationTitle: "Assinatura cancelada",
  cancellationSubtitle: "Sentiremos sua falta.",
  cancellationWhatChanges:
    "Sua assinatura premium foi cancelada. O que muda:",
  keepReceiving:
    "Você continua recebendo a newsletter diária com suas categorias",
  deliveryReverts: "A entrega volta às 8h no seu fuso",
  languageReverts: "O idioma volta para inglês",
  freeContinues:
    "Sua newsletter gratuita continua sem interrupção. Você pode se reinscrever quando quiser.",
  resubscribe: "Reinscrever-se no Premium",
  receivingBecauseCancelled:
    "Você recebe este e-mail porque sua assinatura Premium foi cancelada.",
};

const it: EmailTemplateStrings = {
  ...en,
  today: "Oggi",
  dailyDoseOfTech: "La tua dose quotidiana di tech",
  featuredStories: "In evidenza",
  keyNumbers: "Cifre chiave",
  quickLinks: "Link rapidi",
  readOnSite: "Leggi su TheNode.tech",
  receivingBecause:
    "Ricevi questa email perché ti sei iscritto alla newsletter TheNode.tech.",
  unsubscribe: "Annulla iscrizione",
  managePreferences: "Gestisci preferenze",
  upgradeToPremium: "Passa a Premium",
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
  premiumWelcomeTitle: "Benvenuto in Premium!",
  premiumWelcomeSubtitle: "Grazie per aver migliorato la tua esperienza TheNode.tech.",
  premiumThanks:
    "Ora hai accesso all'esperienza premium. Ecco cosa si sblocca:",
  customDeliveryTime:
    "Orario di consegna — Scegli l'ora esatta per ricevere la newsletter",
  multiLanguageSupport:
    "Lingua — Ricevi il digest nella tua lingua preferita",
  priorityContent:
    "Contenuti prioritari — Analisi più approfondite e copertura dettagliata",
  configurePremium: "Configura Premium",
  receivingBecauseUpgrade:
    "Ricevi questa email perché sei passato a TheNode.tech Premium.",
  cancellationTitle: "Abbonamento annullato",
  cancellationSubtitle: "Ci dispiace vederti andar via.",
  cancellationWhatChanges:
    "Il tuo abbonamento premium è stato annullato. Ecco cosa cambia:",
  keepReceiving:
    "Continuerai a ricevere la newsletter quotidiana con le tue categorie",
  deliveryReverts: "La consegna torna alle 8:00 nel tuo fuso",
  languageReverts: "La lingua tornerà all'inglese",
  freeContinues:
    "La tua newsletter gratuita continua senza interruzioni. Puoi riabbonarti quando vuoi.",
  resubscribe: "Riabbonati a Premium",
  receivingBecauseCancelled:
    "Ricevi questa email perché il tuo abbonamento Premium è stato annullato.",
};

const ko: EmailTemplateStrings = {
  ...en,
  today: "오늘",
  dailyDoseOfTech: "매일 전달되는 테크 브리핑",
  featuredStories: "주요 기사",
  keyNumbers: "핵심 숫자",
  quickLinks: "퀵 링크",
  readOnSite: "TheNode.tech에서 읽기",
  receivingBecause:
    "TheNode.tech 뉴스레터에 구독하신 관계로 이 메일을 보내드립니다.",
  unsubscribe: "구독 취소",
  managePreferences: "설정 관리",
  upgradeToPremium: "프리미엄 업그레이드",
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
  premiumWelcomeTitle: "프리미엄에 오신 것을 환영합니다!",
  premiumWelcomeSubtitle: "TheNode.tech 프리미엄 업그레이드 감사합니다.",
  premiumThanks: "이제 프리미엄 전체 기능을 이용하실 수 있습니다:",
  customDeliveryTime: "수신 시간 — 원하는 시간에 뉴스레터 수신",
  multiLanguageSupport: "다국어 — 선호 언어로 다이제스트 수신",
  priorityContent: "우선 콘텐츠 — 더 깊은 분석과 상세 보도",
  configurePremium: "프리미엄 설정",
  receivingBecauseUpgrade:
    "TheNode.tech 프리미엄으로 업그레이드하신 관계로 이 메일을 보내드립니다.",
  cancellationTitle: "구독 취소됨",
  cancellationSubtitle: "이별이 아쉽습니다.",
  cancellationWhatChanges: "프리미엄 구독이 취소되었습니다. 변경 사항:",
  keepReceiving: "선택한 카테고리의 일간 뉴스레터는 계속 수신됩니다",
  deliveryReverts: "수신 시간은 기본 현지 오전 8시로 돌아갑니다",
  languageReverts: "언어는 영어로 돌아갑니다",
  freeContinues:
    "무료 뉴스레터는 그대로 계속됩니다. 언제든 다시 구독할 수 있습니다.",
  resubscribe: "프리미엄 재구독",
  receivingBecauseCancelled:
    "TheNode.tech 프리미엄 구독이 취소된 관계로 이 메일을 보내드립니다.",
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

export function getEmailTranslations(locale: string): EmailTemplateStrings {
  const raw = locale && typeof locale === "string" ? locale : "en";
  const key = raw.split(/[-_]/)[0].toLowerCase();
  if (VALID_LOCALES.includes(key as EmailLocale)) {
    return emailTranslations[key as EmailLocale];
  }
  return en;
}
