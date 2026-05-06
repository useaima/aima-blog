import {
  articles as legacyArticles,
  authors as legacyAuthors,
  categories as legacyCategories,
  getAllTags as getLegacyTags,
} from "../client/src/lib/mockData";

export type PublicProduct = {
  slug: "eva" | "utg";
  name: string;
  status: "live" | "beta";
  summary: string;
  description: string;
  primaryUrl: string;
  primaryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  githubUrl?: string;
  supportLabel: string;
  categoryLabel: string;
};

export type SupportCollectionSeed = {
  slug: string;
  title: string;
  description: string;
  productSlug: PublicProduct["slug"];
  featured: boolean;
};

export type SupportArticleSeed = {
  id: string;
  slug: string;
  collectionSlug: string;
  productSlug: PublicProduct["slug"];
  title: string;
  summary: string;
  body: string;
  keywords: string[];
  relatedSlugs: string[];
};

export const productSeeds: PublicProduct[] = [
  {
    slug: "eva",
    name: "eva",
    status: "live",
    summary: "AI finance assistant for spending visibility, subscription review, and clearer next-step guidance.",
    description:
      "eva helps people understand spending behavior, detect unusual patterns, review subscriptions, and move from raw transaction history to confident financial action.",
    primaryUrl: "https://eva.useaima.com",
    primaryLabel: "Open eva",
    supportLabel: "EVA Help Center",
    categoryLabel: "AI Finance Assistant",
  },
  {
    slug: "utg",
    name: "Universal Transaction Gateway",
    status: "beta",
    summary: "Experimental non-custodial transaction gateway for AI agents with strict human approval, idempotency, and auditability.",
    description:
      "UTG is AIMA's experimental programmable settlement layer for AI agents. It creates a hard security boundary between an agent's intent and the user's money using human approval, durable execution, idempotency, and non-custodial controls.",
    primaryUrl: "https://utg.useaima.com",
    primaryLabel: "Open UTG",
    secondaryUrl: "https://github.com/useaima/universal-gateway",
    secondaryLabel: "View on GitHub",
    githubUrl: "https://github.com/useaima/universal-gateway",
    supportLabel: "UTG Help Center",
    categoryLabel: "Agentic Commerce Infrastructure",
  },
];

export const supportCollectionSeeds: SupportCollectionSeed[] = [
  {
    slug: "eva-getting-started",
    title: "Getting started with eva",
    description: "Core onboarding, account setup, and first-use guidance for EVA.",
    productSlug: "eva",
    featured: true,
  },
  {
    slug: "eva-money-workflows",
    title: "Spending, budgets, and subscriptions",
    description: "Practical help for reviews, recurring payments, and financial clarity inside EVA.",
    productSlug: "eva",
    featured: true,
  },
  {
    slug: "eva-account-security",
    title: "Security and troubleshooting",
    description: "Help with access, account safety, and common EVA issues.",
    productSlug: "eva",
    featured: false,
  },
  {
    slug: "utg-overview",
    title: "UTG basics and onboarding",
    description: "How Universal Transaction Gateway works and how to get it running safely.",
    productSlug: "utg",
    featured: true,
  },
  {
    slug: "utg-approvals-safety",
    title: "Approvals, safety, and control",
    description: "Strict HITL, approval flows, and why the gateway never hands raw control to agents.",
    productSlug: "utg",
    featured: true,
  },
  {
    slug: "utg-transactions",
    title: "Transactions, docs, and troubleshooting",
    description: "Idempotency, execution reliability, GitHub docs, and issue handling for UTG.",
    productSlug: "utg",
    featured: false,
  },
];

