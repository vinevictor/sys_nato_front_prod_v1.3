// src/stores/useConstrutoraStore.ts
import { create } from 'zustand';

// Defina os tipos para o estado e as ações
interface Construtora {
  id: string;
  name: string;
  // ... outros campos da construtora
}

interface ConstrutoraState {
  construtoras: Construtora[];
  isLoading: boolean;
  error: string | null;
}

interface ConstrutoraActions {
  fetchConstrutoras: () => Promise<void>;
  addConstrutora: (newConstrutora: Omit<Construtora, 'id'>) => Promise<void>;
}

// Crie o store
export const useConstrutoraStore = create<ConstrutoraState & ConstrutoraActions>((set) => ({
  // Estado inicial
  construtoras: [],
  isLoading: false,
  error: null,

  // Ação para buscar dados
  fetchConstrutoras: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simula uma chamada de API que você já deve ter em algum lugar
      const response = await fetch('/api/construtoras');
      if (!response.ok) throw new Error('Falha ao buscar construtoras');
      const data: Construtora[] = await response.json();
      set({ construtoras: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // Ação para adicionar um novo item
  addConstrutora: async (newConstrutora) => {
    try {
      // Simula uma chamada de API POST
      const response = await fetch('/api/construtoras', {
        method: 'POST',
        body: JSON.stringify(newConstrutora),
        headers: { 'Content-Type': 'application/json' },
      });
      const addedConstrutora: Construtora = await response.json();
      
      // Atualiza o estado local de forma imutável
      set((state) => ({
        construtoras: [...state.construtoras, addedConstrutora],
      }));
    } catch (e: any) {
      // Lidar com o erro
      console.error("Falha ao adicionar construtora", e);
    }
  },
}));
