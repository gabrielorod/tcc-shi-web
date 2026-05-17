import api from './api';
import type { Lembrete } from '../types';

export const lembretesService = {
  listar: (usuarioId: string) => api.get<Lembrete[]>(`/lembretes/usuario/${usuarioId}`),

  criar: (usuarioId: string, intervaloMinutos: number) =>
    api.post<Lembrete>('/lembretes', { usuarioId, intervaloMinutos }),

  toggle: (id: string) => api.patch<Lembrete>(`/lembretes/${id}/toggle`),

  remover: (id: string) => api.delete<Lembrete>(`/lembretes/${id}`),
};
