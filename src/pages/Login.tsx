import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '../hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Tentando login com:', credentials);

    // Simple authentication - in production, this would be handled by the backend
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      console.log('Login bem-sucedido');
      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o painel de gestão...",
        variant: "success",
      });
      setTimeout(() => {
        setLocation('/admin');
      }, 1000);
    } else {
      console.log('Credenciais inválidas:', credentials);
      toast({
        title: "Credenciais inválidas",
        description: "Nome de usuário ou senha incorretos",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Logo e Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Las Tortillas Mexican Grill
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de usuário
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Digite o nome de usuário"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Digite a senha"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  '🔐 Entrar no Painel'
                )}
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
                <div className="font-medium text-gray-700 mb-1">Credenciais de teste:</div>
                <div>👤 Usuário: <span className="font-mono">admin</span></div>
                <div>🔑 Senha: <span className="font-mono">admin123</span></div>
              </div>
              <button
                type="button"
                onClick={() => setLocation('/')}
                className="inline-flex items-center text-red-600 hover:text-red-500 text-sm sm:text-base font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao site
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}