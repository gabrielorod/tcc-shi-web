import api from './api';
import type { Recipiente } from '../types';

export const recipientesService = {
  listar: (usuarioId: string) => api.get<Recipiente[]>(`/recipientes/usuario/${usuarioId}`),

  criar: (data: { nome: string; tipo: string; usuarioId: string }) =>
    api.post<Recipiente>('/recipientes', data),

  calibrar: (id: string, pesoVazioG: number) =>
    api.patch<Recipiente>(`/recipientes/${id}/calibrar`, { pesoVazioG }),

  remover: (id: string) => api.delete<Recipiente>(`/recipientes/${id}`),
};
