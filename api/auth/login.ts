import { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '../../shared/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    
    const { data, error } = await auth.signIn(email, password);
    
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(200).json({ user: data.user, session: data.session });
  } catch (error: any) {
    console.error('Error in auth/login API:', error);
    return res.status(500).json({ error: error.message });
  }
}