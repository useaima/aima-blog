/**
 * Email Templates and Automation Workflows
 * Defines templates for welcome emails, article notifications, and campaigns
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: 'welcome' | 'article' | 'campaign' | 'notification';
}

/**
 * Welcome Email Template
 */
export const welcomeEmailTemplate: EmailTemplate = {
  id: 'welcome',
  name: 'Welcome to Aima Blog',
  subject: 'Welcome to the Aima Editorial Hub! 🎉',
  previewText: 'Get exclusive insights on AI agents and personal finance',
  htmlContent: `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f1e8; padding: 40px 20px; text-align: center; }
          .header h1 { color: #2d2d2d; font-size: 28px; margin: 0; }
          .content { padding: 30px 20px; }
          .content p { color: #666; line-height: 1.6; }
          .cta { text-align: center; margin: 30px 0; }
          .cta a { background-color: #ff8c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
          .footer { background-color: #f5f1e8; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Aima Blog</h1>
          </div>
          <div class="content">
            <p>Hi {{FIRST_NAME}},</p>
            <p>Thank you for subscribing to the Aima Editorial Hub! We're excited to share insights on AI agents, personal finance, and the future of financial systems.</p>
            <p>Here's what you can expect:</p>
            <ul>
              <li>Weekly articles on AI and finance</li>
              <li>Product updates and new features</li>
              <li>Industry insights and thought leadership</li>
              <li>Exclusive content from our team</li>
            </ul>
            <div class="cta">
              <a href="https://blog.useaima.com">Explore the Blog</a>
            </div>
            <p>Questions? Reply to this email or visit our <a href="https://support.useaima.com">support hub</a>.</p>
            <p>Best regards,<br>The Aima Team</p>
          </div>
          <div class="footer">
            <p>© 2026 Aima. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  textContent: `
    Welcome to Aima Blog
    
    Hi {{FIRST_NAME}},
    
    Thank you for subscribing to the Aima Editorial Hub! We're excited to share insights on AI agents, personal finance, and the future of financial systems.
    
    Here's what you can expect:
    - Weekly articles on AI and finance
    - Product updates and new features
    - Industry insights and thought leadership
    - Exclusive content from our team
    
    Explore the Blog: https://blog.useaima.com
    
    Questions? Reply to this email or visit our support hub at https://support.useaima.com
    
    Best regards,
    The Aima Team
  `,
  variables: ['FIRST_NAME'],
  category: 'welcome',
};

/**
 * New Article Notification Template
 */
export const articleNotificationTemplate: EmailTemplate = {
  id: 'article-notification',
  name: 'New Article Published',
  subject: 'New: {{ARTICLE_TITLE}} - Aima Blog',
  previewText: 'Read the latest from the Aima Editorial Hub',
  htmlContent: `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f1e8; padding: 20px; }
          .article { padding: 30px 20px; border-bottom: 1px solid #eee; }
          .article h2 { color: #2d2d2d; font-size: 22px; margin: 0 0 10px 0; }
          .article .meta { color: #999; font-size: 14px; margin-bottom: 15px; }
          .article p { color: #666; line-height: 1.6; }
          .cta { text-align: center; margin: 20px 0; }
          .cta a { background-color: #ff8c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
          .footer { background-color: #f5f1e8; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p>New article published on Aima Blog</p>
          </div>
          <div class="article">
            <h2>{{ARTICLE_TITLE}}</h2>
            <div class="meta">By {{AUTHOR_NAME}} • {{PUBLISH_DATE}}</div>
            <p>{{ARTICLE_EXCERPT}}</p>
            <div class="cta">
              <a href="{{ARTICLE_URL}}">Read Full Article</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Aima. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  textContent: `
    New Article: {{ARTICLE_TITLE}}
    
    By {{AUTHOR_NAME}} • {{PUBLISH_DATE}}
    
    {{ARTICLE_EXCERPT}}
    
    Read Full Article: {{ARTICLE_URL}}
    
    © 2026 Aima. All rights reserved.
  `,
  variables: ['ARTICLE_TITLE', 'AUTHOR_NAME', 'PUBLISH_DATE', 'ARTICLE_EXCERPT', 'ARTICLE_URL'],
  category: 'article',
};

/**
 * Weekly Digest Template
 */
export const weeklyDigestTemplate: EmailTemplate = {
  id: 'weekly-digest',
  name: 'Weekly Digest',
  subject: 'This Week on Aima Blog - {{WEEK_DATE}}',
  previewText: 'Your weekly roundup of AI and finance insights',
  htmlContent: `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f1e8; padding: 40px 20px; text-align: center; }
          .header h1 { color: #2d2d2d; font-size: 28px; margin: 0; }
          .articles { padding: 30px 20px; }
          .article-item { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
          .article-item:last-child { border-bottom: none; }
          .article-item h3 { color: #2d2d2d; font-size: 18px; margin: 0 0 8px 0; }
          .article-item .meta { color: #999; font-size: 13px; margin-bottom: 10px; }
          .article-item p { color: #666; line-height: 1.6; margin: 0; }
          .cta { text-align: center; margin: 30px 0; }
          .cta a { background-color: #ff8c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
          .footer { background-color: #f5f1e8; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>This Week on Aima Blog</h1>
          </div>
          <div class="articles">
            {{ARTICLES_HTML}}
          </div>
          <div class="cta">
            <a href="https://blog.useaima.com">View All Articles</a>
          </div>
          <div class="footer">
            <p>© 2026 Aima. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  textContent: `
    This Week on Aima Blog
    
    {{ARTICLES_TEXT}}
    
    View All Articles: https://blog.useaima.com
    
    © 2026 Aima. All rights reserved.
  `,
  variables: ['WEEK_DATE', 'ARTICLES_HTML', 'ARTICLES_TEXT'],
  category: 'campaign',
};

/**
 * Automation Workflow Configuration
 */
export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: 'subscribe' | 'article_published' | 'weekly' | 'custom';
  template: EmailTemplate;
  delay?: number; // in minutes
  enabled: boolean;
}

export const automationWorkflows: AutomationWorkflow[] = [
  {
    id: 'welcome-workflow',
    name: 'Welcome Email',
    trigger: 'subscribe',
    template: welcomeEmailTemplate,
    delay: 5, // Send 5 minutes after subscription
    enabled: true,
  },
  {
    id: 'article-notification-workflow',
    name: 'New Article Notification',
    trigger: 'article_published',
    template: articleNotificationTemplate,
    delay: 0, // Send immediately
    enabled: true,
  },
  {
    id: 'weekly-digest-workflow',
    name: 'Weekly Digest',
    trigger: 'weekly',
    template: weeklyDigestTemplate,
    delay: 0,
    enabled: true,
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  const templates = [welcomeEmailTemplate, articleNotificationTemplate, weeklyDigestTemplate];
  return templates.find((t) => t.id === id);
}

/**
 * Render template with variables
 */
export function renderTemplate(template: EmailTemplate, variables: Record<string, string>): string {
  let content = template.htmlContent;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return content;
}

/**
 * Get all templates
 */
export function getAllTemplates(): EmailTemplate[] {
  return [welcomeEmailTemplate, articleNotificationTemplate, weeklyDigestTemplate];
}

/**
 * Get workflows by trigger
 */
export function getWorkflowsByTrigger(trigger: string): AutomationWorkflow[] {
  return automationWorkflows.filter((w) => w.trigger === trigger && w.enabled);
}
