import AuthGuard from './AuthGuard';
import { Link } from 'react-router-dom';

function UserHome() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/'; 
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
                Perfil
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="dropdown-menu">
                <a href="#" onClick={() => alert('Funcionalidade de Configurações em desenvolvimento!')}>Configurações</a>
                <a href="#" onClick={() => alert('Funcionalidade de Dados Pessoais em desenvolvimento!')}>Dados Pessoais</a>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 w-full text-left p-2">Sair</button>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow pt-24 pb-12">
          {/* Conteúdo principal da página inicial */}
          {/* Você precisará adaptar as classes de estilo e a lógica */}
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