import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { CheckCircle } from 'lucide-react';

/**
 * Contribute Page Design Notes:
 * - Guest author application form
 * - Guidelines for submissions
 * - FAQ about the program
 */

export default function Contribute() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    bio: '',
    expertise: '',
    twitter: '',
    linkedin: '',
    website: '',
    articleIdea: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        title: '',
        bio: '',
        expertise: '',
        twitter: '',
        linkedin: '',
        website: '',
        articleIdea: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Become a Guest Author</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Share your expertise with the aima community. We're looking for thoughtful, well-researched articles on AI agents, personal finance, autonomous systems, and fintech innovation.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form - 2 columns */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your@email.com"
                />
              </div>

              {/* Company & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your title"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Tell us about yourself and your expertise (100-200 words)"
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Areas of Expertise *</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., AI Ethics, Fintech, Product Design (comma-separated)"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Twitter</label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="@yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="linkedin-profile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              {/* Article Idea */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Article Idea or Pitch *</label>
                <textarea
                  name="articleIdea"
                  value={formData.articleIdea}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Share your article idea, topic, or pitch. What would you like to write about?"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  {submitted ? '✓ Application Sent' : 'Submit Application'}
                </button>
              </div>

              {submitted && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Application Received!</p>
                      <p className="text-sm text-muted-foreground">
                        Thanks for your interest. We'll review your application and get back to you within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar - 1 column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Guidelines */}
              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-4">Article Guidelines</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>1,500-3,000 words for full articles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Original, unpublished content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Focus on practical insights</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Include relevant examples</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Professional tone</span>
                  </li>
                </ul>
              </div>

              {/* Topics */}
              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-4">Popular Topics</h3>
                <div className="space-y-2">
                  {[
                    'AI Agents & Automation',
                    'Personal Finance',
                    'Fintech Innovation',
                    'Financial Security',
                    'Product Design',
                    'Autonomous Commerce',
                  ].map((topic) => (
                    <span key={topic} className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mr-2 mb-2">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
                <h3 className="font-bold text-foreground mb-2">Questions?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reach out to our editorial team directly.
                </p>
                <a
                  href="mailto:help@useaima.com"
                  className="text-accent font-semibold hover:underline"
                >
                  help@useaima.com
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-bold text-foreground mb-2">Do you pay guest authors?</h3>
              <p className="text-sm text-muted-foreground">
                We currently offer exposure and a featured author profile. We're exploring compensation options for the future.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">How long does review take?</h3>
              <p className="text-sm text-muted-foreground">
                We typically review applications within 5-7 business days and provide feedback on your pitch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Can I republish elsewhere?</h3>
              <p className="text-sm text-muted-foreground">
                Articles should be original and exclusive to aima for 30 days after publication.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">What topics do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We focus on AI, finance, autonomous systems, and practical insights relevant to our audience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
