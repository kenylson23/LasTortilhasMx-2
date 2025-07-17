import { eq, and, desc } from 'drizzle-orm';
import { users, menuItems, orders, orderItems, reservations, contacts, tables } from '../../shared/schema';
import type { User, MenuItem, Order, OrderItem, Reservation, Contact, Table, InsertUser, InsertMenuItem, InsertOrder, InsertOrderItem, InsertReservation, InsertContact, InsertTable } from '../../shared/schema';
import { getDatabase } from './database';

const db = getDatabase();

export class ServerlessStorage {
  // Reservation operations
  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [result] = await db.insert(reservations).values(reservation).returning();
    return result;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [result] = await db.insert(contacts).values(contact).returning();
    return result;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const existingReservations = await db
      .select()
      .from(reservations)
      .where(and(
        eq(reservations.date, date),
        eq(reservations.time, time)
      ));
    
    return existingReservations.length === 0;
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .where(eq(reservations.date, date))
      .orderBy(reservations.time);
  }

  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(menuItems.name);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.category, category))
      .orderBy(menuItems.name);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const result = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);
    
    return result[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [result] = await db.insert(menuItems).values(item).returning();
    return result;
  }

  async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem> {
    const [result] = await db
      .update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    
    return result;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Orders
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [createdOrder] = await tx.insert(orders).values(order).returning();
      
      const orderItemsWithOrderId = items.map(item => ({
        ...item,
        orderId: createdOrder.id
      }));
      
      await tx.insert(orderItems).values(orderItemsWithOrderId);
      
      return createdOrder;
    });
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    return result[0];
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByLocation(locationId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.locationId, locationId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [result] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    return result;
  }

  async deleteOrder(id: number): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id));
      await tx.delete(orders).where(eq(orders.id, id));
    });
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  // Tables
  async getAllTables(): Promise<Table[]> {
    return await db.select().from(tables).orderBy(tables.number);
  }

  async getTablesByLocation(locationId: string): Promise<Table[]> {
    return await db
      .select()
      .from(tables)
      .where(eq(tables.locationId, locationId))
      .orderBy(tables.number);
  }

  async getTable(id: number): Promise<Table | undefined> {
    const result = await db
      .select()
      .from(tables)
      .where(eq(tables.id, id))
      .limit(1);
    
    return result[0];
  }

  async createTable(table: InsertTable): Promise<Table> {
    const [result] = await db.insert(tables).values(table).returning();
    return result;
  }

  async updateTable(id: number, table: Partial<Table>): Promise<Table> {
    const [result] = await db
      .update(tables)
      .set(table)
      .where(eq(tables.id, id))
      .returning();
    
    return result;
  }

  async deleteTable(id: number): Promise<void> {
    await db.delete(tables).where(eq(tables.id, id));
  }

  async updateTableStatus(id: number, status: string): Promise<Table> {
    const [result] = await db
      .update(tables)
      .set({ status })
      .where(eq(tables.id, id))
      .returning();
    
    return result;
  }
}

// Export singleton instance
export const storage = new ServerlessStorage();