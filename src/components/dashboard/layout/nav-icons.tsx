import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StoreIcon from '@mui/icons-material/Store';
import UpdateIcon from '@mui/icons-material/Update';

export const navIcons = {
  'gear-six': GearSixIcon,
  'x-square': XSquare,
  'user': UserIcon,
  'users': UsersIcon,
  'dashboard': DashboardCustomizeIcon as unknown as Icon, // Type cast to Icon to match type
  'SupervisorAccountIcon': SupervisorAccountIcon  as unknown as Icon,
  'ReceiptIcon': ReceiptIcon  as unknown as Icon,
  'StoreIcon': StoreIcon  as unknown as Icon,
  'UpdateIcon': UpdateIcon  as unknown as Icon,



} as Record<string, Icon>;
