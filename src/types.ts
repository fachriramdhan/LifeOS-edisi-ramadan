export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'premium' | 'admin';
  subscription_status?: string;
}

export interface IbadahLog {
  id: number;
  user_id: number;
  date: string;
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
  tarawih: boolean;
  tahajud: boolean;
  tilawah: number;
  sedekah: number;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  target_type: 'daily' | 'weekly';
  target_value: number;
  todayValue?: number;
}

export interface Expense {
  id: number;
  user_id: number;
  date: string;
  amount: number;
  category: string;
  note?: string;
}
