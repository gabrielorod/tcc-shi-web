import api from './api';
import type { Dispositivo } from '../types';

export const dispositivosService = {
  criar: (usuarioId: string) => api.post<Dispositivo>('/dispositivos', { usuarioId }),

  buscar: (id: string) => api.get<Dispositivo>(`/dispositivos/${id}`),

  selecionarRecipiente: (id: string, recipienteId: string) =>
    api.patch<Dispositivo>(`/dispositivos/${id}/recipiente`, { recipienteId }),
};
