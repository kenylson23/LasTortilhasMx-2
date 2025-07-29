import { 
  users, reservations, contacts, menuItems, orders, orderItems,
  type User, type InsertUser, type UpsertUser, type Reservation, type InsertReservation, 
  type Contact, type InsertContact, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllReservations(): Promise<Reservation[]>;
  checkAvailability(date: string, time: string): Promise<boolean>;
  getReservationsByDate(date: string): Promise<Reservation[]>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrdersByLocation(locationId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reservations: Map<number, Reservation>;
  private contacts: Map<number, Contact>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentUserId: number;
  private currentReservationId: number;
  private currentContactId: number;
  private currentMenuItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private reservationMutex: Promise<void> = Promise.resolve();
  // Índice para busca rápida por data+hora
  private reservationIndex: Map<string, number> = new Map();

  constructor() {
    this.users = new Map();
    this.reservations = new Map();
    this.contacts = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentUserId = 1;
    this.currentReservationId = 1;
    this.currentContactId = 1;
    this.currentMenuItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample menu items
    this.initializeSampleMenuItems();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    // Implementa mutex para evitar condições de corrida
    await this.reservationMutex;
    
    return new Promise((resolve, reject) => {
      this.reservationMutex = (async () => {
        try {
          // Busca rápida O(1) usando índice
          const dateTimeKey = `${insertReservation.date}-${insertReservation.time}`;
          
          if (this.reservationIndex.has(dateTimeKey)) {
            throw new Error('Horário já reservado');
          }
          
          // Gerar ID único de forma thread-safe
          const id = this.currentReservationId++;
          const reservation: Reservation = { 
            ...insertReservation,
            email: insertReservation.email || null,
            notes: insertReservation.notes || null,
            id, 
            createdAt: new Date() 
          };
          
          // Armazenar com índice para busca rápida
          this.reservations.set(id, reservation);
          this.reservationIndex.set(dateTimeKey, id);
          resolve(reservation);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact,
      phone: insertContact.phone || null,
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const dateTimeKey = `${date}-${time}`;
    return !this.reservationIndex.has(dateTimeKey);
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      (r) => r.date === date
    );
  }

  private initializeSampleMenuItems(): void {
    const sampleItems = [
      {
        id: 1,
        name: "Tacos de Carnitas",
        description: "Tacos tradicionais com carne de porco desfiada, cebola, coentro e molho verde",
        price: "2500",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400",
        available: true,
        preparationTime: 15,
        customizations: ["Sem cebola", "Extra coentro", "Molho picante"],
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Burrito Supremo",
        description: "Burrito gigante com carne, feijão, arroz, queijo, alface e molho especial",
        price: "3500",
        category: "Burritos",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
        available: true,
        preparationTime: 20,
        customizations: ["Sem feijão", "Extra queijo", "Molho à parte"],
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Quesadilla de Frango",
        description: "Tortilla recheada com frango grelhado e queijo, servida com guacamole",
        price: "2800",
        category: "Quesadillas",
        image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400",
        available: true,
        preparationTime: 12,
        customizations: ["Extra queijo", "Sem guacamole", "Molho picante"],
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Nachos Especiais",
        description: "Nachos crocantes com queijo derretido, jalapeños, guacamole e creme azedo",
        price: "2200",
        category: "Aperitivos",
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
        available: true,
        preparationTime: 10,
        customizations: ["Extra jalapeños", "Sem creme azedo", "Molho extra"],
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Horchata",
        description: "Bebida tradicional mexicana doce com canela e baunilha",
        price: "800",
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
        available: true,
        preparationTime: 5,
        customizations: ["Extra canela", "Sem açúcar"],
        createdAt: new Date(),
      }
    ];

    sampleItems.forEach(item => {
      this.menuItems.set(item.id, item as MenuItem);
    });
    this.currentMenuItemId = sampleItems.length + 1;
  }

  // Menu Items Methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.available)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.category === category && item.available)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem> {
    const item = this.menuItems.get(id);
    if (!item) {
      throw new Error(`Menu item with id ${id} not found`);
    }
    
    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  // Orders Methods
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.orders.set(orderId, order);
    
    // Create order items
    items.forEach(insertItem => {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        ...insertItem,
        id: orderItemId,
        orderId,
      };
      this.orderItems.set(orderItemId, orderItem);
    });
    
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.status === status)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrdersByLocation(locationId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.locationId === locationId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    const updatedOrder = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
