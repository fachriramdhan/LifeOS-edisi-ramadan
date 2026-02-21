import axios from 'axios';

// Mock API implementation using localStorage
const mockApi = {
  get: async (url: string, config?: any) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate latency
    const token = localStorage.getItem('token');
    
    // Auth Routes
    if (url === '/auth/me') {
      if (!token) throw { response: { status: 401 } };
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return { data: user };
    }

    // Ibadah Routes
    if (url.startsWith('/ibadah/')) {
      const date = url.split('/').pop();
      const logs = JSON.parse(localStorage.getItem('ibadah_logs') || '{}');
      return { data: logs[date!] || {} };
    }
    
    // Productivity Routes
    if (url === '/productivity/habits') {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      return { data: habits };
    }

    // Finance Routes
    if (url === '/finance') {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      return { data: expenses };
    }

    // Reports Routes
    if (url === '/reports/dashboard') {
      // Generate mock stats
      const ibadahLogs = JSON.parse(localStorage.getItem('ibadah_logs') || '{}');
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      // Calculate daily ibadah score for last 7 days
      const weeklyTrend = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = ibadahLogs[dateStr] || {};
        const score = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].filter(p => log[p]).length;
        weeklyTrend.push({ date: dateStr, score });
      }

      const today = new Date().toISOString().split('T')[0];
      const todayLog = ibadahLogs[today] || {};
      
      const totalHabits = habits.length;
      const completedHabits = habits.filter((h: any) => h.todayValue).length;

      const totalExpenses = expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);

      return {
        data: {
          ibadah: todayLog,
          habits: { total: totalHabits, completed: completedHabits },
          expenses: totalExpenses,
          weeklyTrend
        }
      };
    }

    if (url === '/reports/ramadan') {
        // Return a dummy blob for PDF
        return { data: new Blob(['Dummy PDF Content'], { type: 'application/pdf' }) };
    }

    return { data: {} };
  },

  post: async (url: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Auth Routes
    if (url === '/auth/login') {
      const { email, password } = data;
      if (email === 'user@example.com' && password === 'password') {
        const user = { id: 1, name: 'User', email, role: 'user' };
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        return { data: { token: 'mock-jwt-token', user } };
      }
      // Allow any login for demo
      const user = { id: 1, name: email.split('@')[0], email, role: 'user' };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
      return { data: { token: 'mock-jwt-token', user } };
    }

    if (url === '/auth/register') {
      const user = { id: 1, name: data.name, email: data.email, role: 'user' };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
      return { data: { token: 'mock-jwt-token', user } };
    }

    if (url === '/auth/logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { data: { message: 'Logged out' } };
    }

    // Ibadah Routes
    if (url === '/ibadah') {
      const logs = JSON.parse(localStorage.getItem('ibadah_logs') || '{}');
      logs[data.date] = data;
      localStorage.setItem('ibadah_logs', JSON.stringify(logs));
      return { data: { message: 'Saved' } };
    }

    // Productivity Routes
    if (url === '/productivity/habits') {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const newHabit = { id: Date.now(), name: data.name, todayValue: 0 };
      habits.push(newHabit);
      localStorage.setItem('habits', JSON.stringify(habits));
      return { data: newHabit };
    }

    if (url.match(/\/productivity\/habits\/\d+\/log/)) {
      const id = parseInt(url.split('/')[3]);
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const updatedHabits = habits.map((h: any) => h.id === id ? { ...h, todayValue: data.value } : h);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return { data: { message: 'Logged' } };
    }

    // Finance Routes
    if (url === '/finance') {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const newExpense = { id: Date.now(), ...data };
      expenses.push(newExpense);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      return { data: newExpense };
    }

    return { data: {} };
  },

  delete: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (url.startsWith('/productivity/habits/')) {
      const id = parseInt(url.split('/').pop()!);
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const filtered = habits.filter((h: any) => h.id !== id);
      localStorage.setItem('habits', JSON.stringify(filtered));
      return { data: { message: 'Deleted' } };
    }

    if (url.startsWith('/finance/')) {
      const id = parseInt(url.split('/').pop()!);
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const filtered = expenses.filter((e: any) => e.id !== id);
      localStorage.setItem('expenses', JSON.stringify(filtered));
      return { data: { message: 'Deleted' } };
    }

    return { data: {} };
  }
};

// Export the mock API as default
export default mockApi as any;
