import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Fix the parameter typing here
export async function GET(
  req: NextRequest,
  context: { params: { number: string } }
) {
  const { number } = context.params

  try {
    const congregation = await prisma.congregation.findUnique({
      where: {
        idCongregation: parseInt(number),
      },
    })

    if (!congregation) {
      return NextResponse.json({ message: 'Congregation not found' }, { status: 404 })
    }

    return NextResponse.json(congregation)
  } catch (error) {
    console.error('Error fetching congregation:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
