import { create } from 'zustand';
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
} from '../../../services/token.service';

const initialToken = getToken();
const initialUser = getUser();

const useAuthStore = create((set) => ({
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  user: initialUser,
  setAuth: (token, user) => {
    setToken(token);
    setUser(user);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    removeToken();
    removeUser();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
