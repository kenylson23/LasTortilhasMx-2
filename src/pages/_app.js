import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Context para autenticação
import { createContext, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('las-tortillas-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simulação de login - em produção, usar API real
      if (credentials.email === 'admin@lastortillas.com' && credentials.password === 'admin123') {
        const userData = {
          id: 1,
          name: 'Administrador',
          email: credentials.email,
          role: 'admin'
        };
        setUser(userData);
        localStorage.setItem('las-tortillas-user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      return { success: false, error: 'Erro no servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('las-tortillas-user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthContext.Provider value={value}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  );
}