// SEO-facing copy: page titles/descriptions and issue-page labels.
// Placeholders: {name} channel name, {short} short name, {date} formatted date.
import type { Locale } from "./locales";

export interface SeoStrings {
  hubTitle: string;
  hubDescription: string;
  issueTitle: string;
  homeTitle: string;
  inBrief: string;
  topStories: string;
  keyNumbers: string;
  quickLinks: string;
  readSource: string;
  source: string;
  prevIssue: string;
  nextIssue: string;
  olderIssues: string;
  newerIssues: string;
  allIssues: string;
  subscribeCta: string;
  subscribeCtaBody: string;
  about: string;
  rss: string;
}

const en: SeoStrings = {
  hubTitle: "{name} newsletter — daily {short} news in 5 minutes | TheNode",
  hubDescription: "{name}: the stories that matter today, summarized by AI from 275+ sources. Free daily email, 5-minute read.",
  issueTitle: "{title} — {short} news, {date} | TheNode",
  homeTitle: "TheNode — Daily tech news summarized by AI, in 5 minutes",
  inBrief: "In brief",
  topStories: "Top stories",
  keyNumbers: "Key numbers",
  quickLinks: "Quick links",
  readSource: "Read the source",
  source: "Source",
  prevIssue: "Previous issue",
  nextIssue: "Next issue",
  olderIssues: "Older issues",
  newerIssues: "Newer issues",
  allIssues: "All {short} issues",
  subscribeCta: "Get {short} in your inbox every morning",
  subscribeCtaBody: "Free daily email. Five minutes. Unsubscribe anytime.",
  about: "About",
  rss: "RSS feed",
};

const fr: SeoStrings = {
  hubTitle: "Newsletter {name} — l'actu {short} en français, en 5 minutes | TheNode",
  hubDescription: "{name} : l'essentiel du jour, résumé par l'IA à partir de 275+ sources. Newsletter quotidienne gratuite, 5 minutes de lecture.",
  issueTitle: "{title} — actu {short} du {date} | TheNode",
  homeTitle: "TheNode — La veille tech quotidienne résumée par l'IA, en 5 minutes",
  inBrief: "En bref",
  topStories: "À la une",
  keyNumbers: "Chiffres clés",
  quickLinks: "Liens rapides",
  readSource: "Lire la source",
  source: "Source",
  prevIssue: "Édition précédente",
  nextIssue: "Édition suivante",
  olderIssues: "Éditions plus anciennes",
  newerIssues: "Éditions plus récentes",
  allIssues: "Toutes les éditions {short}",
  subscribeCta: "Recevez {short} chaque matin",
  subscribeCtaBody: "Newsletter quotidienne gratuite. Cinq minutes. Désabonnement en un clic.",
  about: "À propos",
  rss: "Flux RSS",
};

const es: SeoStrings = {
  ...en,
  hubTitle: "Newsletter de {name} — noticias de {short} en 5 minutos | TheNode",
  hubDescription: "{name}: lo más importante del día, resumido por IA a partir de más de 275 fuentes. Email diario gratuito, 5 minutos de lectura.",
  issueTitle: "{title} — noticias de {short}, {date} | TheNode",
  homeTitle: "TheNode — Noticias tecnológicas diarias resumidas por IA, en 5 minutos",
  inBrief: "En resumen", topStories: "Destacados", keyNumbers: "Cifras clave", quickLinks: "Enlaces rápidos",
  readSource: "Leer la fuente", source: "Fuente", prevIssue: "Edición anterior", nextIssue: "Edición siguiente",
  olderIssues: "Ediciones anteriores", newerIssues: "Ediciones más recientes", allIssues: "Todas las ediciones de {short}",
  subscribeCta: "Recibe {short} cada mañana", subscribeCtaBody: "Email diario gratuito. Cinco minutos. Date de baja cuando quieras.",
  about: "Acerca de", rss: "Feed RSS",
};

const de: SeoStrings = {
  ...en,
  hubTitle: "{name}-Newsletter — tägliche {short}-News in 5 Minuten | TheNode",
  hubDescription: "{name}: die wichtigsten Nachrichten des Tages, von KI aus über 275 Quellen zusammengefasst. Kostenlose tägliche E-Mail, 5 Minuten Lesezeit.",
  issueTitle: "{title} — {short}-News vom {date} | TheNode",
  homeTitle: "TheNode — Tägliche Tech-News, von KI zusammengefasst, in 5 Minuten",
  inBrief: "Kurz gesagt", topStories: "Top-Themen", keyNumbers: "Zahlen des Tages", quickLinks: "Schnelle Links",
  readSource: "Zur Quelle", source: "Quelle", prevIssue: "Vorherige Ausgabe", nextIssue: "Nächste Ausgabe",
  olderIssues: "Ältere Ausgaben", newerIssues: "Neuere Ausgaben", allIssues: "Alle {short}-Ausgaben",
  subscribeCta: "{short} jeden Morgen im Postfach", subscribeCtaBody: "Kostenlose tägliche E-Mail. Fünf Minuten. Jederzeit abbestellbar.",
  about: "Über uns", rss: "RSS-Feed",
};

