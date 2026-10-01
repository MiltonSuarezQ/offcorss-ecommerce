import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  createDate: string;
}

function App() {
  const [user, setUser] = useState<User | null>(
    () => {
      const savedUser =
        localStorage.getItem('user');

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onUserUpdated={setUser}
    />
  );
}

export default App;