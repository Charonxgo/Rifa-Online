import React from 'react';
import { useNavigation } from '../App';
import { raffleService } from '../services/raffleService';
import { Ticket, LogOut, User as UserIcon, Shield, Menu, X, ShoppingBag } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { navigate, currentRoute } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = raffleService.getCurrentUser();

  const handleLogout = () => {
     // In a real app this would clear tokens
     window.location.reload();
  };

  const NavItem = ({ route, label, icon: Icon }: any) => (
    <button
      onClick={() => {
        navigate(route);
        setIsMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentRoute === route 
          ? 'bg-brand-100 text-brand-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <Ticket className="h-8 w-8 text-brand-600" />
              <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">RifaMaster</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <NavItem route="home" label="Rifas" icon={Ticket} />
              <NavItem route="my-purchases" label="Minhas Compras" icon={ShoppingBag} />
              {user.isAdmin && (
                <NavItem route="admin" label="Admin" icon={Shield} />
              )}
              
              <div className="ml-4 flex items-center pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end mr-3">
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.isAdmin ? 'Administrador' : 'Usuário'}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                   <UserIcon size={16} />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavItem route="home" label="Rifas Disponíveis" icon={Ticket} />
              <NavItem route="my-purchases" label="Minhas Compras" icon={ShoppingBag} />
              {user.isAdmin && (
                <NavItem route="admin" label="Painel Admin" icon={Shield} />
              )}
              <div className="mt-4 pt-4 border-t border-gray-100 px-3">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 mr-2">
                    <UserIcon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-700">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2024 RifaMaster Online. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center gap-4">
             <button onClick={() => raffleService.switchUser('user')} className="text-xs text-blue-500 hover:underline">Simular Login Usuário</button>
             <button onClick={() => raffleService.switchUser('admin')} className="text-xs text-red-500 hover:underline">Simular Login Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};