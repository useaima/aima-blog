# Mailchimp Integration Setup Guide

This guide explains how to set up and configure Mailchimp integration for the Aima Editorial Hub blog.

## Prerequisites

- Mailchimp account (free or paid)
- API key from Mailchimp
- Audience/List ID from Mailchimp

## Step 1: Get Mailchimp API Key

1. Go to [Mailchimp Account Settings](https://mailchimp.com/account/api/)
2. Click "Create A Key" to generate a new API key
3. Copy the API key (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1`)
4. Note your data center (the suffix after the dash, e.g., `us1`, `us2`)

## Step 2: Get Audience ID

1. Go to [Mailchimp Audience Settings](https://mailchimp.com/account/audiences/)
2. Select your audience/list
3. Click "Settings" → "Audience name and defaults"
4. Scroll to "Audience ID" and copy it

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Mailchimp Configuration
VITE_MAILCHIMP_API_KEY=your_api_key_here
VITE_MAILCHIMP_AUDIENCE_ID=your_audience_id_here
VITE_MAILCHIMP_DATA_CENTER=us1
VITE_MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0

# Email Configuration
VITE_FROM_EMAIL=noreply@useaima.com
VITE_FROM_NAME=Aima Editorial Hub
```

## Step 4: Create Backend API Routes

Create the following API routes in your backend server:

### `/api/mailchimp/subscribe` (POST)

Subscribe a user to the newsletter.

**Request:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "tags": ["blog-subscriber"],
  "source": "blog"
}
```

**Response:**
```json
{
  "id": "member_id",
  "email": "user@example.com",
  "status": "pending"
}
```

### `/api/mailchimp/unsubscribe` (POST)

Unsubscribe a user from the newsletter.

**Request:**
```json
{
  "email": "user@example.com"
}
```

### `/api/mailchimp/subscriber` (GET)

Get subscriber status.

**Query Parameters:**
- `email` - User email address

**Response:**
```json
{
  "id": "member_id",
  "email": "user@example.com",
  "status": "subscribed",
  "tags": ["blog-subscriber"]
}
```

### `/api/mailchimp/list/stats` (GET)

Get list statistics.

**Response:**
```json
{
  "totalSubscribers": 1500,
  "totalUnsubscribes": 50,
  "totalCleanedCount": 10,
  "campaignCount": 25
}
```

### `/api/mailchimp/campaign` (POST)

Create a new campaign.

**Request:**
```json
{
  "title": "Weekly Newsletter",
  "subject": "This Week on Aima Blog",
  "previewText": "Your weekly roundup",
  "htmlContent": "<html>...</html>",
  "recipientListId": "audience_id",
  "tags": ["weekly"]
}
```

### `/api/mailchimp/campaign/schedule` (POST)

Schedule a campaign for sending.

**Request:**
```json
{
  "campaignId": "campaign_id",
  "sendTime": "2026-04-20T10:00:00Z"
}
```

### `/api/mailchimp/campaign/test` (POST)

Send a test email.

**Request:**
```json
{
  "campaignId": "campaign_id",
  "testEmail": "test@example.com"
}
```

## Step 5: Implement Backend Routes

Here's a sample implementation using Express.js:

```typescript
import axios from 'axios';

const mailchimpApiKey = process.env.VITE_MAILCHIMP_API_KEY;
const mailchimpApiUrl = process.env.VITE_MAILCHIMP_API_URL;
const audienceId = process.env.VITE_MAILCHIMP_AUDIENCE_ID;

const mailchimpClient = axios.create({
  baseURL: mailchimpApiUrl,
  auth: {
    username: 'anystring',
    password: mailchimpApiKey,
  },
});

// Subscribe endpoint
app.post('/api/mailchimp/subscribe', async (req, res) => {
  try {
    const { email, firstName, tags, source } = req.body;

    const response = await mailchimpClient.post(
      `/lists/${audienceId}/members`,
      {
        email_address: email,
        status: 'pending',
        merge_fields: {
          FNAME: firstName,
        },
        tags: tags || [],
        source: source,
      }
    );

    res.json({ id: response.data.id, email, status: response.data.status });
  } catch (error) {
    console.error('Mailchimp subscribe error:', error);
    res.status(400).json({ message: 'Failed to subscribe' });
  }
});

// Get subscriber status endpoint
app.get('/api/mailchimp/subscriber', async (req, res) => {
  try {
    const { email } = req.query;
    const subscriberHash = require('crypto')
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimpClient.get(
      `/lists/${audienceId}/members/${subscriberHash}`
    );

    res.json({
      id: response.data.id,
      email: response.data.email_address,
      status: response.data.status,
      tags: response.data.tags.map(t => t.name),
    });
  } catch (error) {
    console.error('Mailchimp get subscriber error:', error);
    res.status(404).json({ message: 'Subscriber not found' });
  }
});

// Get list stats endpoint
app.get('/api/mailchimp/list/stats', async (req, res) => {
  try {
    const response = await mailchimpClient.get(`/lists/${audienceId}`);

    res.json({
      totalSubscribers: response.data.stats.member_count,
      totalUnsubscribes: response.data.stats.unsubscribe_count,
      totalCleanedCount: response.data.stats.cleaned_count,
      campaignCount: response.data.stats.campaign_count,
    });
  } catch (error) {
    console.error('Mailchimp get stats error:', error);
    res.status(400).json({ message: 'Failed to get stats' });
  }
});
```

## Step 6: Test the Integration

1. Visit the blog homepage
2. Fill out the newsletter signup form
3. Check your Mailchimp audience to confirm the subscriber was added
4. Verify the welcome email was sent

## Automation Workflows

The integration includes the following automation workflows:

### Welcome Email
- **Trigger:** User subscribes
- **Delay:** 5 minutes
- **Template:** Welcome to Aima Blog

### New Article Notification
- **Trigger:** Article published
- **Delay:** Immediate
- **Template:** New Article Published

### Weekly Digest
- **Trigger:** Every Monday at 9 AM
- **Template:** This Week on Aima Blog

## Security Best Practices

1. **Never commit API keys** - Use environment variables only
2. **Use HTTPS** - All API calls should be over HTTPS
3. **Validate emails** - Validate email format before sending to Mailchimp
4. **Rate limiting** - Implement rate limiting on API endpoints
5. **Error handling** - Never expose API errors to the frontend
6. **GDPR compliance** - Ensure double opt-in for new subscribers

## Troubleshooting

### "Invalid API key" error
- Verify the API key is correct
- Check the data center suffix matches your account

### "Audience not found" error
- Verify the audience ID is correct
- Ensure the audience exists in your Mailchimp account

### Subscribers not appearing
- Check that the API endpoint is being called
- Verify the email format is valid
- Check Mailchimp logs for errors

### Emails not sending
- Verify the email template is valid HTML
- Check that the campaign has a valid recipient list
- Ensure the send time is in the future

## Additional Resources

- [Mailchimp API Documentation](https://mailchimp.com/developer/marketing/api/)
- [Mailchimp Email Templates](https://mailchimp.com/resources/email-templates/)
- [Mailchimp Automation](https://mailchimp.com/features/automation/)
