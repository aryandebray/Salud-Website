'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuCategory } from '@prisma/client';

interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  category: MenuCategory;
}

const categoryDisplayNames: Record<MenuCategory, string> = {
  Drink: 'Drink',
  AmuseBouche: 'Amuse-Bouche',
  Soup: 'Soup',
  MainCourse: 'Main Course',
  Dessert: 'Dessert'
};

export default function MenuManagementPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    category: MenuCategory.MainCourse,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create menu item');
      }

      await fetchMenuItems();
      setShowForm(false);
      setFormData({ name: '', description: '', category: MenuCategory.MainCourse });
    } catch (err) {
      setError('Failed to create menu item');
      console.error('Error creating menu item:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      await fetchMenuItems();
    } catch (err) {
      setError('Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C08261]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7E6D3] p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#C08261]">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant's menu items</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-[#C08261] text-white rounded-md hover:bg-[#B4724F] transition-colors duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#C08261] text-white rounded-md hover:bg-[#B4724F] transition-colors duration-200"
            >
              Add Menu Item
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-[#C08261] mb-6">Add Menu Item</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C08261] focus:ring-[#C08261]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MenuCategory })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C08261] focus:ring-[#C08261]"
                    required
                  >
                    {Object.entries(categoryDisplayNames).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C08261] focus:ring-[#C08261]"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C08261] text-white rounded-md hover:bg-[#B4724F] transition-colors duration-200"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center border border-[#F7E6D3]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-[#C08261]">{item.name}</h3>
                  <span className="text-sm bg-[#F7E6D3] text-[#C08261] px-2 py-1 rounded">
                    {categoryDisplayNames[item.category]}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <button
                onClick={() => item.id && handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 