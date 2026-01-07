const STORAGE_KEY = 'crudcrud_api_key'

/**
 * Menyimpan API Key ke sessionStorage
 */
export function setApiKey(key) {
  if (!key || typeof key !== 'string') {
    console.warn('API Key tidak valid!')
    return
  }
  sessionStorage.setItem(STORAGE_KEY, key)
}

/**
 * Mengambil API Key dari sessionStorage
 */
export function getApiKey() {
  return sessionStorage.getItem(STORAGE_KEY)
}

/**
 * Menghapus API Key dari sessionStorage
 */
export function clearApiKey() {
  sessionStorage.removeItem(STORAGE_KEY)
}

/**
 * Mengecek apakah API Key tersedia
 */
export function isApiKeyAvailable() {
  const key = getApiKey()
  return key !== null && key.trim() !== ''
}
