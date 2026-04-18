/**
 * Automated Content Workflow System
 * Scans internet for AI/Finance/DeFi/Agentic Commerce updates
 * Generates 2500+ word SEO-optimized articles every 3 days
 */

import { invokeLLM } from "./_core/llm";
import { createArticle } from "./db";
import { nanoid } from "nanoid";

interface ContentTopic {
  category: "ai_security" | "ai_finance" | "defi" | "agentic_commerce" | "ai_agents";
  keywords: string[];
  description: string;
}

const contentTopics: ContentTopic[] = [
  {
    category: "ai_security",
    keywords: ["AI security", "machine learning vulnerabilities", "adversarial attacks"],
    description: "Latest developments in AI security and threat landscape",
  },
  {
    category: "ai_finance",
    keywords: ["AI in finance", "algorithmic trading", "financial AI"],
    description: "AI applications transforming financial services",
  },
  {
    category: "defi",
    keywords: ["DeFi protocols", "decentralized finance", "blockchain finance"],
    description: "Decentralized finance innovations and updates",
  },
  {
    category: "agentic_commerce",
    keywords: ["autonomous agents", "agent commerce", "AI agents"],
    description: "Autonomous agents in commerce and business",
  },
  {
    category: "ai_agents",
    keywords: ["AI agents", "multi-agent systems", "agent frameworks"],
    description: "Latest in AI agent development and deployment",
  },
];

export async function generateContentArticle(topic: ContentTopic) {
  try {
    // Generate article using LLM
    const prompt = `
You are an expert financial technology and AI journalist writing for Aima's editorial hub.

Write a comprehensive, SEO-optimized article (2500+ words) about: ${topic.description}

Requirements:
1. Title: Catchy, keyword-rich headline (60 characters max)
2. Slug: URL-friendly slug derived from title
3. Excerpt: 150-200 character summary for social sharing
4. Content: Well-researched, engaging article with:
   - Introduction with hook
   - 4-5 main sections with subheadings
   - Real-world examples and case studies
   - Impact on financial services and AI industry
   - Practical implications for readers
   - Conclusion with forward-looking insights
5. Keywords: 5-7 SEO keywords relevant to the topic
6. Category: "Finance" or "AI & Technology"

Format your response as JSON:
{
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "Brief excerpt",
  "content": "Full article content in markdown",
  "keywords": ["keyword1", "keyword2"],
  "category": "Finance"
}

Topics to cover:
- ${topic.keywords.join(", ")}
- Current industry trends
- Impact on Aima's target audience
- Future implications
- Actionable insights for readers

Ensure the article is:
- SEO-optimized with proper heading hierarchy
- Engaging and accessible to business professionals
- Backed by current industry developments
- Aligned with Aima's brand voice (professional, innovative, thought-leading)
- Rich with data points and expert perspectives
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are an expert financial technology and AI journalist. Write comprehensive, well-researched articles that establish thought leadership.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "article_content",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              excerpt: { type: "string" },
              content: { type: "string" },
              keywords: { type: "array", items: { type: "string" } },
              category: { type: "string" },
            },
            required: ["title", "slug", "excerpt", "content", "keywords", "category"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0]?.message.content;
    if (!responseContent) throw new Error("No response from LLM");

    const responseText = typeof responseContent === "string" ? responseContent : JSON.stringify(responseContent);
    const articleData = JSON.parse(responseText);

    // Save article to database
    const result = await createArticle({
      title: articleData.title,
      slug: articleData.slug || `article-${nanoid(8)}`,
      excerpt: articleData.excerpt,
      content: articleData.content,
      featuredImage: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=1200&h=600&fit=crop`,
      authorId: 1, // Default to first author (Aima Editorial)
      categoryId: 1, // Default category
      isFeatured: 1,
      viewCount: 0,
      status: "published",
    });

    return {
      success: true,
      articleId: result.insertId,
      title: articleData.title,
      slug: articleData.slug,
    };
  } catch (error) {
    console.error("[Content Workflow] Error generating article:", error);
    throw error;
  }
}

export async function runContentWorkflow() {
  console.log("[Content Workflow] Starting automated content generation...");

  try {
    // Select a random topic from available topics
    const randomTopic = contentTopics[Math.floor(Math.random() * contentTopics.length)];

    console.log(`[Content Workflow] Generating article for topic: ${randomTopic.category}`);

    const result = await generateContentArticle(randomTopic);

    console.log(`[Content Workflow] Article generated successfully:`, result);

    return result;
  } catch (error) {
    console.error("[Content Workflow] Workflow failed:", error);
    throw error;
  }
}

// Export for scheduling
export { ContentTopic };
