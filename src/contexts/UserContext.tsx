import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { Usuario } from '../types';

interface UserContextType {
  usuario: Usuario | null;
  usuarioId: string | null;
  setUsuarioId: (id: string) => void;
  clearUsuario: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuarioId, setUsuarioIdState] = useState<string | null>(localStorage.getItem('usuarioId'));
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('usuarioId'));

  useEffect(() => {
    if (!usuarioId) {
      return;
    }

    let cancelled = false;

    api
      .get<Usuario>(`/usuarios/${usuarioId}`)
      .then((res) => {
        if (!cancelled) setUsuario(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('usuarioId');
          setUsuarioIdState(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [usuarioId]);

  const setUsuarioId = (id: string) => {
    localStorage.setItem('usuarioId', id);
    setLoading(true);
    setUsuarioIdState(id);
  };

  const clearUsuario = () => {
    localStorage.removeItem('usuarioId');
    setUsuarioIdState(null);
    setUsuario(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ usuario, usuarioId, setUsuarioId, clearUsuario, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
