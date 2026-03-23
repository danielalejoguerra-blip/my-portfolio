import { redirect } from 'next/navigation';

// La ruta / del grupo (dashboard) redirige a welcome
export default function DashboardIndexPage() {
  redirect('/dashboard/welcome');
}

