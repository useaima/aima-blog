export interface Author {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  articleCount: number;
  isGuest?: boolean;
  company?: string;
  expertise?: string[];
  joinedDate?: Date;
  verified?: boolean;
  verificationBadge?: 'expert' | 'researcher' | 'industry-leader' | 'thought-leader';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image: string;
  author: Author;
  category: Category;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  featured?: boolean;
}

export const authors: Author[] = [
  {
    id: 'alvins-mukabane',
    name: 'Alvins Mukabane',
    title: 'Founder, Product Engineer & Editorial Lead',
    bio: 'Alvins leads product direction at aima and writes about practical AI systems, autonomous finance, product clarity, and the operational ideas behind eva. His articles focus on making complex AI and finance topics easier to understand without losing their real-world depth.',
    twitter: '@techtrendedge',
    linkedin: 'alvins-mukabane',
    github: 'alvins-mukabane',
    company: 'aima',
    expertise: ['AI Systems', 'Finance', 'Product Design', 'Autonomous Commerce'],
    articleCount: 5,
    isGuest: false,
    verified: true,
    verificationBadge: 'industry-leader',
  },
  {
    id: 'adams-aura',
    name: 'Adams Aura',
    title: 'Research & Content Contributor',
    bio: 'Adams contributes research-driven explainers on AI agents, protocol infrastructure, financial trust, and the systems thinking behind autonomous commerce. His writing connects technical shifts like A2A, AP2, and KYA to practical product understanding inside the aima ecosystem.',
    twitter: '@adams.2wild',
    linkedin: 'adams-aura',
    company: 'aima',
    expertise: ['AI Agents', 'Financial Systems', 'Protocol Design'],
    articleCount: 3,
    isGuest: false,
    verified: true,
    verificationBadge: 'thought-leader',
  },
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'AI Ethics & Finance Researcher',
    bio: 'Sarah is an independent researcher focused on ethical AI systems in financial services. She has published extensively on algorithmic transparency and consumer protection in automated financial systems.',
    twitter: '@sarahchenai',
    linkedin: 'sarah-chen-ai',
    website: 'https://sarahchen.ai',
    company: 'Independent Researcher',
    expertise: ['AI Ethics', 'Financial Technology', 'Consumer Protection'],
    articleCount: 2,
    isGuest: true,
    joinedDate: new Date('2026-03-15'),
    verified: true,
    verificationBadge: 'researcher',
  },
  {
    id: 'james-rivera',
    name: 'James Rivera',
    title: 'Fintech Product Manager',
    bio: 'James leads product strategy at a Series B fintech startup. He brings 8+ years of experience building consumer financial products and has a passion for making complex financial concepts accessible.',
    twitter: '@jamesrivera_pm',
    linkedin: 'james-rivera',
    github: 'jrivera-fintech',
    company: 'Fintech Startup',
    expertise: ['Product Management', 'User Experience', 'Financial Services'],
    articleCount: 1,
    isGuest: true,
    joinedDate: new Date('2026-04-01'),
    verified: true,
    verificationBadge: 'expert',
  },
];

