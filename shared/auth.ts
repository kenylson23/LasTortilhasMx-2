// Tipos de autenticação
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  data: {
    user: AuthUser;
    session?: any;
  };
  error: AuthError | null;
}

export interface AuthUserResponse {
  user: AuthUser | null;
  error: AuthError | null;
}

// Temporary stub implementations for auth - to be replaced with proper auth system
export const auth = {
  // Registrar usuário
  signUp: async (email: string, password: string, metadata?: { name?: string }): Promise<AuthResponse> => {
    // TODO: Implement proper authentication with PostgreSQL
    console.log('Auth signUp called for:', email);
    return { 
      data: { user: { id: '1', email, ...metadata } }, 
      error: null 
    };
  },

  // Login
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    // TODO: Implement proper authentication with PostgreSQL
    console.log('Auth signIn called for:', email);
    return { 
      data: { user: { id: '1', email }, session: { id: 'session_1' } }, 
      error: null 
    };
  },

  // Logout
  signOut: async () => {
    // TODO: Implement proper logout
    console.log('Auth signOut called');
    return { error: null };
  },

  // Obter usuário atual
  getCurrentUser: async (): Promise<AuthUserResponse> => {
    // TODO: Implement proper user retrieval
    console.log('Auth getCurrentUser called');
    return { user: null, error: null };
  },

  // Escutar mudanças de autenticação
  onAuthStateChange: (callback: (user: any) => void) => {
    // TODO: Implement proper auth state listener
    console.log('Auth onAuthStateChange called');
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

export interface AdminUsersResponse {
  data: {
    users: AuthUser[];
  };
  error: AuthError | null;
}

// Utilitários administrativos para backend
export const adminAuth = {
  // Criar usuário administrativamente
  createUser: async (email: string, password: string, metadata?: any): Promise<AuthResponse> => {
    // TODO: Implement admin user creation with PostgreSQL
    console.log('Admin createUser called for:', email);
    return { 
      data: { user: { id: '1', email, ...metadata } }, 
      error: null 
    };
  },

  // Obter usuário por ID
  getUserById: async (userId: string): Promise<AuthResponse> => {
    // TODO: Implement admin user retrieval
    console.log('Admin getUserById called for:', userId);
    return { 
      data: { user: { id: userId, email: 'admin@example.com' } }, 
      error: null 
    };
  },

  // Listar usuários
  listUsers: async (): Promise<AdminUsersResponse> => {
    // TODO: Implement admin user listing
    console.log('Admin listUsers called');
    return { 
      data: { users: [] }, 
      error: null 
    };
  },

  // Deletar usuário
  deleteUser: async (userId: string): Promise<{ error: AuthError | null }> => {
    // TODO: Implement admin user deletion
    console.log('Admin deleteUser called for:', userId);
    return { 
      error: null 
    };
  }
};