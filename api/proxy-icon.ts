import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  // Validate URL parameter
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);

    // Validate it's a proper URL
    new URL(decodedUrl);

    // Fetch the icon from the external URL
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch icon: ${response.statusText}` 
      });
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24 hours

    // Stream the icon data
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Length', buffer.byteLength);
    res.end(Buffer.from(buffer));

  } catch (error: any) {
    console.error('Icon proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy icon',
      details: error.message 
    });
  }
}
