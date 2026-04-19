import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { Mail, Users, TrendingUp, Send } from 'lucide-react';
import { getListStats, getCampaigns, createCampaign } from '@/lib/mailchimp';

/**
 * Newsletter Management Page
 * Displays newsletter statistics, campaigns, and management tools
 */

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: string;
  sendTime?: string;
  stats?: {
    opens: number;
    clicks: number;
  };
}

export default function Newsletter() {
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: '',
    subject: '',
    previewText: '',
    htmlContent: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, campaignsData] = await Promise.all([getListStats(), getCampaigns()]);
        setStats(statsData);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error fetching newsletter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignData.title || !campaignData.subject || !campaignData.htmlContent) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await createCampaign(campaignData);
      if (result.success) {
        alert('Campaign created successfully!');
        setCampaignData({ title: '', subject: '', previewText: '', htmlContent: '' });
        setShowNewCampaign(false);
        // Refresh campaigns
        const updatedCampaigns = await getCampaigns();
        setCampaigns(updatedCampaigns);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  return (
    <Layout>
      {/* Back Button */}
      <div className="container py-8">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
            <span aria-hidden="true" className="text-base leading-none">←</span>
            Back to Blog
          </a>
        </Link>
      </div>

      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Newsletter Hub</h1>
          <p className="text-lg text-muted-foreground">Manage your email campaigns and subscribers</p>
        </div>

        {/* Statistics */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading newsletter data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.totalSubscribers || 0}
                </p>
              </div>

              <div className="p-6 bg-secondary rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Campaigns Sent</p>
                  <Send className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.campaignCount || 0}
                </p>
              </div>

              <div className="p-6 bg-secondary rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Unsubscribes</p>
                  <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.totalUnsubscribes || 0}
                </p>
              </div>
            </div>

            {/* Create Campaign Button */}
            <div className="mb-12">
              <button
                onClick={() => setShowNewCampaign(!showNewCampaign)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                Create Campaign
              </button>
            </div>

            {/* New Campaign Form */}
            {showNewCampaign && (
              <div className="mb-12 p-8 bg-secondary rounded-lg border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Create New Campaign</h2>
                <form onSubmit={handleCreateCampaign} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      value={campaignData.title}
                      onChange={(e) =>
                        setCampaignData({ ...campaignData, title: e.target.value })
                      }
                      placeholder="e.g., Weekly Newsletter - April 15"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={campaignData.subject}
                      onChange={(e) =>
                        setCampaignData({ ...campaignData, subject: e.target.value })
                      }
                      placeholder="Subject line for email"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Preview Text
                    </label>
                    <input
                      type="text"
                      value={campaignData.previewText}
                      onChange={(e) =>
                        setCampaignData({ ...campaignData, previewText: e.target.value })
                      }
                      placeholder="Preview text shown in inbox"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Content (HTML)
                    </label>
                    <textarea
                      value={campaignData.htmlContent}
                      onChange={(e) =>
                        setCampaignData({ ...campaignData, htmlContent: e.target.value })
                      }
                      placeholder="HTML content for the email"
                      rows={10}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                    >
                      Create Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCampaign(false)}
                      className="px-6 py-2 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors border border-border"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recent Campaigns */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Campaigns</h2>
              {campaigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No campaigns yet. Create your first campaign!
                </p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-6 bg-secondary rounded-lg border border-border hover:border-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {campaign.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'sent'
                                  ? 'bg-green-100 text-green-700'
                                  : campaign.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{campaign.subject}</p>
                          {campaign.stats && (
                            <div className="flex gap-6 text-sm">
                              <span className="text-muted-foreground">
                                Opens: <strong>{campaign.stats.opens}</strong>
                              </span>
                              <span className="text-muted-foreground">
                                Clicks: <strong>{campaign.stats.clicks}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Tips */}
            <div className="mt-12 p-8 bg-secondary rounded-lg border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Newsletter Best Practices</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep subject lines concise and compelling (30-50 characters)</li>
                <li>• Include a clear call-to-action in every email</li>
                <li>• Send campaigns at optimal times for your audience</li>
                <li>• Segment subscribers by interests and engagement level</li>
                <li>• Test emails before sending to ensure proper formatting</li>
                <li>• Monitor open rates and click-through rates for insights</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
