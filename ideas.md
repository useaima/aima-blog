# Aima Editorial Hub - Design Brainstorming

## Design Philosophy Selection

After analyzing the reference site and screenshot, I'm implementing the **Modern Editorial** approach with a focus on **content-first design** that balances visual sophistication with readability.

### Selected Design Approach: Modern Editorial with Refined Minimalism

**Design Movement:** Contemporary editorial design with influences from high-end financial publications and tech thought leadership platforms.

**Core Principles:**
1. **Content Hierarchy**: Typography and spacing guide readers naturally through information without visual clutter
2. **Sophisticated Restraint**: Limited color palette (soft white, charcoal, muted gold) creates elegance through subtraction
3. **Asymmetric Layouts**: Featured content occupies prominent positions; supporting content flows naturally around it
4. **Functional Beauty**: Every visual element serves a purpose—no decorative excess

**Color Philosophy:**
- **Soft White** (`#FAFAF8`): Primary background, breathing room, premium feel
- **Charcoal** (`#2C2C2C`): Primary text, strong hierarchy, sophisticated contrast
- **Muted Gold** (`#D4A574`): Accent color for CTAs, highlights, and category badges—warm without being loud
- **Warm Gray** (`#F5F3F0`): Secondary background for cards, featured sections
- **Light Taupe** (`#E8E4E0`): Borders, dividers, subtle visual separation

**Layout Paradigm:**
- Asymmetric grid with featured content on left/center, sidebar for top stories on right
- Featured post slider takes prominent hero position
- Category grid uses 2-column layout on desktop, 1-column on mobile
- Archive explorer uses a timeline/vertical card layout
- Sidebar navigation remains sticky for easy access to categories and search

**Signature Elements:**
1. **Gold Accent Bars**: Thin gold horizontal lines separate major sections and highlight featured content
2. **Typography Contrast**: Large bold headlines paired with refined body text create visual rhythm
3. **Subtle Depth**: Soft shadows on cards, gentle hover states, minimal elevation changes

**Interaction Philosophy:**
- Hover states use subtle color shifts (gold accents brighten, text darkens slightly)
- Smooth transitions on all interactive elements (200-300ms)
- Cards lift slightly on hover with refined shadow
- Search and filter interactions feel responsive and immediate

**Animation Guidelines:**
- Page transitions: Fade in/out (300ms) for smooth navigation
- Hover effects: Subtle scale (1.02x) and shadow elevation on cards
- Featured slider: Smooth fade transitions between posts (400ms)
- Category filters: Smooth opacity transitions when active/inactive
- Scroll animations: Gentle fade-in for articles as they enter viewport

**Typography System:**
- **Display Font**: `Georgia` (serif) for headlines—conveys editorial authority
- **Body Font**: `Inter` (sans-serif) for body text—modern, readable, professional
- **Hierarchy**:
  - H1: 48px, bold, charcoal (hero section)
  - H2: 32px, bold, charcoal (section titles)
  - H3: 24px, semibold, charcoal (article titles)
  - Body: 16px, regular, charcoal (article text)
  - Caption: 14px, regular, warm gray (metadata)
  - Label: 12px, semibold, muted gold (category badges)

---

## Key Design Decisions

1. **Featured Slider**: Hero section with large image, title, excerpt, and CTA. Auto-rotates with manual controls.
2. **Top Stories Sidebar**: Right-aligned list of trending articles with category badges in muted gold.
3. **Category Grid**: 2-column layout with icon/color-coded categories below featured section.
4. **Article Cards**: Minimal design with image, title, excerpt, author, and read time.
5. **Newsletter Section**: Prominent signup form with warm gold button and supporting copy.
6. **Archive Explorer**: Vertical timeline with month/year groupings and article cards.
7. **Author Pages**: Profile section with bio, article count, latest posts, and social links.

---

## Color Palette (OKLCH Format)

```
--background: oklch(0.98 0.001 0)        /* Soft white */
--foreground: oklch(0.235 0.015 65)      /* Charcoal */
--accent: oklch(0.65 0.08 70)            /* Muted gold */
--secondary: oklch(0.95 0.002 0)         /* Warm gray */
--muted: oklch(0.92 0.002 0)             /* Light taupe */
```

---

## Implementation Notes

- Use Tailwind CSS 4 with custom OKLCH color variables
- Implement responsive breakpoints: mobile (320px), tablet (768px), desktop (1024px)
- Ensure accessibility with proper heading hierarchy and ARIA labels
- Optimize images using modern formats (WebP with fallbacks)
- Implement lazy loading for article images
- SEO-optimized meta tags and structured data for articles