export const supportArticleSeeds: SupportArticleSeed[] = [
  {
    id: "eva-first-review",
    slug: "eva-first-review",
    collectionSlug: "eva-getting-started",
    productSlug: "eva",
    title: "How do I do my first review in eva?",
    summary: "Learn what to look at first when you open eva and how to use the workspace as a decision surface instead of a passive dashboard.",
    body: `# How do I do my first review in eva?

Start with the top-level workspace rather than trying to inspect every transaction one by one. eva is designed to help you answer three questions fast: what changed, what matters right now, and what action makes sense next.

Begin with the main financial summary. Review the most recent spending window, the current subscription pressure, and any alert or next-action prompt shown in the workspace. The goal of this first review is not to perform a full audit. It is to understand whether anything new deserves your attention.

Then move into the supporting detail. If the summary shows a noticeable change, open the category or subscription view connected to that change. Look for repeating merchants, unusual spikes, and any pattern that feels different from your recent baseline. When you finish, you should leave with one concrete next step such as reviewing a recurring charge, checking a merchant cluster, or adjusting a category habit.

eva works best when used as a review loop. A short, regular review is better than waiting until money feels chaotic.`,
    keywords: ["eva getting started", "eva review", "first review", "finance workspace"],
    relatedSlugs: ["eva-subscriptions-review", "eva-unusual-activity"],
  },
  {
    id: "eva-connect-accounts",
    slug: "eva-connect-accounts",
    collectionSlug: "eva-getting-started",
    productSlug: "eva",
    title: "What should I connect or import into eva first?",
    summary: "A practical order for adding the financial context eva needs to generate useful guidance.",
    body: `# What should I connect or import into eva first?

Start with the financial source that gives eva the clearest picture of your recent activity. In most cases that means the account, card, or export that contains your highest-frequency spending data.

If you connect too many incomplete or low-signal sources first, the product may show an inaccurate early picture of your habits. A better setup is to begin with the account or card that captures your daily purchases, recurring subscriptions, and the spending changes you most want to understand.

After the first source is in place, review how the workspace reads your activity. Then add supporting sources where necessary. The best setup is the smallest one that still reflects reality well enough for eva to identify repeating patterns, anomalies, and next actions.

If you are unsure where to start, choose the source that most directly answers, “Where is my money actually going week to week?”`,
    keywords: ["eva import", "eva setup", "connect accounts"],
    relatedSlugs: ["eva-first-review"],
  },
  {
    id: "eva-subscriptions-review",
    slug: "eva-subscriptions-review",
    collectionSlug: "eva-money-workflows",
    productSlug: "eva",
    title: "How do I review subscriptions in eva?",
    summary: "Use eva’s recurring-payment context to turn subscriptions into a decision workflow instead of a hidden cost list.",
    body: `# How do I review subscriptions in eva?

In eva, subscriptions should be treated as a review queue, not just a list of receipts. Start by identifying the recurring services that renew automatically and group them by purpose. Some are essential operating costs, while others are convenience or legacy tools that no longer create enough value.

Look at total recurring pressure first. Then review individual renewals. Ask which services overlap, which ones increased quietly over time, and which ones you have not used enough to justify the cost. This is where eva is most useful: it helps you see recurring spending in context, rather than making you hunt through transactions manually.

The best subscription review ends with decisions, not just awareness. Mark which tools stay, which ones need closer review this week, and which ones are obvious candidates to cancel or downgrade.`,
    keywords: ["eva subscriptions", "recurring payments", "subscription review"],
    relatedSlugs: ["eva-first-review", "eva-weekly-money-routine"],
  },
  {
    id: "eva-weekly-money-routine",
    slug: "eva-weekly-money-routine",
    collectionSlug: "eva-money-workflows",
    productSlug: "eva",
    title: "What should a weekly money routine look like in eva?",
    summary: "A realistic weekly review flow that helps users act before spending patterns get expensive.",
    body: `# What should a weekly money routine look like in eva?

The goal of a weekly eva routine is not to study every financial detail. It is to keep your money visible enough that no important pattern stays hidden for too long.

A good weekly routine usually starts with the summary layer. Check which categories moved more than expected, whether subscriptions renewed, and whether eva surfaced any unusual activity or next-step prompt. Then open only the areas that changed materially.

From there, make one or two decisions. That might mean reducing a category this week, reviewing a subscription, or checking a merchant pattern that looks different from normal. A short routine repeated consistently is far more effective than a long review you avoid doing.

If eva helps you leave each review with one clear action, the product is doing its job well.`,
    keywords: ["weekly routine", "eva workflow", "money habits"],
    relatedSlugs: ["eva-first-review", "eva-subscriptions-review"],
  },
  {
    id: "eva-unusual-activity",
    slug: "eva-unusual-activity",
    collectionSlug: "eva-account-security",
    productSlug: "eva",
    title: "Why did eva flag unusual activity?",
    summary: "Understand what a flagged anomaly means and how to investigate it without panicking.",
    body: `# Why did eva flag unusual activity?

An unusual-activity flag means the product noticed behavior that differs from your recent baseline. That does not automatically mean fraud. It means the pattern stands out enough that it deserves review.

Start with context. Was the amount larger than normal for that category? Did the charge happen at an unusual time, from a new merchant, or in a cluster of unexpected activity? Sometimes the explanation is simple, such as travel, a one-time purchase, or a planned bill.

If the activity still looks wrong after review, move into your account-level security steps. Verify the merchant, confirm the charge, and escalate through your provider if necessary. eva’s role is to surface the signal early and make the review faster. Final judgment stays with you.`,
    keywords: ["anomaly detection", "eva alert", "fraud review"],
    relatedSlugs: ["eva-first-review"],
  },
  {
    id: "utg-what-is-utg",
    slug: "what-is-universal-transaction-gateway",
    collectionSlug: "utg-overview",
    productSlug: "utg",
    title: "What is Universal Transaction Gateway (UTG)?",
    summary: "A clear explanation of what UTG does and why AIMA built it for agentic commerce.",
    body: `# What is Universal Transaction Gateway (UTG)?

Universal Transaction Gateway is AIMA’s settlement and control layer for AI agents. It exists because giving an autonomous system direct access to payment rails, bank APIs, or wallet keys is too risky for serious real-world use.

UTG sits between an agent’s intent and the final transaction. Instead of letting the model spend directly, the gateway captures the requested action, evaluates it against policy, records it for auditability, and pauses execution until the human owner explicitly approves the transaction. That is why the product is positioned as non-custodial and human-in-the-loop.

In practice, UTG is not just a payment wrapper. It is the safety boundary that lets agents interact with real financial systems without removing human control. That makes it relevant to AI commerce, automated operations, and any workflow where an agent may need to trigger a financial action safely.`,
    keywords: ["what is utg", "universal transaction gateway", "agentic commerce"],
    relatedSlugs: ["utg-human-approval", "utg-idempotency"],
  },
  {
    id: "utg-installation",
    slug: "utg-installation-and-onboarding",
    collectionSlug: "utg-overview",
    productSlug: "utg",
    title: "How do I install and onboard UTG?",
    summary: "A high-level onboarding path for getting the gateway running before connecting it to an agent.",
    body: `# How do I install and onboard UTG?

Start with the official UTG documentation and repository because the gateway combines local runtime setup, identity generation, and agent-connection steps. The recommended flow is to install the project, run the onboarding command, and only then connect the generated configuration to your agent environment.

The onboarding step matters because UTG is built around safety primitives, not just connectivity. Setup is where the gateway establishes local identity, approval behavior, and the execution boundaries it will enforce later.

After onboarding, verify the runtime before sending live requests through it. The safest rollout is always: install, onboard, verify, then connect to agent workflows in a controlled way. Use the UTG docs and GitHub project as the canonical source for platform-specific installation details and updates.`,
    keywords: ["install UTG", "UTG onboarding", "UTG docs"],
    relatedSlugs: ["what-is-universal-transaction-gateway", "utg-github-and-docs"],
  },
  {
    id: "utg-human-approval",
    slug: "utg-human-approval-flow",
    collectionSlug: "utg-approvals-safety",
    productSlug: "utg",
    title: "How does the human approval flow work in UTG?",
    summary: "Understand the strict HITL model that prevents an agent from spending without explicit owner approval.",
    body: `# How does the human approval flow work in UTG?

UTG is designed around strict human-in-the-loop execution. When an agent requests a transaction, the gateway does not simply pass that request through. It captures the intent, records the request, and halts the flow before any final settlement occurs.

The gateway then triggers an approval step outside the agent itself. That approval step is designed to reach the human owner directly, which is important because the person—not the model—remains the final authority over whether money moves.

This means the agent can reason, plan, and prepare a transaction, but it cannot complete that transaction alone. UTG exists to preserve automation where it is useful while enforcing a hard human checkpoint where financial risk exists.`,
    keywords: ["HITL", "human approval", "UTG approval flow"],
    relatedSlugs: ["what-is-universal-transaction-gateway", "utg-idempotency"],
  },
  {
    id: "utg-idempotency",
    slug: "utg-idempotency-and-retries",
    collectionSlug: "utg-transactions",
    productSlug: "utg",
    title: "Why does UTG emphasize idempotency?",
    summary: "The practical reason UTG treats repeated transaction attempts as a reliability and safety problem.",
    body: `# Why does UTG emphasize idempotency?

In financial systems, retries are dangerous if the system cannot prove whether an action already completed. An agent or network may retry the same request several times after a timeout, but the user should never be charged multiple times because the infrastructure became uncertain.

UTG uses idempotency as a control against that failure mode. The gateway tracks the request identity and treats repeated execution attempts as part of the same logical operation rather than as permission to spend again.

This matters because autonomous systems can retry fast and repeatedly. A human might submit the same action twice by mistake. An agent might do it hundreds of times. Idempotency turns that chaos into controlled behavior and is one of the reasons UTG is positioned as serious transaction infrastructure instead of a lightweight demo wrapper.`,
    keywords: ["idempotency", "double spend", "transaction retries"],
    relatedSlugs: ["utg-human-approval-flow", "utg-troubleshooting"],
  },
  {
    id: "utg-github-docs",
    slug: "utg-github-and-docs",
    collectionSlug: "utg-transactions",
    productSlug: "utg",
    title: "Where are the official UTG docs and source code?",
    summary: "Find the right public destinations for UTG documentation, source code, and implementation details.",
    body: `# Where are the official UTG docs and source code?

The primary public destination for Universal Transaction Gateway is utg.useaima.com. That is the product-facing home for the gateway and the best place to start if you want the product overview and documentation path.

For engineering details, implementation history, and issue tracking, use the official GitHub repository. The repository is the right place for installation depth, contribution workflows, and source-level troubleshooting.

When in doubt, use the product site for orientation and the GitHub repository for implementation detail. That split keeps the product story clear while still giving technical users direct access to the underlying system.`,
    keywords: ["UTG docs", "UTG GitHub", "universal gateway repository"],
    relatedSlugs: ["what-is-universal-transaction-gateway", "utg-installation-and-onboarding"],
  },
  {
    id: "utg-troubleshooting",
    slug: "utg-troubleshooting",
    collectionSlug: "utg-transactions",
    productSlug: "utg",
    title: "What should I check first when UTG is not behaving as expected?",
    summary: "A structured first-pass troubleshooting checklist for gateway setup and transaction issues.",
    body: `# What should I check first when UTG is not behaving as expected?

Start by isolating which layer is failing. Is the issue in onboarding, agent connection, approval flow, or the execution of a specific transaction? Troubleshooting is much faster when you know whether the failure is about setup, policy, or downstream infrastructure.

Then check whether the gateway is receiving the request at all. If the agent is not reaching UTG, the issue is likely in configuration. If the request reaches UTG but stalls at approval, the issue may be in the human authorization flow. If the request reaches execution but does not complete cleanly, inspect idempotency and downstream integration behavior.

Use the official docs and GitHub issues to compare your symptoms with known patterns. UTG is deliberately opinionated about control and safety, so many “failures” are actually the gateway doing exactly what it was designed to do: halting unsafe or incomplete execution until the necessary condition is satisfied.`,
    keywords: ["UTG troubleshooting", "gateway errors", "approval issues"],
    relatedSlugs: ["utg-installation-and-onboarding", "utg-idempotency-and-retries"],
  },
];

