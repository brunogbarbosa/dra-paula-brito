import type { Metadata } from 'next';
import { PreAnamnese } from '@/components/pre-anamnese';

export const metadata: Metadata = {
  title: 'Pré-anamnese | Dra. Paula Brito',
  description: 'Um primeiro olhar para você. Prepare sua avaliação com a Dra. Paula Brito.',
  alternates: { canonical: '/pre-anamnese' },
  robots: { index: false, follow: true },
};
export default function Page() { return <PreAnamnese />; }
