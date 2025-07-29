// Menu estático para fallback durante desenvolvimento
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparationTime?: number;
}

export const staticMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Tacos al Pastor",
    description: "Deliciosos tacos de porco marinado com abacaxi grelhado, cebola e coentro",
    price: 2500,
    image: "/api/placeholder/400/300",
    category: "Tacos",
    available: true,
    preparationTime: 15
  },
  {
    id: 2,
    name: "Quesadilla de Queijo",
    description: "Tortilla recheada com queijos derretidos, servida com guacamole",
    price: 2000,
    image: "/api/placeholder/400/300",
    category: "Quesadillas",
    available: true,
    preparationTime: 10
  },
  {
    id: 3,
    name: "Burrito de Frango",
    description: "Burrito gigante com frango grelhado, arroz, feijão, queijo e molho especial",
    price: 3000,
    image: "/api/placeholder/400/300",
    category: "Burritos",
    available: true,
    preparationTime: 20
  },
  {
    id: 4,
    name: "Nachos Supreme",
    description: "Nachos crocantes com queijo derretido, jalapeños, creme azedo e guacamole",
    price: 2800,
    image: "/api/placeholder/400/300",
    category: "Aperitivos",
    available: true,
    preparationTime: 12
  },
  {
    id: 5,
    name: "Fajitas de Carne",
    description: "Fatias de carne grelhada com pimentões, cebolas e tortillas quentes",
    price: 3500,
    image: "/api/placeholder/400/300",
    category: "Pratos Principais",
    available: true,
    preparationTime: 25
  },
  {
    id: 6,
    name: "Guacamole Fresco",
    description: "Guacamole preparado na hora com abacate, tomate, cebola e limão",
    price: 1500,
    image: "/api/placeholder/400/300",
    category: "Aperitivos",
    available: true,
    preparationTime: 5
  }
];

export const menuCategories = [
  "Todos",
  "Tacos",
  "Quesadillas", 
  "Burritos",
  "Aperitivos",
  "Pratos Principais"
];