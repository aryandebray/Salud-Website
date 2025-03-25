'use client';

import { useEffect, useState } from 'react';
import { MenuCategory } from '@prisma/client';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: MenuCategory;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to load menu');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C08261]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  // Define category order and display names
  const categoryOrder: MenuCategory[] = [
    MenuCategory.Drink,
    MenuCategory.AmuseBouche,
    MenuCategory.Soup,
    MenuCategory.MainCourse,
    MenuCategory.Dessert
  ];

  const categoryDisplayNames: Record<MenuCategory, string> = {
    [MenuCategory.Drink]: 'Drink',
    [MenuCategory.AmuseBouche]: 'Amuse-Bouche',
    [MenuCategory.Soup]: 'Soup',
    [MenuCategory.MainCourse]: 'Main Course',
    [MenuCategory.Dessert]: 'Dessert'
  };

  return (
    <div id="menu" className="min-h-screen bg-[#F7E6D3] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#C08261] mb-4 font-serif">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif">
            Discover our carefully curated selection of dishes, crafted with passion and the finest ingredients.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-12">
          {categoryOrder.map((category) => (
            <div key={category} className="space-y-6">
              <h3 className="text-3xl font-serif text-[#C08261] text-center border-b-2 border-[#C08261] pb-2">
                {categoryDisplayNames[category]}
              </h3>
              <div className="grid gap-6">
                {menuByCategory[category]?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200 border border-[#F7E6D3]"
                  >
                    <h4 className="text-2xl font-semibold text-[#C08261] text-center font-serif">{item.name}</h4>
                    {item.description && (
                      <p className="text-gray-600 mt-4 text-center font-serif">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 