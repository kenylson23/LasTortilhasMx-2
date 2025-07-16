import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({ 
    message: 'Runtime test successful',
    timestamp: new Date().toISOString(),
    runtime: 'nodejs18.x'
  });
}