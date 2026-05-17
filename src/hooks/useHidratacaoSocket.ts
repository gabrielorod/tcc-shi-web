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

export function useHidratacaoSocket(onGole: (quantidadeMl: number) => void) {
  const handleGole = useCallback((quantidadeMl: number) => onGole(quantidadeMl), [onGole]);

  useEffect(() => {
    const s = getSocket();

    s.on('gole_registrado', (data: { quantidadeMl: number }) => {
      handleGole(data.quantidadeMl);
    });

    return () => {
      s.off('gole_registrado');
    };
  }, [handleGole]);
}
