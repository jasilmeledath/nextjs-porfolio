/**
 * API Proxy for Cloudflare Tunnel Support
 * This proxy forwards requests to the local Express server
 */

const API_SERVER_URL = process.env.API_SERVER_URL || 'http://localhost:8000/api/v1';

export default async function handler(req, res) {
  // Only allow specific methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract the path from the request
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path || '';
    
    // Construct the full API URL
    const targetUrl = `${API_SERVER_URL}/${apiPath}`;
    
    // Forward query parameters
    const url = new URL(targetUrl);
    Object.keys(req.query).forEach(key => {
      if (key !== 'path') {
        url.searchParams.append(key, req.query[key]);
      }
    });

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward authorization header if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        // Forward other important headers
        ...(req.headers['x-requested-with'] && { 'X-Requested-With': req.headers['x-requested-with'] }),
      },
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Make the request to the Express server
    const response = await fetch(url.toString(), fetchOptions);
    
    // Get response data
    const data = await response.json();
    
    // Forward the status code and response
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
