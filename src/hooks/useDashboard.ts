import { useState, useCallback } from 'react';
import api from '../services/api';
import type { DashboardHidratacao } from '../types';

export function useDashboard(usuarioId: string) {
  const [dashboard, setDashboard] = useState<DashboardHidratacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardHidratacao>(`/logs-hidratacao/dashboard/${usuarioId}`);
      setDashboard(res.data);
    } catch {
      setError('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  return { dashboard, loading, error, fetch };
}
