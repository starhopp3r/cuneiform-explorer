import { NextResponse } from 'next/server'
import { getSigns, addSign, updateSign, deleteSign } from '@/lib/storage'
import { CuneiformSign } from '@/lib/data'

// Since we're using client-side storage, these API routes will just return the initial data
// The actual storage operations will happen on the client side

export async function GET() {
  try {
    const signs = getSigns()
    return NextResponse.json(signs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch signs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sign: CuneiformSign = await request.json()
    addSign(sign)
    return NextResponse.json({ message: 'Sign added successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add sign' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sign: CuneiformSign = await request.json()
    updateSign(sign)
    return NextResponse.json({ message: 'Sign updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sign' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    deleteSign(id)
    return NextResponse.json({ message: 'Sign deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sign' }, { status: 500 })
  }
} 