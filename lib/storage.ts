import { CuneiformSign, initialSigns } from './data'

const STORAGE_KEY = 'cuneiform_signs'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Initialize the database with empty array if it doesn't exist
function initializeDb() {
  if (!isBrowser) return
  
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (!storedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSigns))
  } else {
    try {
      const parsed = JSON.parse(storedData)
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid data format in storage')
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSigns))
    }
  }
}

// Get all signs
export function getSigns(): CuneiformSign[] {
  if (!isBrowser) return initialSigns
  
  initializeDb()
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return initialSigns
    const signs = JSON.parse(data)
    if (!Array.isArray(signs)) {
      throw new Error('Invalid data format in storage')
    }
    return signs
  } catch (error) {
    console.error('Error reading signs:', error)
    return initialSigns
  }
}

// Add a new sign
export function addSign(sign: CuneiformSign): void {
  if (!isBrowser) return
  
  const signs = getSigns()
  signs.push(sign)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signs))
}

// Add multiple signs
export function addSigns(signsToAdd: CuneiformSign[]): void {
  if (!isBrowser) return
  
  const signs = getSigns()
  signs.push(...signsToAdd)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signs))
}

// Update a sign
export function updateSign(updatedSign: CuneiformSign): void {
  if (!isBrowser) return
  
  const signs = getSigns()
  const index = signs.findIndex(sign => sign.id === updatedSign.id)
  if (index !== -1) {
    signs[index] = updatedSign
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signs))
  }
}

// Delete a sign
export function deleteSign(id: string): void {
  if (!isBrowser) return
  
  const signs = getSigns()
  const filteredSigns = signs.filter(sign => sign.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSigns))
} 