import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MenuCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get all menu items
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category } = body;

    // Validate category
    if (!Object.values(MenuCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        category: category as MenuCategory,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
} 