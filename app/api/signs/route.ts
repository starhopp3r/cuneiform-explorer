import { NextResponse } from 'next/server'
import { getSigns, addSign, updateSign, deleteSign } from '@/lib/db'
import { CuneiformSign } from '@/lib/data'

export async function GET() {
  try {
    const signs = await getSigns()
    return NextResponse.json(signs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch signs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sign: CuneiformSign = await request.json()
    await addSign(sign)
    return NextResponse.json({ message: 'Sign added successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add sign' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const sign: CuneiformSign = await request.json()
    await updateSign(sign)
    return NextResponse.json({ message: 'Sign updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sign' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await deleteSign(id)
    return NextResponse.json({ message: 'Sign deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sign' }, { status: 500 })
  }
} 