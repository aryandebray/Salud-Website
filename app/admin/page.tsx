'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C08261]"></div>
    </div>
  );
} 