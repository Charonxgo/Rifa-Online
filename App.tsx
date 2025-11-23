import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateRaffle } from './pages/CreateRaffle';
import { RaffleDetails } from './pages/RaffleDetails';
import { MyPurchases } from './pages/MyPurchases';
import { raffleService } from './services/raffleService';

// --- Router Context for Simplicity without react-router-dom ---
type RouteName = 'home' | 'admin' | 'admin-create' | 'raffle-details' | 'my-purchases';
interface NavigationContextType {
  currentRoute: RouteName;
  params: Record<string, any>;
  navigate: (route: RouteName, params?: Record<string, any>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};

const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteName>('home');
  const [params, setParams] = useState<Record<string, any>>({});

  const navigate = (route: RouteName, newParams?: Record<string, any>) => {
    // Basic protection
    if (route.startsWith('admin') && !raffleService.getCurrentUser().isAdmin) {
      alert("Acesso negado: Requer privilégios de administrador.");
      return;
    }
    
    setParams(newParams || {});
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, params, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

// --- Main Route Switcher ---
const AppContent: React.FC = () => {
  const { currentRoute, params } = useNavigation();

  const renderPage = () => {
    switch (currentRoute) {
      case 'home': return <HomePage />;
      case 'admin': return <AdminDashboard />;
      case 'admin-create': return <CreateRaffle />;
      case 'raffle-details': return <RaffleDetails raffleId={params.id} />;
      case 'my-purchases': return <MyPurchases />;
      default: return <HomePage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
};

export default App;