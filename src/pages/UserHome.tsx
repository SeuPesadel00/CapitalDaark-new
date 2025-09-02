import { AuthGuard } from '@/components/AuthGuard';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function UserHome() {
  const { signOut, profile } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4 md:p-6 shadow-lg fixed w-full z-10">
          <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center relative">
            <div className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0 z-20">
              <span className="neon-text">Capital</span> <span className="text-purple-500">Daark</span>
            </div>
            <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-lg font-medium mb-4 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
              <li><Link to="/loja" className="nav-link text-gray-300 hover:text-cyan-400 transition duration-300 rounded-md p-2">LOJA</Link></li>
              <li><Link to="/contatos" className="nav-link text-gray-300 hover:text-cyan-400 transition duration-300 rounded-md p-2">CONTATOS</Link></li>
              <li><Link to="/sobre-nos" className="nav-link text-gray-300 hover:text-cyan-400 transition duration-300 rounded-md p-2">SOBRE NÓS</Link></li>
            </ul>
            <div className="relative dropdown z-20">
              <button className="neon-button text-white font-bold py-2 px-6 rounded-full text-lg flex items-center">
                {profile?.username || 'Perfil'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="dropdown-menu">
                <Link to="/dados-pessoais" className="block p-2 hover:bg-gray-700">Dados Pessoais</Link>
                <Link to="/configuracoes" className="block p-2 hover:bg-gray-700">Configurações</Link>
                <Link to="/payment-methods" className="block p-2 hover:bg-gray-700">Formas de Pagamento</Link>
                <Link to="/account-settings" className="block p-2 hover:bg-gray-700">Configurações da Conta</Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 w-full text-left p-2">Sair</button>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow pt-24 pb-12 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Bem-vindo, {profile?.first_name || 'Usuário'}!
              </h1>
              <p className="text-gray-300">
                Acesse suas configurações, gerencie seu perfil e explore nossa plataforma.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Meu Perfil</h3>
                <p className="text-gray-300 mb-4">Gerencie suas informações pessoais e foto de perfil.</p>
                <Link to="/dados-pessoais" className="neon-button inline-block">
                  Acessar Perfil
                </Link>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Configurações</h3>
                <p className="text-gray-300 mb-4">Ajuste suas preferências e configurações de conta.</p>
                <Link to="/configuracoes" className="neon-button inline-block">
                  Configurar
                </Link>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Pagamentos</h3>
                <p className="text-gray-300 mb-4">Gerencie seus métodos de pagamento e cartões.</p>
                <Link to="/payment-methods" className="neon-button inline-block">
                  Gerenciar
                </Link>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Loja</h3>
                <p className="text-gray-300 mb-4">Explore nossos produtos e serviços exclusivos.</p>
                <Link to="/loja" className="neon-button inline-block">
                  Ver Loja
                </Link>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Contatos</h3>
                <p className="text-gray-300 mb-4">Entre em contato conosco para suporte.</p>
                <Link to="/contatos" className="neon-button inline-block">
                  Contatar
                </Link>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-white mb-3">Sobre Nós</h3>
                <p className="text-gray-300 mb-4">Conheça mais sobre a Capital Daark.</p>
                <Link to="/sobre-nos" className="neon-button inline-block">
                  Conhecer
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center">
          <p>&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Construindo o futuro, hoje.</p>
        </footer>
      </div>
    </AuthGuard>
  );
}

export default UserHome;