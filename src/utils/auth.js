const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in ms
const USERS_KEY = 'shopvault_users';
const SESSION_KEY = 'shopvault_session';

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const createSession = (user) => {
  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const extendSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session) {
      session.expiresAt = Date.now() + SESSION_DURATION;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch {}
};

export const registerUser = (name, email, password) => {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('Email already registered');
  }
  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    password, // In real app, hash this
    createdAt: new Date().toISOString(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=f97316&textColor=ffffff`,
  };
  users.push(user);
  saveUsers(users);
  return user;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
};

export const updateUserProfile = (userId, updates) => {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');
  
  if (updates.email && updates.email !== users[idx].email) {
    const emailExists = users.find((u, i) => u.email === updates.email && i !== idx);
    if (emailExists) throw new Error('Email already in use');
  }

  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  
  // Update session name/email
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session && session.userId === userId) {
      session.name = users[idx].name;
      session.email = users[idx].email;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch {}

  return users[idx];
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find((u) => u.id === userId) || null;
};

export const formatTimeRemaining = (expiresAt) => {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return '0:00';
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
