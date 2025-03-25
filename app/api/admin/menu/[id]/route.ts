import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MenuCategory } from '@prisma/client';

// GET /api/admin/menu/[id] - Get a single menu item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/menu/[id] - Update a menu item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, category } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(MenuCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category: category as MenuCategory,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu/[id] - Delete a menu item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 