export const extraBlogArticleSeeds = [
  {
    id: "utg-launch",
    title: "Introducing Universal Transaction Gateway: The Safety Layer for Agentic Commerce",
    excerpt:
      "UTG gives AI agents a secure financial boundary by combining strict human approval, durable execution, and non-custodial transaction control.",
    content: String.raw`# Introducing Universal Transaction Gateway: The Safety Layer for Agentic Commerce

## Introduction

The conversation around AI agents has moved beyond text generation. The important question is no longer whether models can reason, call tools, and act across software systems. The harder question is what happens when those agents need to touch money. At that point, the industry stops being about convenience and starts being about trust, control, and liability.

That is the reason Universal Transaction Gateway exists. UTG is AIMA's answer to the financial safety problem in agentic systems. The issue is simple to explain but difficult to solve cleanly: an AI agent may be able to decide that a payment should happen, but it should never be given unrestricted authority to move funds on its own. A system that can read context, infer goals, and call financial rails is powerful. It is also dangerous if its execution path is not deliberately constrained.

Most naive implementations solve this by hiding credentials behind APIs and hoping application logic is enough to prevent abuse. That approach is fragile. It assumes the agent will behave predictably, the integration will never retry unsafely, and the surrounding infrastructure will never create ambiguity about whether a transaction already happened. In real systems, those assumptions fail.

UTG is built to handle that failure surface directly. It acts as the settlement and safety boundary between an agent's intent and the user's money. Rather than treating financial execution as just another API call, UTG treats it as a control problem. The gateway receives the requested action, pauses the flow, applies policy, records the attempt, and ensures final execution only happens when human approval and transaction safety requirements are satisfied.

## Why agentic commerce needs a new financial layer

The current generation of agent tooling is excellent at delegation, orchestration, and software navigation. Agents can gather context, open tools, complete multi-step workflows, and reason across many systems. But financial actions are not ordinary tasks. A bad calendar update is annoying. A bad financial action can create immediate, costly consequences.

That difference matters because agents do not fail like humans fail. They can retry rapidly. They can misunderstand ambiguous instructions at scale. They can interact with infrastructure that times out, partially succeeds, or responds inconsistently. A model may mean well and still trigger the wrong action sequence if the surrounding system is not designed defensively.

The financial layer for agentic systems therefore has to do more than expose payment primitives. It has to manage identity, replay risk, approval boundaries, execution reliability, and auditability. Without that layer, enterprises are forced into an uncomfortable tradeoff: either avoid autonomous commerce altogether, or accept far more operational and security risk than the business should tolerate.

UTG is designed to remove that tradeoff. It allows agents to participate in real-world economic flows without giving them unrestricted custody over the assets involved. That is the central product thesis.

## The safety sandwich model

One of the clearest ways to understand UTG is to think of it as a safety sandwich between the agent and the transaction rail. The agent generates the intent. The gateway intercepts the request and pauses it. The user stays in control of approval. Only after that checkpoint does execution continue.

This architecture matters because it preserves the useful part of agentic automation without collapsing the human boundary. The agent can still reason about what should happen. It can still prepare the workflow. It can still negotiate across compatible systems. But it cannot silently cross the final settlement boundary.

That makes UTG fundamentally different from custodial shortcuts. AIMA is not holding the user's money or encouraging the user to hand raw keys to an AI system. The gateway exists specifically to avoid that design failure. It gives the user a controllable execution layer that keeps the model powerful but bounded.

## Human approval as infrastructure, not decoration

Many systems talk about approvals as if they are optional interface steps. In UTG, approval is infrastructure. It is not a cosmetic confirmation dialog added at the end of a workflow. It is a deliberate interruption point that prevents an agent from spending autonomously when human authority is required.

This distinction matters because agentic systems can otherwise create a false sense of safety. If an approval step is easy to bypass, too shallow, or too tightly coupled to the same environment the agent already controls, the business has not really reduced risk. It has only added ceremony.

UTG treats approval as a genuine control boundary. The requested transaction is intercepted, recorded, and held until the human owner explicitly clears it. That makes the product more than a middleware convenience layer. It becomes a trust boundary.

## Why idempotency is central to UTG

One of the hardest parts of autonomous transaction systems is not deciding to spend. It is handling uncertainty after a spend has been attempted. Networks fail. Timeouts happen. Downstream providers respond late or inconsistently. An agent can react to uncertainty by retrying. If the system has no robust concept of idempotency, that retry becomes a double-spend risk.

UTG prioritizes idempotent execution because the cost of ambiguity is too high in finance. A transaction request should map cleanly to one logical operation. If an agent, integration, or network retries the request, the system should be able to say whether it is still the same operation or a genuinely new one.

This is one of the biggest differences between demo-grade agent tools and real transaction infrastructure. In demos, retries often look harmless. In production finance, retries can create irreversible mistakes unless the system is explicitly designed to stop them.

## Durable execution and operational realism

Real financial workflows are rarely single-step events. A transaction may involve approval, validation, provider calls, callbacks, and post-settlement reconciliation. If any part of that chain fails, the product still needs to know where the system stands.

UTG is shaped by that operational reality. The gateway is not only about intercepting a request. It is also about maintaining a reliable execution story as the workflow progresses. Durable execution and rollback thinking matter because they are what prevent partial failures from turning into user-facing financial confusion.

In practice, this means the gateway has to think like infrastructure. It needs to preserve context, enforce sequencing, and leave enough evidence behind that the team or user can understand what happened later. That is the difference between a product people can experiment with and a product businesses can trust.

## Why this matters to AIMA

UTG also changes how AIMA is positioned. EVA remains the finance assistant built for everyday visibility, review, and next-step guidance. UTG introduces a second live product category: transaction infrastructure for agentic commerce. Together, they show that AIMA is not only thinking about AI-guided financial awareness, but also about the deeper rails that make safe autonomous finance possible.

That matters strategically because the market increasingly needs both layers. People need clarity tools like EVA. Builders and enterprises need infrastructure like UTG. The company story becomes stronger when both are visible as part of one broader financial intelligence stack.

## Final thoughts

Universal Transaction Gateway is important because it acknowledges a truth the market sometimes tries to skip: agents can become economically useful before they become economically safe. UTG exists to close that gap.

The gateway is not trying to make agents less capable. It is trying to make their capability usable in the real world. By enforcing human approval, non-custodial control, idempotent execution, and audit-ready transaction handling, UTG creates the financial boundary agentic commerce needs.

That is why it belongs as a first-class AIMA product. It is not a side experiment. It is the safety layer that makes the next wave of AI-driven financial action more trustworthy.`,
    slug: "introducing-universal-transaction-gateway",
    image: "/blog/covers/protocols.svg",
    author: legacyAuthors[1],
    category: legacyCategories.find((category) => category.slug === "product-updates") ?? legacyCategories[0],
    tags: ["utg", "agentic commerce", "payments infrastructure", "aima"],
    publishedAt: new Date("2026-04-20"),
    updatedAt: new Date("2026-04-22"),
    readTime: 12,
    featured: true,
  },
  {
    id: "utg-idempotency-story",
    title: "Why Idempotency Decides Whether AI Transactions Feel Safe or Reckless",
    excerpt:
      "Idempotency is what stops a retry storm, agent loop, or flaky network from becoming a double-spend nightmare.",
    content: String.raw`# Why Idempotency Decides Whether AI Transactions Feel Safe or Reckless

## Introduction

When people talk about autonomous transactions, they usually focus on intent. Can the agent identify the right action? Can it decide when a payment is required? Can it coordinate with other systems? Those are important questions, but they are not the only ones that matter.

In production financial systems, safety is often decided after the agent has already tried to act. What happens if the provider times out? What happens if the agent retries? What happens if the same transaction appears to fail and then succeeds later? That is where idempotency stops being a technical detail and becomes a core safety requirement.

UTG treats idempotency as one of the foundations of trustworthy agentic commerce. The gateway cannot assume that every step will respond clearly or that every caller will behave slowly. It has to assume uncertainty and still prevent duplicate financial harm.

## The retry problem in agent systems

Agents are good at persistence. If they believe a task did not complete, they often retry. That behavior can be useful for software orchestration, but it becomes dangerous around money. A human might hesitate before submitting the same payment again. An agent can do it many times in seconds.

That difference is why transaction systems cannot rely on good intentions alone. The infrastructure has to know whether two requests are actually the same operation. If it cannot answer that question confidently, the safest assumption is usually to halt rather than risk duplicate settlement.

## Why ordinary error handling is not enough

Many systems treat retries as an application concern. If an error occurs, the caller tries again. That pattern works well enough for non-financial tasks like fetching content or resubmitting a background job. It is not sufficient for settlement workflows.

In finance, an uncertain result is still a result that must be accounted for. If a request partially completed, a retry is not neutral. It may duplicate real economic action. That is why idempotency needs to be enforced at the transaction boundary, not left as a best-effort behavior in the caller.

## How UTG uses idempotent thinking

UTG approaches requests as logically unique operations that must remain stable across retries. Once a transaction enters the gateway, the infrastructure tracks it as an execution unit rather than as a disposable API call. If the same request appears again, the gateway should recognize that it is still handling the original operation.

This matters because it converts repeat attempts from dangerous ambiguity into controlled behavior. Instead of guessing whether it is safe to proceed, the system can use its own execution memory to decide whether it is continuing an operation, replaying a finished one, or seeing a genuinely new transaction.

## Why this is essential for trust

Users and businesses do not experience trust in abstract protocol language. They experience it in operational outcomes. If a gateway prevents duplicate spending when infrastructure is unreliable, trust rises. If it cannot, trust collapses very quickly.

That is why idempotency deserves so much attention in UTG. It is not glamorous, but it is one of the clearest signals that a product has been designed for real-world financial use instead of superficial automation demos.

## Final thoughts

Autonomous transactions will only scale if the underlying systems treat retries, ambiguity, and partial failure as first-class design problems. Idempotency is central because it is what keeps the system safe when certainty disappears.

UTG emphasizes this because responsible agentic commerce is not only about enabling action. It is about enabling action without turning uncertainty into loss.`,
    slug: "why-idempotency-matters-for-ai-transactions",
    image: "/blog/covers/ai-agents.svg",
    author: legacyAuthors[1],
    category: legacyCategories.find((category) => category.slug === "protocols") ?? legacyCategories[0],
    tags: ["utg", "idempotency", "transactions", "protocols"],
    publishedAt: new Date("2026-04-23"),
    updatedAt: new Date("2026-04-23"),
    readTime: 8,
    featured: false,
  },
];

export const fallbackBlogAuthors = legacyAuthors;
export const fallbackBlogCategories = legacyCategories;
export const fallbackBlogTags = getLegacyTags();
export const fallbackBlogArticles = [...extraBlogArticleSeeds, ...legacyArticles];
