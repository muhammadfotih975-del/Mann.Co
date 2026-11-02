import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { RationsCatalog } from './components/RationsCatalog.tsx';
import { ForumOrderForm } from './components/ForumOrderForm.tsx';
import { ForumFeed } from './components/ForumFeed.tsx';
import { MessSchedule } from './components/MessSchedule.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPage } from './components/AdminPage.tsx';
import { Requisition, RationItem, AdminUser } from './types.ts';

export default function App() {
  // Routing: detect if user visited /admin or hash #admin
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin')) {
      return '/admin';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());
  const [selectedFaction, setSelectedFaction] = useState<'RED' | 'BLU'>('RED');
  const [selectedRation, setSelectedRation] = useState<string>('The Sandvich');

  // Authenticated Admin state (persisted in session)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('mann_co_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Requisitions & Inventory state
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [inventory, setInventory] = useState<RationItem[]>([]);
  const [isLoadingRequisitions, setIsLoadingRequisitions] = useState<boolean>(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(true);

  // Listen to browser navigation (back/forward and URL changes)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch Forum Requisitions from SQL
  const fetchRequisitions = useCallback(async () => {
    setIsLoadingRequisitions(true);
    try {
      const res = await fetch('/api/forum');
      if (res.ok) {
        const data = await res.json();
        setRequisitions(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load requisitions from SQL:', err);
    } finally {
      setIsLoadingRequisitions(false);
    }
  }, []);

  // Fetch Ration Inventory from SQL
  const fetchInventory = useCallback(async () => {
    setIsLoadingInventory(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load inventory from SQL:', err);
    } finally {
      setIsLoadingInventory(false);
    }
  }, []);

  useEffect(() => {
    fetchRequisitions();
    fetchInventory();
  }, [fetchRequisitions, fetchInventory]);

  // Handle Likes
  const handleLikeRequisition = async (id: number) => {
    try {
      // Optimistic update
      setRequisitions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes_count: r.likes_count + 1 } : r))
      );
      await fetch(`/api/forum/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (user: AdminUser, token: string) => {
    setAdminUser(user);
    try {
      localStorage.setItem('mann_co_admin_user', JSON.stringify(user));
      localStorage.setItem('mann_co_admin_token', token);
    } catch {}
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('mann_co_admin_user');
      localStorage.removeItem('mann_co_admin_token');
    } catch {}
  };

  const handleSelectRationFromCatalog = (rationName: string) => {
    setSelectedRation(rationName);
    const formElement = document.getElementById('forum');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaction = () => {
    setSelectedFaction((prev) => (prev === 'RED' ? 'BLU' : 'RED'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EFE7D3] text-[#2B2625] selection:bg-[#B8383B] selection:text-[#EFE7D3]">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        isAdminLoggedIn={!!adminUser}
        selectedFaction={selectedFaction}
        onToggleFaction={toggleFaction}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPath === '/admin' ? (
          /* ADMIN PAGE (Accessible when /admin is loaded) */
          <AdminPage
            onNavigateHome={() => navigateTo('/')}
            adminUser={adminUser}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
          />
        ) : (
          /* PUBLIC MESS HALL WEBSITE */
          <>
            <Hero
              onNavigate={navigateTo}
              requisitionCount={requisitions.length}
            />

            <RationsCatalog
              items={inventory}
              onSelectRation={handleSelectRationFromCatalog}
              isLoading={isLoadingInventory}
            />

            <ForumOrderForm
              rationItems={inventory}
              selectedRationName={selectedRation}
              defaultFaction={selectedFaction}
              onPostCreated={() => {
                fetchRequisitions();
                fetchInventory();
              }}
            />

            <ForumFeed
              requisitions={requisitions}
              isLoading={isLoadingRequisitions}
              onLike={handleLikeRequisition}
              onRefresh={fetchRequisitions}
            />

            <MessSchedule />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
