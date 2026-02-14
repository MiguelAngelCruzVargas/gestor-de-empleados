import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import PublicProfile from './components/PublicProfile';

export default function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- EFFECTS ---
  useEffect(() => {
    fetchEmployees();

    // Check URL for public profile
    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get('id');
    if (employeeId) {
      handlePublicView(employeeId);
    }
  }, []);

  // --- ACTIONS ---
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicView = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        clearUrlParams();
        setCurrentView('login');
        return;
      }

      setSelectedEmployee(data);
      setCurrentView('public-view');
    } catch (error) {
      console.error('Error fetching public employee:', error.message);
      clearUrlParams();
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este perfil permanentemente?')) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(employees.filter(e => e.id !== id));
      showNotification('Registro eliminado');
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      showNotification('Error al eliminar', 'error');
    }
  };

  const clearUrlParams = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30">
      {/* NOTIFICATIONS */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className={`
             flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border 
             ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100'}
          `}>
            <div className={`w-3 h-3 rounded-full ${notification.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'} animate-pulse`} />
            <p className="font-bold text-sm tracking-tight">{notification.msg}</p>
          </div>
        </div>
      )}

      {/* VIEWS */}
      {currentView === 'login' && (
        <Login setAuthenticated={setIsAuthenticated} setView={setCurrentView} />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          employees={employees}
          loading={loading}
          onAdd={() => setCurrentView('add-employee')}
          onEdit={(emp) => { setSelectedEmployee(emp); setCurrentView('edit-employee'); }}
          onLogout={() => { setIsAuthenticated(false); setCurrentView('login'); }}
          onDelete={deleteEmployee}
          onViewCard={(emp) => { setSelectedEmployee(emp); setCurrentView('public-view'); }}
          onRefresh={fetchEmployees}
          showNotification={showNotification}
        />
      )}

      {(currentView === 'add-employee' || currentView === 'edit-employee') && (
        <AddEmployee
          key={currentView}
          employee={currentView === 'edit-employee' ? selectedEmployee : null}
          onCancel={() => setCurrentView('dashboard')}
          onRefresh={fetchEmployees}
          showNotification={showNotification}
        />
      )}

      {currentView === 'public-view' && (
        <PublicProfile
          employee={selectedEmployee}
          loading={loading}
          isAuthenticated={isAuthenticated}
          onBack={() => {
            clearUrlParams();
            setCurrentView(isAuthenticated ? 'dashboard' : 'login');
          }}
        />
      )}
    </div>
  );
}
