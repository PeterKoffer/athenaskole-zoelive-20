export function seedFromId(id: string, salt = 0) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) { 
    h ^= id.charCodeAt(i); 
    h = Math.imul(h, 16777619); 
  }
  return ((h + salt) >>> 0).toString();
}