// Vercel Serverless Function for tables
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, tables } from '../lib/db';
import { createInsertSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';

// Validation schema
const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
  createdAt: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const { locationId } = req.query;
        
        let query = db.select().from(tables);
        if (locationId) {
          query = query.where(eq(tables.locationId, locationId as string));
        }
        
        const allTables = await query;
        return res.status(200).json(allTables);

      case 'POST':
        const validation = insertTableSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
        }

        const newTable = await db.insert(tables)
          .values(validation.data)
          .returning();

        return res.status(201).json(newTable[0]);

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const updateValidation = insertTableSchema.partial().safeParse(updateData);
        if (!updateValidation.success) {
          return res.status(400).json({ error: 'Invalid data', details: updateValidation.error.errors });
        }

        const updatedTable = await db.update(tables)
          .set(updateValidation.data)
          .where(eq(tables.id, id))
          .returning();

        if (updatedTable.length === 0) {
          return res.status(404).json({ error: 'Table not found' });
        }

        return res.status(200).json(updatedTable[0]);

      case 'DELETE':
        const deleteId = req.query.id || req.body.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const deletedTable = await db.delete(tables)
          .where(eq(tables.id, Number(deleteId)))
          .returning();

        if (deletedTable.length === 0) {
          return res.status(404).json({ error: 'Table not found' });
        }

        return res.status(200).json({ message: 'Table deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tables API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}