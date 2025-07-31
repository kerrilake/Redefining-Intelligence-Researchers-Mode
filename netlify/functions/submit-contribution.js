exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const contributionData = JSON.parse(event.body);
    
    // Basic validation
    if (!contributionData.contributorName || !contributionData.contributorEmail || !contributionData.speciesName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // In production, you would:
    // 1. Store in a database (like Netlify's Fauna DB)
    // 2. Send email notification to info@kerrilake.com
    // 3. Add to moderation queue
    
    console.log('New contribution received:', {
      species: contributionData.speciesName,
      contributor: contributionData.contributorName,
      email: contributionData.contributorEmail,
      timestamp: new Date().toISOString()
    });

    // For now, we'll simulate successful submission
    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Contribution submitted for moderation',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Contribution submission error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Submission failed',
        message: error.message
      })
    };
  }
};
