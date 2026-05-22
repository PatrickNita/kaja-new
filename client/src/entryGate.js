export const ENTRY_APPROVED_KEY = 'kaja-entry-approved';

export function isEntryApproved() {
  return sessionStorage.getItem(ENTRY_APPROVED_KEY) === '1';
}
