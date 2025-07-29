// Vercel Serverless Function for orders
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, orders, tables } from '../lib/db';
import { createInsertSchema } from 'drizzle-zod';
import { eq, and } from 'drizzle-orm';

// Validation schema
const insertOrderSchema = createInsertSchema(orders).omit({
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
        const allOrders = await db.select().from(orders);
        return res.status(200).json(allOrders);

      case 'POST':
        const validation = insertOrderSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
        }

        // If dine-in order, mark table as occupied
        if (validation.data.orderType === 'dine-in' && validation.data.tableId) {
          await db.update(tables)
            .set({ status: 'occupied' })
            .where(eq(tables.id, validation.data.tableId));
        }

        const newOrder = await db.insert(orders)
          .values(validation.data)
          .returning();

        return res.status(201).json(newOrder[0]);

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const updateValidation = insertOrderSchema.partial().safeParse(updateData);
        if (!updateValidation.success) {
          return res.status(400).json({ error: 'Invalid data', details: updateValidation.error.errors });
        }

        // Get current order to check table status changes
        const currentOrder = await db.select().from(orders).where(eq(orders.id, id));
        if (currentOrder.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }

        const updatedOrder = await db.update(orders)
          .set(updateValidation.data)
          .where(eq(orders.id, id))
          .returning();

        // Handle table status changes
        if (currentOrder[0].orderType === 'dine-in' && currentOrder[0].tableId) {
          const newStatus = updateData.status;
          if (newStatus === 'completed' || newStatus === 'cancelled') {
            // Free the table
            await db.update(tables)
              .set({ status: 'available' })
              .where(eq(tables.id, currentOrder[0].tableId));
          }
        }

        return res.status(200).json(updatedOrder[0]);

      case 'DELETE':
        const deleteId = req.query.id || req.body.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'ID is required' });
        }

        // Get order details before deletion
        const orderToDelete = await db.select().from(orders).where(eq(orders.id, Number(deleteId)));
        if (orderToDelete.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }

        // Free table if it was a dine-in order
        if (orderToDelete[0].orderType === 'dine-in' && orderToDelete[0].tableId) {
          await db.update(tables)
            .set({ status: 'available' })
            .where(eq(tables.id, orderToDelete[0].tableId));
        }

        const deletedOrder = await db.delete(orders)
          .where(eq(orders.id, Number(deleteId)))
          .returning();

        return res.status(200).json({ message: 'Order deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}