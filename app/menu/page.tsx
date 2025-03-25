import prisma from '@/lib/prisma';
import type { MenuItem } from '@prisma/client';

async function getMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {menuItems.map((item: MenuItem) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-xl font-semibold">{item.name}</h3>
            {item.description && (
              <p className="text-gray-600 mt-1">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 