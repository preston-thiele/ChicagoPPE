import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Handle CORS for the API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST - Add new signup
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, interest, background } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create signup entry
      const signup = {
        firstName,
        lastName,
        email,
        interest: interest || '',
        background: background || '',
        timestamp: new Date().toISOString()
      };

      // Store in Vercel KV (using email as a simple dedup key)
      await kv.hset(`waitlist:${email}`, signup);
      
      // Also add to a list for easy retrieval of all signups
      await kv.lpush('waitlist:all', JSON.stringify(signup));

      return res.status(200).json({ success: true, message: 'Added to waitlist' });
    } catch (error) {
      console.error('Waitlist error:', error);
      return res.status(500).json({ error: 'Failed to add to waitlist' });
    }
  }

  // GET - Retrieve all signups (you might want to protect this in production)
  if (req.method === 'GET') {
    try {
      const signups = await kv.lrange('waitlist:all', 0, -1);
      const parsed = signups.map(s => typeof s === 'string' ? JSON.parse(s) : s);
      return res.status(200).json({ signups: parsed, count: parsed.length });
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
