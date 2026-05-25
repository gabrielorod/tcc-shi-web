import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL ?? 'http://localhost:3000', {
      transports: ['websocket'],
    });
  }
  return socket;
}

interface HidratacaoSocketCallbacks {
  onGole?: (quantidadeMl: number) => void;
  onAlerta?: (mensagem: string) => void;
  onCalibracaoStatus?: (status: string) => void;
}

export function useHidratacaoSocket(callbacks: HidratacaoSocketCallbacks) {
  const handleGole = useCallback(
    (quantidadeMl: number) => callbacks.onGole?.(quantidadeMl),
    [callbacks],
  );

  const handleAlerta = useCallback(
    (mensagem: string) => callbacks.onAlerta?.(mensagem),
    [callbacks],
  );

  const handleCalibracaoStatus = useCallback(
    (status: string) => callbacks.onCalibracaoStatus?.(status),
    [callbacks],
  );

  useEffect(() => {
    const s = getSocket();

    s.on('gole_registrado', (data: { quantidadeMl: number }) => {
      handleGole(data.quantidadeMl);
    });

    s.on('alerta_hidratacao', (data: { mensagem: string }) => {
      handleAlerta(data.mensagem);
    });

    s.on('calibracao_status', (data: { status: string }) => {
      handleCalibracaoStatus(data.status);
    });

    return () => {
      s.off('gole_registrado');
      s.off('alerta_hidratacao');
      s.off('calibracao_status');
    };
  }, [handleGole, handleAlerta, handleCalibracaoStatus]);
}
