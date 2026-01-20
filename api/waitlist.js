import { put, list } from "@vercel/blob";

const WAITLIST_FILENAME = 'waitlist.json';

async function getWaitlist() {
  try {
    const { blobs } = await list({ prefix: WAITLIST_FILENAME });
    
    if (blobs.length === 0) {
      return [];
    }
    
    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch (error) {
    console.error('Error reading waitlist:', error);
    return [];
  }
}

async function saveWaitlist(data) {
  await put(WAITLIST_FILENAME, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, interest, background } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const waitlist = await getWaitlist();
      
      if (waitlist.some(entry => entry.email === email)) {
        return res.status(200).json({ success: true, message: 'Already on waitlist' });
      }

      waitlist.push({
        firstName,
        lastName,
        email,
        interest: interest || '',
        background: background || '',
        timestamp: new Date().toISOString()
      });

      await saveWaitlist(waitlist);

      return res.status(200).json({ success: true, message: 'Added to waitlist' });
    } catch (error) {
      console.error('Waitlist error:', error);
      return res.status(500).json({ error: 'Failed to add to waitlist' });
    }
  }

  if (req.method === 'GET') {
    try {
      const waitlist = await getWaitlist();
      return res.status(200).json({ signups: waitlist, count: waitlist.length });
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
