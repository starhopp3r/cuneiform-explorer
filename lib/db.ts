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

// Initialize the database with default data if it doesn't exist
async function initializeDb() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await ensureDataDir()
    await fs.writeFile(DB_PATH, JSON.stringify(initialSigns, null, 2))
  }
}

// Get all signs
export async function getSigns(): Promise<CuneiformSign[]> {
  await initializeDb()
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

// Add a new sign
export async function addSign(sign: CuneiformSign): Promise<void> {
  const signs = await getSigns()
  signs.push(sign)
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