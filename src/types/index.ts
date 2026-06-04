export interface Usuario {
  id: string;
  nome: string;
  pesoKg: number;
  alturaCm: number;
  sexo: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  metaDiariaMl: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Recipiente {
  id: string;
  usuarioId: string;
  nome: string;
  tipo: 'COPO' | 'GARRAFA' | 'CANECA';
  pesoVazioG: number;
  ativo: boolean;
  criadoEm: string;
}

export interface Dispositivo {
  id: string;
  tokenAcesso: string;
  usuarioAtivoId: string | null;
  recipienteAtivoId: string | null;
  recipienteAtivo?: Recipiente | null;
  usuarioAtivo?: Usuario | null;
  pesoAtualNaMesaG: number;
  ultimoPingEm: string | null;
  gracePeriodMinutos: number;
  horarioAcordar: number;
  horarioDormir: number;
  criadoEm: string;
}

export interface LogHidratacao {
  id: string;
  usuarioId: string;
  dispositivoId: string;
  recipienteId: string;
  quantidadeMl: number;
  pesoAntesG: number;
  pesoDepoisG: number;
  registradoEm: string;
}

export interface DashboardHidratacao {
  meta: number;
  percentualDiario: number;
  diario: {
    totalMl: number;
    quantidadeLogs: number;
    logs: LogHidratacao[];
  };
  semanal: {
    totalMl: number;
    quantidadeLogs: number;
    logs: LogHidratacao[];
  };
  mensal: {
    totalMl: number;
    quantidadeLogs: number;
    logs: LogHidratacao[];
  };
}
