export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
};

const DEMO_PASSWORD = 'SolarPulse@123';

export function getSessionUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = localStorage.getItem('solarpulse_user');

    if (storedUser) {
      return JSON.parse(storedUser) as AuthUser;
    }

    return null;
  } catch (error) {
    console.error('Unable to read session user:', error);
    return null;
  }
}

export function loginAccount(email: string, password: string): AuthUser {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const storedUser = localStorage.getItem('solarpulse_user');

  if (storedUser) {
    const user = JSON.parse(storedUser) as AuthUser;

    if (user.email === email) {
      localStorage.setItem('solarpulse_user', JSON.stringify(user));
      return user;
    }
  }

  if (password !== DEMO_PASSWORD) {
    throw new Error(
      `Invalid credentials. For demo login use password: ${DEMO_PASSWORD}`
    );
  }

  const demoUser: AuthUser = {
    id: 'demo-user',
    name: 'SolarPulse Operator',
    email,
    role: 'admin',
  };

  localStorage.setItem('solarpulse_user', JSON.stringify(demoUser));

  return demoUser;
}

export function registerAccount(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): AuthUser {
  if (!data.fullName || !data.email || !data.password) {
    throw new Error('Name, email and password are required');
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name: data.fullName,
    email: data.email,
    role: 'admin',
  };

  localStorage.setItem('solarpulse_user', JSON.stringify(user));

  return user;
}

export function loginWithPhone(phone: string): AuthUser {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  const user: AuthUser = {
    id: `phone-${Date.now()}`,
    name: 'SolarPulse Operator',
    email: 'phone-user@solarpulse.ai',
    role: 'admin',
  };

  localStorage.setItem('solarpulse_user', JSON.stringify(user));

  return user;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('solarpulse_user');
  }
}