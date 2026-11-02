import { CheckoutLink } from "@convex-dev/polar/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ConvexShell, { track } from "./ConvexShell";

export interface PremiumCtaProps {
  locale: string;
  subscribe: string;
  signInToSubscribe: string;
  alreadyPremium: string;
}

const style = { marginTop: "auto", width: "100%" } as const;

function Inner(p: PremiumCtaProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  const configured = useQuery(api.polar.getPremiumProductId);
  const products = useQuery(api.polar.getConfiguredProducts);
  const productId = configured ?? products?.premium?.id;

  if (!isLoading && !isAuthenticated) {
    const next = encodeURIComponent(`/${p.locale}/pricing`);
    return (
      <a className="btn sm orange" style={style} href={`/${p.locale}/signin?next=${next}`} onClick={() => track("pricing_cta_click", { plan: "signin_first" })}>
        {p.signInToSubscribe}
      </a>
    );
  }
  if (user?.isPremium) {
    return <a className="btn sm orange" style={style} href={`/${p.locale}/settings#account`}>{p.alreadyPremium}</a>;
  }
  if (!user || !productId) {
    return <span className="btn sm orange" style={{ ...style, opacity: 0.6 }} aria-busy="true">…</span>;
  }
  return (
    <span style={{ ...style, display: "block" }} onClick={() => track("pricing_cta_click", { plan: "premium" })}>
      <CheckoutLink polarApi={api.polar} productIds={[productId]} embed={false} className="btn sm orange" >
        {p.subscribe}
      </CheckoutLink>
    </span>
  );
}

export default function PremiumCta(props: PremiumCtaProps) {
  return (
    <ConvexShell>
      <Inner {...props} />
    </ConvexShell>
  );
}
