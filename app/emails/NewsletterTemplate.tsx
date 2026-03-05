import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
  Img,
} from "@react-email/components";

interface ArticleProps {
  title: string;
  url: string;
  summary: string;
  source?: string;
}

interface CategorySectionProps {
  name: string;
  icon: string;
  articles: ArticleProps[];
  overview?: string;
}

interface NewsletterTemplateProps {
  date: string;
  categories: CategorySectionProps[];
  unsubscribeUrl?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  ai: "🤖",
  eng: "⚙️",
  sec: "🔒",
  biz: "💼",
  tech: "📱",
  "cloud-devops": "☁️",
  "web3-crypto": "🔗",
  "design-ux-frontend": "🎨",
  "emerging-tech-science": "🔬",
  "opensource-languages": "📦",
};

export default function NewsletterTemplate({
  date = "February 19, 2026",
  categories = [],
  unsubscribeUrl = "https://thenode.tech/unsubscribe",
}: NewsletterTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>⚡ TheNode.tech — {date} — Your daily dose of tech</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>⚡ TheNode.tech</Heading>
            <Text style={dateText}>{date} — Your daily dose of tech</Text>
          </Section>

          {/* Category Sections */}
          {categories.map((category, catIdx) => (
            <Section key={catIdx} style={categorySection}>
              <Heading as="h2" style={categoryTitle}>
                {category.icon} {category.name}
              </Heading>
              {category.overview && (
                <Text style={overviewText}>{category.overview}</Text>
              )}
              {category.articles.map((article, artIdx) => (
                <Section key={artIdx} style={articleItem}>
                  <Link href={article.url} style={articleTitle}>
                    {article.title}
                  </Link>
                  <Text style={articleSummary}>{article.summary}</Text>
                  {article.source && (
                    <Text style={articleSource}>Source: {article.source}</Text>
                  )}
                </Section>
              ))}
            </Section>
          ))}

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You are receiving this because you subscribed to TheNode.tech
              newsletter.
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>{" "}
              ·{" "}
              <Link href="https://thenode.tech/settings" style={footerLink}>
                Manage preferences
              </Link>{" "}
              ·{" "}
              <Link href="https://thenode.tech/pricing" style={footerLink}>
                Upgrade to Premium
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const header = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const logo = {
  fontSize: "28px",
  fontWeight: "800" as const,
  color: "#0a0a0a",
  margin: "0",
};

const logoImage = {
  display: "block",
  margin: "0 auto 8px",
  borderRadius: "12px",
} as const;

const dateText = {
  fontSize: "14px",
  color: "#888",
  margin: "4px 0 0",
};

const categorySection = {
  marginBottom: "24px",
};

const categoryTitle = {
  fontSize: "16px",
  fontWeight: "700" as const,
  color: "#0a0a0a",
  backgroundColor: "#f8f9fa",
  padding: "12px 16px",
  borderRadius: "8px",
  margin: "0 0 12px",
};

const overviewText = {
  fontSize: "13px",
  color: "#666",
  fontStyle: "italic" as const,
  margin: "0 0 8px",
};

const articleItem = {
  padding: "12px 0",
  borderBottom: "1px solid #f0f0f0",
};

const articleTitle = {
  color: "#0a0a0a",
  textDecoration: "none",
  fontWeight: "600" as const,
  fontSize: "15px",
};

const articleSummary = {
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.5",
  margin: "4px 0 0",
};

const articleSource = {
  fontSize: "12px",
  color: "#888",
  margin: "4px 0 0",
};

const divider = {
  borderColor: "#eee",
  margin: "24px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#999",
  margin: "0 0 8px",
};

const footerLinks = {
  fontSize: "12px",
  color: "#999",
  margin: "0",
};

const footerLink = {
  color: "#999",
  textDecoration: "underline",
};

