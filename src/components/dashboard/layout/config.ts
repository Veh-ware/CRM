import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

const adminLoginData: string | null = localStorage.getItem('AdminloginData');
const userType = adminLoginData ? JSON.parse(adminLoginData).type : null;

// All possible navigation items
const allNavItems: NavItemConfig[] = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'dashboard' },
  { key: 'subadmin', title: 'Sub Admin', href: paths.dashboard.subadmin, icon: 'SupervisorAccountIcon' },
  { key: 'employ', title: 'Employee', href: paths.dashboard.employ, icon: 'users' },
  { key: 'client', title: 'Client', href: paths.dashboard.client, icon: 'user' },
  { key: 'invoice', title: 'Invoice', href: paths.dashboard.invoice, icon: 'ReceiptIcon' },
  { key: 'branding', title: 'Branding', href: paths.dashboard.branding, icon: 'StoreIcon' },
  { key: 'biometric', title: 'Employee Biometric', href: paths.dashboard.biometric, icon: 'UpdateIcon' },
];


export const navItems = (userType === 'employee')
  ? allNavItems.filter(item => item.key !== 'biometric' && item.key !== 'employ' && item.key !== 'subadmin')
  : (userType === 'sub-admin') ? allNavItems.filter(item => item.key !== 'subadmin') :
    allNavItems;
