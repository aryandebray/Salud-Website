import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching reservations from database...');
    
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Successfully fetched ${reservations.length} reservations`);
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
} 