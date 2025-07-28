import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertContactSchema, insertOrderSchema, insertOrderItemSchema, insertMenuItemSchema, insertTableSchema } from "../shared/schema";
import { z } from "zod";
import path from "path";
import { auth, adminAuth } from "../shared/auth";
import { generateTableQRCode, generateQRCodeSVG } from './qr-generator';

// Cache otimizado para verificação de disponibilidade
const availabilityCache = new Map<string, { available: boolean; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 segundos para dados mais atualizados

// Cache para resultados de reservas por data
const reservationsCache = new Map<string, { data: any[]; timestamp: number }>();
const RESERVATIONS_CACHE_DURATION = 30 * 1000; // 30 segundos

// Função para limpar cache expirado
function cleanExpiredCache() {
  const now = Date.now();
  
  // Limpar cache de disponibilidade
  for (const [key, value] of availabilityCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      availabilityCache.delete(key);
    }
  }
  
  // Limpar cache de reservas
  for (const [key, value] of reservationsCache.entries()) {
    if (now - value.timestamp > RESERVATIONS_CACHE_DURATION) {
      reservationsCache.delete(key);
    }
  }
}

// Executar limpeza do cache a cada 30 segundos
setInterval(cleanExpiredCache, 30 * 1000);



export async function registerRoutes(app: Express): Promise<Server> {
  
  // Headers otimizados para performance
  app.use((req, res, next) => {
    // Headers de cache para APIs
    if (req.url.startsWith('/api/')) {
      res.set('Cache-Control', 'public, max-age=5'); // 5 segundos para APIs
    }
    
    // Headers de segurança e performance
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    
    next();
  });

  // Check availability endpoint com cache
  app.get("/api/availability", async (req, res) => {
    try {
      const { date, time } = req.query;
      
      if (!date || !time) {
        return res.status(400).json({ message: "Date and time are required" });
      }
      
      const cacheKey = `${date}-${time}`;
      const cached = availabilityCache.get(cacheKey);
      const now = Date.now();
      
      // Verificar se cache é válido
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        // Headers de cache para resposta cacheada
        res.set('Cache-Control', 'public, max-age=5');
        res.set('X-Cache', 'HIT');
        return res.json({ available: cached.available });
      }
      
      const isAvailable = await storage.checkAvailability(date as string, time as string);
      
      // Armazenar no cache
      availabilityCache.set(cacheKey, { available: isAvailable, timestamp: now });
      
      // Headers de cache para resposta nova
      res.set('Cache-Control', 'public, max-age=5');
      res.set('X-Cache', 'MISS');
      res.json({ available: isAvailable });
    } catch (error) {
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Reservation endpoint
  app.post("/api/reservations", async (req, res) => {
    try {
      const reservation = insertReservationSchema.parse(req.body);
      const newReservation = await storage.createReservation(reservation);
      
      // Limpar cache após criação de reserva
      const cacheKey = `${reservation.date}-${reservation.time}`;
      availabilityCache.delete(cacheKey);
      
      // Limpar cache de reservas para a data
      const reservationsCacheKey = `reservations-${reservation.date}`;
      reservationsCache.delete(reservationsCacheKey);
      
      res.json(newReservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      } else if (error instanceof Error && error.message === 'Horário já reservado') {
        res.status(409).json({ message: "Horário já reservado. Escolha outro horário." });
      } else {
        res.status(500).json({ message: "Failed to create reservation" });
      }
    }
  });

  // Contact form endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = insertContactSchema.parse(req.body);
      const newContact = await storage.createContact(contact);
      res.json(newContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create contact" });
      }
    }
  });

  // Get reservations by date com cache
  app.get("/api/reservations/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const cacheKey = `reservations-${date}`;
      const cached = reservationsCache.get(cacheKey);
      const now = Date.now();
      
      // Verificar se cache é válido
      if (cached && (now - cached.timestamp) < RESERVATIONS_CACHE_DURATION) {
        return res.json(cached.data);
      }
      
      const reservations = await storage.getReservationsByDate(date);
      
      // Armazenar no cache
      reservationsCache.set(cacheKey, { data: reservations, timestamp: now });
      
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations for date" });
    }
  });

  // Get reservations (admin only - simplified for demo)
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Menu Items endpoints for admin
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const validatedItem = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(validatedItem);
      res.status(201).json(menuItem);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Validar dados essenciais
      if (updates.name && typeof updates.name !== 'string') {
        return res.status(400).json({ error: "Nome deve ser uma string" });
      }
      if (updates.price && typeof updates.price !== 'string') {
        return res.status(400).json({ error: "Preço deve ser uma string" });
      }
      if (updates.category && typeof updates.category !== 'string') {
        return res.status(400).json({ error: "Categoria deve ser uma string" });
      }
      
      const menuItem = await storage.updateMenuItem(id, updates);
      res.json(menuItem);
    } catch (error: any) {
      console.error("Erro ao atualizar item:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o item existe
      const existingItem = await storage.getMenuItem(id);
      if (!existingItem) {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      
      await storage.deleteMenuItem(id);
      res.json({ message: "Item removido com sucesso" });
    } catch (error: any) {
      console.error("Erro ao remover item:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Menu Items endpoints for customers
  app.get("/api/menu", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/menu/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(category);
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simplified auth - no authentication required
  app.get('/api/auth/user', async (req, res) => {
    // Return a simple admin user for development
    res.json({ 
      id: 'admin', 
      email: 'admin@lastortillas.com', 
      firstName: 'Admin', 
      lastName: 'User' 
    });
  });

  // Orders endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      console.log('Received order request:', JSON.stringify(req.body, null, 2));
      
      const { order, items } = req.body;
      
      if (!order) {
        return res.status(400).json({ error: "Order data is required" });
      }
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Items array is required" });
      }
      
      // Validate order
      const validatedOrder = insertOrderSchema.parse(order);
      console.log('Validated order:', validatedOrder);
      
      // Validate items
      const validatedItems = items.map((item: any) => {
        console.log('Validating item:', item);
        return insertOrderItemSchema.parse(item);
      });
      console.log('Validated items:', validatedItems);
      
      const result = await storage.createOrder(validatedOrder, validatedItems);
      
      // Send WhatsApp notification (optional - can be implemented later)
      // await sendWhatsAppNotification(result);
      
      res.json(result);
    } catch (error: any) {
      console.error('Order creation error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Update order (status or estimatedDeliveryTime)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, estimatedDeliveryTime } = req.body;
      
      // Validate status if provided
      if (status && !['received', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      let updatedOrder;
      
      if (status) {
        updatedOrder = await storage.updateOrderStatus(id, status);
      } else if (estimatedDeliveryTime) {
        updatedOrder = await storage.updateOrderEstimatedTime(id, estimatedDeliveryTime);
      } else {
        return res.status(400).json({ error: "Either status or estimatedDeliveryTime is required" });
      }
      
      // Send WhatsApp notification about status change (optional)
      // await sendStatusUpdateNotification(updatedOrder);
      
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all orders with optional filtering
  app.get("/api/orders", async (req, res) => {
    try {
      const { status, location } = req.query;
      
      let orders;
      if (status) {
        orders = await storage.getOrdersByStatus(status as string);
      } else if (location) {
        orders = await storage.getOrdersByLocation(location as string);
      } else {
        orders = await storage.getAllOrders();
      }
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order: any) => {
          try {
            const items = await storage.getOrderItems(order.id);
            return { ...order, items };
          } catch (error) {
            // If getting items fails, return order with empty items array
            return { ...order, items: [] };
          }
        })
      );
      
      res.json(ordersWithItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific order with items
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const items = await storage.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete order (admin only)
  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o pedido existe
      const existingOrder = await storage.getOrder(id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }
      
      // Remove order and associated items
      await storage.deleteOrder(id);
      
      res.json({ message: "Pedido removido com sucesso" });
    } catch (error: any) {
      console.error("Erro ao remover pedido:", error);
      res.status(500).json({ error: error.message });
    }
  });



  // Tables routes
  
  // Get all tables
  app.get("/api/tables", async (req, res) => {
    try {
      const { location } = req.query;
      let tables;
      
      if (location) {
        tables = await storage.getTablesByLocation(location as string);
      } else {
        tables = await storage.getAllTables();
      }
      res.json(tables);
    } catch (error: any) {
      console.error('Error fetching tables:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific table
  app.get("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const table = await storage.getTable(id);
      if (!table) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }
      res.json(table);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create table
  app.post("/api/tables", async (req, res) => {
    try {
      const validatedData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(validatedData);
      res.status(201).json(table);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update table
  app.put("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingTable = await storage.getTable(id);
      if (!existingTable) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }
      
      const table = await storage.updateTable(id, req.body);
      res.json(table);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update table status
  app.patch("/api/tables/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }
      
      const table = await storage.updateTableStatus(id, status);
      res.json(table);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate QR Code for table
  app.post("/api/tables/:id/qr-code", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const table = await storage.getTable(id);
      
      if (!table) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }
      
      const baseUrl = req.headers.origin || req.protocol + '://' + req.get('host');
      const { qrCodeUrl, qrCode } = await generateTableQRCode(
        table.id,
        table.locationId,
        table.tableNumber,
        baseUrl
      );
      
      // Atualizar a mesa com o QR code
      const updatedTable = await storage.updateTable(id, { 
        qrCode,
        qrCodeUrl 
      });
      
      res.json({
        table: updatedTable,
        qrCodeUrl,
        qrCode
      });
    } catch (error: any) {
      console.error('Erro ao gerar QR code:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get QR Code SVG for table
  app.get("/api/tables/:id/qr-code.svg", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const table = await storage.getTable(id);
      
      if (!table) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }
      
      const baseUrl = req.headers.origin || req.protocol + '://' + req.get('host');
      const svgQR = await generateQRCodeSVG(
        table.id,
        table.locationId,
        table.tableNumber,
        baseUrl
      );
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svgQR);
    } catch (error: any) {
      console.error('Erro ao gerar QR SVG:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete table
  app.delete("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingTable = await storage.getTable(id);
      if (!existingTable) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }
      
      await storage.deleteTable(id);
      res.json({ message: "Mesa removida com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== AUTHENTICATION ENDPOINTS ===================

  // Register user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }
      
      const { data, error } = await auth.signUp(email, password, { name });
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(201).json({ user: data.user, message: "Usuário criado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      
      res.json({ user: data.user, session: data.session });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    try {
      const { user, error } = await auth.getCurrentUser();
      
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });



  // =================== ADMIN ENDPOINTS ===================

  // Admin: List users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { data, error } = await adminAuth.listUsers();
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.json({ users: data.users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Create user
  app.post("/api/admin/users", async (req, res) => {
    try {
      const { email, password, metadata } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }
      
      const { data, error } = await adminAuth.createUser(email, password, metadata);
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(201).json({ user: data.user, message: "Usuário criado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await adminAuth.deleteUser(id);
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.json({ message: "Usuário removido com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
