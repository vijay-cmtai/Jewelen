import { redirect } from 'next/navigation';
export default function AccountRootPage() {
  redirect('/account/dashboard');
  return null;
}