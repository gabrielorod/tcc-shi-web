import api from './api';
import type { Dispositivo } from '../types';

export const dispositivosService = {
  criar: () => api.post<Dispositivo>('/dispositivos'),

  buscar: (id: string) => api.get<Dispositivo>(`/dispositivos/${id}`),

  vincular: (tokenAcesso: string, usuarioId: string) =>
    api.post<Dispositivo>('/dispositivos/vincular', { tokenAcesso, usuarioId }),

  usarAgora: (id: string, usuarioId: string) =>
    api.patch<Dispositivo>(`/dispositivos/${id}/usar-agora`, { usuarioId }),

  selecionarRecipiente: (id: string, recipienteId: string) =>
    api.patch<Dispositivo>(`/dispositivos/${id}/recipiente`, { recipienteId }),

  atualizarConfiguracoes: (
    id: string,
    gracePeriodMinutos: number,
    horarioAcordar: number,
    horarioDormir: number,
  ) =>
    api.patch<Dispositivo>(`/dispositivos/${id}/configuracoes`, {
      gracePeriodMinutos,
      horarioAcordar,
      horarioDormir,
    }),

  enviarComando: (dispositivoId: string, comando: string, parametro?: string) =>
    api.post('/dispositivos/comando', { dispositivoId, comando, parametro }),
};
