// Vercel Serverless Function for menu items
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, menuItems } from '../lib/db';
import { createInsertSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';

// Validation schema
const insertMenuItemSchema = createInsertSchema(menuItems).omit({
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
        const items = await db.select().from(menuItems);
        return res.status(200).json(items);

      case 'POST':
        const validation = insertMenuItemSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
        }

        const newItem = await db.insert(menuItems)
          .values(validation.data)
          .returning();

        return res.status(201).json(newItem[0]);

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const updateValidation = insertMenuItemSchema.partial().safeParse(updateData);
        if (!updateValidation.success) {
          return res.status(400).json({ error: 'Invalid data', details: updateValidation.error.errors });
        }

        const updatedItem = await db.update(menuItems)
          .set(updateValidation.data)
          .where(eq(menuItems.id, id))
          .returning();

        if (updatedItem.length === 0) {
          return res.status(404).json({ error: 'Menu item not found' });
        }

        return res.status(200).json(updatedItem[0]);

      case 'DELETE':
        const deleteId = req.query.id || req.body.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const deletedItem = await db.delete(menuItems)
          .where(eq(menuItems.id, Number(deleteId)))
          .returning();

        if (deletedItem.length === 0) {
          return res.status(404).json({ error: 'Menu item not found' });
        }

        return res.status(200).json({ message: 'Menu item deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Menu items API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}