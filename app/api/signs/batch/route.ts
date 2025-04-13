import { NextResponse } from 'next/server'
import { getSigns, addSigns } from '@/lib/db'
import { CuneiformSign } from '@/lib/data'

export async function POST(request: Request) {
  try {
    const signs: CuneiformSign[] = await request.json()
    
    // Get existing signs to check for duplicates
    const existingSigns = await getSigns()
    const existingSignMap = new Map(existingSigns.map(sign => [sign.sign, true]))
    
    // Filter out duplicates and ensure each sign is valid
    const newSigns = signs.filter(sign => {
      // Check if the sign is not empty and not already in the database
      return sign.sign.trim() && sign.name.trim() && !existingSignMap.has(sign.sign)
    })
    
    if (newSigns.length > 0) {
      // Add all new signs at once
      await addSigns(newSigns)
    }
    
    return NextResponse.json({ 
      message: 'Signs imported successfully',
      imported: newSigns.length,
      skipped: signs.length - newSigns.length
    })
  } catch (error) {
    console.error('Error importing signs:', error)
    return NextResponse.json({ error: 'Failed to import signs' }, { status: 500 })
  }
} 