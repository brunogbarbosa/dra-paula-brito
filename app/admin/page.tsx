import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin-dashboard';

export const metadata: Metadata = {
  title: 'Painel clínico | Dra. Paula Brito',
  description: 'Área privada para gestão das pré-anamneses.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
