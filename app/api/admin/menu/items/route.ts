import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Create new menu item
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        imageUrl: data.imageUrl,
        menuId: data.menuId,
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

// Update menu item
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const menuItem = await prisma.menuItem.update({
      where: {
        id: id,
      },
      data: {
        name: updateData.name,
        description: updateData.description,
        price: parseFloat(updateData.price),
        category: updateData.category,
        imageUrl: updateData.imageUrl,
        isAvailable: updateData.isAvailable,
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

// Delete menu item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    await prisma.menuItem.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 