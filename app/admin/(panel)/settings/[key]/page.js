import { notFound } from 'next/navigation';
import SettingsForm from '@/components/admin/SettingsForm';
import { SETTINGS } from '@/lib/schema';

export async function generateMetadata({ params }) {
  const { key } = await params;
  return { title: SETTINGS[key]?.label || 'Settings' };
}

export default async function Page({ params }) {
  const { key } = await params;
  if (!SETTINGS[key]) notFound();
  return <SettingsForm key={key} sectionKey={key} />;
}
