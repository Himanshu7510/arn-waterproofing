import { notFound } from 'next/navigation';
import CollectionManager from '@/components/admin/CollectionManager';
import { COLLECTIONS } from '@/lib/schema';

export async function generateMetadata({ params }) {
  const { name } = await params;
  return { title: COLLECTIONS[name]?.label || 'Content' };
}

export default async function Page({ params }) {
  const { name } = await params;
  if (!COLLECTIONS[name]) notFound();
  return <CollectionManager key={name} name={name} />;
}
