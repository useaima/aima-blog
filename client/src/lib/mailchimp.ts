/**
 * Mailchimp Integration Utilities
 * Handles newsletter subscription, campaign management, and email automation
 */

export interface MailchimpSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  interests?: Record<string, boolean>;
  source?: string;
}

export interface MailchimpCampaign {
  id: string;
  title: string;
  subject: string;
  previewText: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled' | 'paused';
  createdAt: string;
  sendTime?: string;
  stats?: {
    opens: number;
    clicks: number;
    unsubscribes: number;
  };
}

export interface MailchimpListStats {
  totalSubscribers: number;
  totalUnsubscribes: number;
  totalCleanedCount: number;
  campaignCount: number;
}

/**
 * Subscribe user to Mailchimp list
 */
export async function subscribeToNewsletter(subscriber: MailchimpSubscriber): Promise<{
  success: boolean;
  message: string;
  subscriberId?: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriber),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to subscribe to newsletter',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriberId: data.id,
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred while subscribing. Please try again.',
    };
  }
}

/**
 * Unsubscribe user from Mailchimp list
 */
export async function unsubscribeFromNewsletter(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to unsubscribe',
      };
    }

    return {
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    };
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return {
      success: false,
      message: 'An error occurred while unsubscribing. Please try again.',
    };
  }
}

/**
 * Get subscriber status
 */
export async function getSubscriberStatus(email: string): Promise<{
  subscribed: boolean;
  status?: string;
  tags?: string[];
}> {
  try {
    const response = await fetch(`/api/mailchimp/subscriber?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      return { subscribed: false };
    }

    const data = await response.json();
    return {
      subscribed: data.status === 'subscribed',
      status: data.status,
      tags: data.tags,
    };
  } catch (error) {
    console.error('Error fetching subscriber status:', error);
    return { subscribed: false };
  }
}

/**
 * Update subscriber tags
 */
export async function updateSubscriberTags(email: string, tags: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/subscriber/tags', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tags }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to update tags',
      };
    }

    return {
      success: true,
      message: 'Tags updated successfully',
    };
  } catch (error) {
    console.error('Error updating subscriber tags:', error);
    return {
      success: false,
      message: 'An error occurred while updating tags',
    };
  }
}

/**
 * Get list statistics
 */
export async function getListStats(): Promise<MailchimpListStats | null> {
  try {
    const response = await fetch('/api/mailchimp/list/stats');

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching list stats:', error);
    return null;
  }
}

/**
 * Create campaign
 */
export async function createCampaign(campaign: {
  title: string;
  subject: string;
  previewText: string;
  htmlContent: string;
  recipientListId?: string;
  tags?: string[];
}): Promise<{
  success: boolean;
  message: string;
  campaignId?: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to create campaign',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Campaign created successfully',
      campaignId: data.id,
    };
  } catch (error) {
    console.error('Error creating campaign:', error);
    return {
      success: false,
      message: 'An error occurred while creating the campaign',
    };
  }
}

/**
 * Schedule campaign
 */
export async function scheduleCampaign(campaignId: string, sendTime: Date): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/campaign/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId, sendTime: sendTime.toISOString() }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to schedule campaign',
      };
    }

    return {
      success: true,
      message: 'Campaign scheduled successfully',
    };
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    return {
      success: false,
      message: 'An error occurred while scheduling the campaign',
    };
  }
}

/**
 * Get campaigns
 */
export async function getCampaigns(limit: number = 10): Promise<MailchimpCampaign[]> {
  try {
    const response = await fetch(`/api/mailchimp/campaigns?limit=${limit}`);

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(campaignId: string, testEmail: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch('/api/mailchimp/campaign/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId, testEmail }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Failed to send test email',
      };
    }

    return {
      success: true,
      message: 'Test email sent successfully',
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      message: 'An error occurred while sending the test email',
    };
  }
}
