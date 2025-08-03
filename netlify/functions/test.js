exports.handler = async (event, context) => {
  console.log('Test function called!');
  console.log('Method:', event.httpMethod);
  console.log('Environment variables check:');
  console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Test function works!',
      method: event.httpMethod,
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      timestamp: new Date().toISOString()
    })
  };
};
