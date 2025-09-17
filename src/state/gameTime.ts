// Simple daily tracker per class/adventure (local + in-memory)
const key = (classId: string, adventureId: string, dateISO: string) => `gt:${classId}:${adventureId}:${dateISO}`;

export function loadGameSeconds(classId: string, adventureId: string, dateISO: string) {
  try { 
    return Number(localStorage.getItem(key(classId, adventureId, dateISO)) || '0'); 
  } catch { 
    return 0; 
  }
}

export function addGameSeconds(classId: string, adventureId: string, dateISO: string, delta: number) {
  const cur = loadGameSeconds(classId, adventureId, dateISO) + delta;
  try { 
    localStorage.setItem(key(classId, adventureId, dateISO), String(cur)); 
  } catch {
    // Ignore storage errors
  }
  return cur;
}