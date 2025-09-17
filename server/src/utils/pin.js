export function generatePin(surname, referenceNumber){
  const surname_clean = (surname||'').toLowerCase().trim();
  const last_four = (referenceNumber||'').slice(-4);
  return surname_clean + last_four;
}
