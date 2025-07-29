// Vercel Serverless Function for reservations
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, reservations } from '../lib/db';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { corsHeaders, apiResponse, apiError, validateRequestMethod } from '../lib/utils';

// Validation schema
const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const allReservations = await db.select().from(reservations);
        return res.status(200).json(allReservations);

      case 'POST':
        const validation = insertReservationSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
        }

        const newReservation = await db.insert(reservations)
          .values(validation.data)
          .returning();

        return res.status(201).json(newReservation[0]);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Reservations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}