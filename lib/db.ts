import fs from 'fs/promises'
import path from 'path'
import { CuneiformSign, initialSigns } from './data'

const DB_PATH = path.join(process.cwd(), 'data', 'signs.json')

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DB_PATH)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

// Initialize the database with empty array if it doesn't exist
async function initializeDb() {
  try {
    await fs.access(DB_PATH)
    // Verify the file contains valid JSON
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid data format in database file')
    }
  } catch {
    await ensureDataDir()
    await fs.writeFile(DB_PATH, JSON.stringify(initialSigns, null, 2))
  }
}

// Get all signs
export async function getSigns(): Promise<CuneiformSign[]> {
  await initializeDb()
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const signs = JSON.parse(data)
    if (!Array.isArray(signs)) {
      throw new Error('Invalid data format in database file')
    }
    return signs
  } catch (error) {
    console.error('Error reading signs:', error)
    // If there's an error reading the file, return empty array
    return []
  }
}

// Add a new sign
export async function addSign(sign: CuneiformSign): Promise<void> {
  const signs = await getSigns()
  signs.push(sign)
  await fs.writeFile(DB_PATH, JSON.stringify(signs, null, 2))
}

// Add multiple signs
export async function addSigns(signsToAdd: CuneiformSign[]): Promise<void> {
  const signs = await getSigns()
  signs.push(...signsToAdd)
  await fs.writeFile(DB_PATH, JSON.stringify(signs, null, 2))
}

// Update a sign
export async function updateSign(updatedSign: CuneiformSign): Promise<void> {
  const signs = await getSigns()
  const index = signs.findIndex(sign => sign.id === updatedSign.id)
  if (index !== -1) {
    signs[index] = updatedSign
    await fs.writeFile(DB_PATH, JSON.stringify(signs, null, 2))
  }
}

// Delete a sign
export async function deleteSign(id: string): Promise<void> {
  const signs = await getSigns()
  const filteredSigns = signs.filter(sign => sign.id !== id)
  await fs.writeFile(DB_PATH, JSON.stringify(filteredSigns, null, 2))
} 