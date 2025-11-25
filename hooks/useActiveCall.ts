import { useState, useCallback, useEffect } from 'react';

interface CallState {
  activeCallRoom: string | null;
  callType: 'video' | 'audio' | null;
  callParticipant: string | null;
  isInCall: boolean;
}

let callState: CallState = {
  activeCallRoom: null,
  callType: null,
  callParticipant: null,
  isInCall: false,
};

const listeners = new Set<(state: CallState) => void>();

const updateState = (newState: Partial<CallState>) => {
  callState = { ...callState, ...newState };
  listeners.forEach((listener) => listener(callState));
};

export const useActiveCall = () => {
  const [state, setState] = useState<CallState>(callState);

  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, []);

  const subscribe = useCallback(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const startCall = useCallback(
    (roomUrl: string, type: 'video' | 'audio', participant: string) => {
      updateState({
        activeCallRoom: roomUrl,
        callType: type,
        callParticipant: participant,
        isInCall: true,
      });
    },
    []
  );

  const endCall = useCallback(() => {
    updateState({
      activeCallRoom: null,
      callType: null,
      callParticipant: null,
      isInCall: false,
    });
  }, []);

  return {
    ...state,
    startCall,
    endCall,
  };
};