const it: SeoStrings = {
  ...en,
  hubTitle: "Newsletter {name} — notizie {short} quotidiane in 5 minuti | TheNode",
  hubDescription: "{name}: le notizie che contano oggi, riassunte dall'IA da oltre 275 fonti. Email quotidiana gratuita, 5 minuti di lettura.",
  issueTitle: "{title} — notizie {short} del {date} | TheNode",
  homeTitle: "TheNode — Notizie tech quotidiane riassunte dall'IA, in 5 minuti",
  inBrief: "In breve", topStories: "In primo piano", keyNumbers: "Numeri chiave", quickLinks: "Link rapidi",
  readSource: "Leggi la fonte", source: "Fonte", prevIssue: "Numero precedente", nextIssue: "Numero successivo",
  olderIssues: "Numeri precedenti", newerIssues: "Numeri più recenti", allIssues: "Tutti i numeri {short}",
  subscribeCta: "Ricevi {short} ogni mattina", subscribeCtaBody: "Email quotidiana gratuita. Cinque minuti. Disiscriviti quando vuoi.",
  about: "Chi siamo", rss: "Feed RSS",
};

const pt: SeoStrings = {
  ...en,
  hubTitle: "Newsletter de {name} — notícias de {short} em 5 minutos | TheNode",
  hubDescription: "{name}: o que importa hoje, resumido por IA a partir de mais de 275 fontes. E-mail diário gratuito, 5 minutos de leitura.",
  issueTitle: "{title} — notícias de {short}, {date} | TheNode",
  homeTitle: "TheNode — Notícias de tecnologia diárias resumidas por IA, em 5 minutos",
  inBrief: "Em resumo", topStories: "Destaques", keyNumbers: "Números-chave", quickLinks: "Links rápidos",
  readSource: "Ler a fonte", source: "Fonte", prevIssue: "Edição anterior", nextIssue: "Próxima edição",
  olderIssues: "Edições anteriores", newerIssues: "Edições mais recentes", allIssues: "Todas as edições de {short}",
  subscribeCta: "Receba {short} toda manhã", subscribeCtaBody: "E-mail diário gratuito. Cinco minutos. Cancele quando quiser.",
  about: "Sobre", rss: "Feed RSS",
};

const ja: SeoStrings = {
  ...en,
  hubTitle: "{name} ニュースレター — 毎日の{short}ニュースを5分で | TheNode",
  hubDescription: "{name}：今日押さえるべきニュースを、275以上の情報源からAIが要約。無料の日刊メール、5分で読めます。",
  issueTitle: "{title} — {short}ニュース {date} | TheNode",
  homeTitle: "TheNode — AIが要約する毎日のテックニュースを5分で",
  inBrief: "要点", topStories: "トップニュース", keyNumbers: "注目の数字", quickLinks: "クイックリンク",
  readSource: "元記事を読む", source: "出典", prevIssue: "前の号", nextIssue: "次の号",
  olderIssues: "過去の号", newerIssues: "新しい号", allIssues: "{short}のすべての号",
  subscribeCta: "毎朝{short}をメールで受け取る", subscribeCtaBody: "無料の日刊メール。5分。いつでも配信停止できます。",
  about: "TheNodeについて", rss: "RSSフィード",
};

const zh: SeoStrings = {
  ...en,
  hubTitle: "{name}简报 — 5分钟读懂每日{short}资讯 | TheNode",
  hubDescription: "{name}：AI 从 275+ 个来源为你总结今日要闻。免费每日邮件，5 分钟读完。",
  issueTitle: "{title} — {date} {short}资讯 | TheNode",
  homeTitle: "TheNode — AI 总结的每日科技资讯，5 分钟读完",
  inBrief: "要点速览", topStories: "头条", keyNumbers: "关键数字", quickLinks: "快速链接",
  readSource: "阅读原文", source: "来源", prevIssue: "上一期", nextIssue: "下一期",
  olderIssues: "更早的期刊", newerIssues: "更新的期刊", allIssues: "全部{short}期刊",
  subscribeCta: "每天早上收到{short}", subscribeCtaBody: "免费每日邮件。5 分钟。随时退订。",
  about: "关于", rss: "RSS 订阅",
};

const ko: SeoStrings = {
  ...en,
  hubTitle: "{name} 뉴스레터 — 매일 5분 {short} 뉴스 | TheNode",
  hubDescription: "{name}: 275개 이상의 출처에서 AI가 요약한 오늘의 핵심 뉴스. 무료 데일리 이메일, 5분이면 충분합니다.",
  issueTitle: "{title} — {date} {short} 뉴스 | TheNode",
  homeTitle: "TheNode — AI가 요약한 매일의 테크 뉴스, 5분이면 충분",
  inBrief: "한눈에", topStories: "주요 뉴스", keyNumbers: "핵심 숫자", quickLinks: "빠른 링크",
  readSource: "원문 읽기", source: "출처", prevIssue: "이전 호", nextIssue: "다음 호",
  olderIssues: "이전 호 보기", newerIssues: "최신 호 보기", allIssues: "{short} 전체 호",
  subscribeCta: "매일 아침 {short} 받아보기", subscribeCtaBody: "무료 데일리 이메일. 5분. 언제든 구독 해지 가능.",
  about: "소개", rss: "RSS 피드",
};

const ALL: Record<Locale, SeoStrings> = { en, fr, es, de, it, pt, ja, zh, ko };

export function getSeoStrings(locale: Locale): SeoStrings {
  return ALL[locale] ?? en;
}