export const categories: Category[] = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    slug: 'ai-agents',
    description: 'Practical guides to agentic systems, assistant workflows, and software that can reason toward action.',
    color: 'oklch(0.65 0.08 70)',
  },
  {
    id: 'personal-finance',
    name: 'Personal Finance',
    slug: 'personal-finance',
    description: 'Clear frameworks for spending, savings, reviews, and better money decisions supported by eva.',
    color: 'oklch(0.60 0.07 70)',
  },
  {
    id: 'protocols',
    name: 'Protocols',
    slug: 'protocols',
    description: 'Definitions and operating context for A2A, AP2, KYA, and the infrastructure behind autonomous finance.',
    color: 'oklch(0.55 0.06 70)',
  },
  {
    id: 'product-updates',
    name: 'Product Updates',
    slug: 'product-updates',
    description: 'Editorial updates showing how eva turns financial activity into clearer workflows and next-step guidance.',
    color: 'oklch(0.50 0.05 70)',
  },
  {
    id: 'finance-basics',
    name: 'Finance Basics',
    slug: 'finance-basics',
    description: 'Beginner-friendly guides to personal finance fundamentals and essential money management concepts.',
    color: 'oklch(0.45 0.04 70)',
  },
  {
    id: 'financial-trust',
    name: 'Financial Trust',
    slug: 'financial-trust',
    description: 'Understanding identity verification, security protocols, and trust systems in autonomous finance.',
    color: 'oklch(0.65 0.08 70)',
  },
  {
    id: 'protocol-guide',
    name: 'Protocol Guide',
    slug: 'protocol-guide',
    description: 'Deep dives into A2A, AP2, and KYA protocols that power autonomous agent commerce.',
    color: 'oklch(0.60 0.07 70)',
  },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Inside eva: The Finance Workspace Built to Turn Spending Into Next Actions',
    excerpt: 'eva is not designed like a generic money dashboard. It is built to help users notice what changed, what matters, and what they should do next.',
    content: 'eva is not designed like a generic money dashboard. It is built to help users notice what changed, what matters, and what they should do next. The main eva workspace keeps context and next steps visible in one place. Subscriptions are treated as a first-class review workflow instead of being buried in a settings screen.',
    slug: 'inside-eva-finance-workspace',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    author: authors[0],
    category: categories[3],
    tags: ['eva', 'finance', 'workspace', 'product'],
    publishedAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-10'),
    readTime: 6,
    featured: true,
  },
  {
    id: '2',
    title: 'What Is Personal Finance? (Beginner Guide for 2026)',
    excerpt: 'Personal finance is simply how you manage your money. This beginner guide explains the basics of earning, spending, saving, investing, and using AI tools to build better money habits.',
    content: 'Personal finance is simply how you manage your money. This beginner guide explains the basics of earning, spending, saving, investing, and using AI tools to build better money habits. Learn the fundamentals of financial literacy and how modern tools like eva can help you make smarter decisions.',
    slug: 'personal-finance-beginner-guide-2026',
    image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=800&h=500&fit=crop',
    author: authors[0],
    category: categories[0],
    tags: ['finance', 'basics', 'beginner', 'money'],
    publishedAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-08'),
    readTime: 8,
  },
  {
    id: '3',
    title: 'What Is KYA (Know Your Agent)? The Future of Financial Security in 2026',
    excerpt: 'KYC verifies the person. KYA verifies the AI agent acting on that person\'s behalf. That difference matters more as finance becomes autonomous.',
    content: 'KYC verifies the person. KYA verifies the AI agent acting on that person\'s behalf. That difference matters more as finance becomes autonomous. Understanding KYA is essential for the future of secure autonomous commerce and financial systems.',
    slug: 'kya-know-your-agent-financial-security-2026',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    author: authors[1],
    category: categories[5],
    tags: ['kya', 'security', 'agents', 'finance'],
    publishedAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-05'),
    readTime: 7,
  },
  {
    id: '4',
    title: 'A2A, AP2 & KYA Explained: How AI Agents Will Control Financial Systems in 2026',
    excerpt: 'A2A helps agents communicate. AP2 helps them transact. And KYA helps financial systems trust them. Together, they form the infrastructure behind autonomous finance.',
    content: 'A2A helps agents communicate. AP2 helps them transact. And KYA helps financial systems trust them. Together, they form the infrastructure behind autonomous finance. This protocol guide explains how these three systems work together to enable autonomous agent commerce.',
    slug: 'a2a-ap2-kya-explained-ai-agents-financial-systems',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    author: authors[1],
    category: categories[6],
    tags: ['protocols', 'a2a', 'ap2', 'kya', 'agents'],
    publishedAt: new Date('2026-04-02'),
    updatedAt: new Date('2026-04-02'),
    readTime: 10,
  },
  {
    id: '5',
    title: 'What Are AI Agents? The Complete Beginner Guide to Autonomous Finance in 2026',
    excerpt: 'AI agents are software that can perceive their environment, make decisions, and take actions to achieve specific goals. In finance, they\'re changing how money moves.',
    content: 'AI agents are software that can perceive their environment, make decisions, and take actions to achieve specific goals. In finance, they\'re changing how money moves. This guide explains what AI agents are, how they work, and why they matter for the future of autonomous finance.',
    slug: 'ai-agents-complete-beginner-guide-autonomous-finance',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
    author: authors[0],
    category: categories[0],
    tags: ['ai', 'agents', 'beginner', 'autonomous'],
    publishedAt: new Date('2026-03-30'),
    updatedAt: new Date('2026-03-30'),
    readTime: 9,
  },
  {
    id: '6',
    title: 'Agent-to-Agent (A2A) Payments: The Future of Autonomous Commerce in 2026',
    excerpt: 'A2A payments enable autonomous agents to transact directly with each other. This is the foundation of autonomous commerce and the future of financial systems.',
    content: 'A2A payments enable autonomous agents to transact directly with each other. This is the foundation of autonomous commerce and the future of financial systems. Learn how A2A is reshaping commerce, reducing friction, and enabling new business models.',
    slug: 'a2a-payments-future-autonomous-commerce-2026',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop',
    author: authors[1],
    category: categories[3],
    tags: ['a2a', 'payments', 'commerce', 'autonomous'],
    publishedAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-03-28'),
    readTime: 8,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((article) => article.category.slug === categorySlug);
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((article) => article.tags.includes(tag));
}

export function getArticlesByAuthor(authorId: string): Article[] {
  return articles.filter((article) => article.author.id === authorId);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured);
}

export function getLatestArticles(limit: number = 10): Article[] {
  return [...articles].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, limit);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  articles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
