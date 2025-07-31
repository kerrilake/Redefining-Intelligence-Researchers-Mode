// netlify/functions/budget-notification.js
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
    const { currentSpend, budgetPercent, monthlyBudget } = JSON.parse(event.body);
    
    // Log budget notification
    console.log(`Budget Alert: ${budgetPercent}% of monthly budget used ($${currentSpend.toFixed(2)} of $${monthlyBudget})`);
    
    // In production, you would send an email to info@kerrilake.com
    // using a service like SendGrid, Mailgun, or Netlify Forms
    
    const notificationData = {
      timestamp: new Date().toISOString(),
      currentSpend: currentSpend,
      budgetPercent: budgetPercent,
      monthlyBudget: monthlyBudget,
      message: `Species Intelligence Research Agent has used ${budgetPercent}% of monthly budget ($${currentSpend.toFixed(2)} of $${monthlyBudget})`
    };

    // TODO: Send email notification
    // await sendEmailNotification('info@kerrilake.com', notificationData);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        notification: notificationData
      })
    };

  } catch (error) {
    console.error('Budget notification error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Notification failed',
        message: error.message
      })
    };
  }
};
