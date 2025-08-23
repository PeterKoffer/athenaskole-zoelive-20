import { UniverseState } from "./state";

const K = (uid: string) => `nelie_universe:${uid}`;

export function loadArc(uid: string): UniverseState | null {
  try {
    const stored = localStorage.getItem(K(uid));
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load universe arc:', error);
    return null;
  }
}

export function saveArc(uid: string, state: UniverseState): void {
  try {
    localStorage.setItem(K(uid), JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save universe arc:', error);
  }
}

export function deleteArc(uid: string): void {
  try {
    localStorage.removeItem(K(uid));
  } catch (error) {
    console.error('Failed to delete universe arc:', error);
  }
}

export function listArcs(): Array<{uid: string, state: UniverseState}> {
  const arcs: Array<{uid: string, state: UniverseState}> = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nelie_universe:')) {
        const uid = key.replace('nelie_universe:', '');
        const state = loadArc(uid);
        if (state) {
          arcs.push({ uid, state });
        }
      }
    }
  } catch (error) {
    console.error('Failed to list universe arcs:', error);
  }
  
  return arcs;
}