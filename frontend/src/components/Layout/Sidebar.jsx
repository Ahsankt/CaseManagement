import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  Scale,
  UserCheck,
  FileSearch,
  PlusCircle
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home }
    ];

    const roleSpecificItems = {
      [USER_ROLES.REGISTRAR]: [
        { name: 'Register Case', href: '/cases/register', icon: PlusCircle },
        { name: 'All Cases', href: '/cases/all', icon: FileSearch },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Assignments', href: '/assignments', icon: UserCheck },
      ],
      [USER_ROLES.JUDGE]: [
        { name: 'My Cases', href: '/cases', icon: Scale },
        { name: 'All Cases', href: '/cases/all', icon: FileSearch },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
      ],
      [USER_ROLES.LAWYER]: [
        { name: 'My Cases', href: '/cases', icon: FileText },
        { name: 'Clients', href: '/clients', icon: Users },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
      ],
      [USER_ROLES.USER]: [
        { name: 'My Cases', href: '/cases', icon: FileText },
      ],
    };

    const items = [...baseItems, ...(roleSpecificItems[user?.role] || [])];
    
    // Add settings for all users
    items.push({ name: 'Settings', href: '/settings', icon: Settings });
    
    return items;
  };

  const navigation = getNavigationItems();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
