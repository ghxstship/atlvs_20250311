import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { Ship, Palmtree as PalmTree, Skull, Flag, Anchor, Coins, User, CreditCard, Settings, HelpCircle, ChevronDown, ChevronRight, ChevronUp, Plus, Minus, Users, FileText, Theater, Ticket, Waves, Camera, Drama, Navigation, Navigation2, Map, Files, Calendar, CalendarDays, Radar, X, HardHat, RadioTower, Plane, LayoutDashboard, LogOut, Wrench, Package, Truck, ClipboardList, Book, Building2 } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export default function Sidebar({ isMobile, onClose, isCollapsed }: SidebarProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedSubmenu, setExpandedSubmenu] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { user, signOut } = useAuth();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentSection = mainNavigation.find(item => 
      item.submenu?.some(subItem => currentPath.startsWith(subItem.to))
    );
    if (currentSection && !isCollapsed) {
      setHoveredMenu(currentSection.name);
    }
  }, [location.pathname, isCollapsed]);

  const handleMouseEnter = (menuName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredMenu(menuName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
      setExpandedSubmenu('');
    }, 300);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userMenuItems = [
    { name: 'Profile', to: '/profile', icon: User },
    { name: 'Account', to: '/account', icon: CreditCard },
    { name: 'Settings', to: '/settings', icon: Settings },
    { name: 'Support', to: '/support', icon: HelpCircle }
  ];

  const mainNavigation = [
    {
      name: 'Home Port',
      to: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      to: '/projects',
      icon: Ship,
      submenu: [
        { name: 'Projects', to: '/projects/list', icon: Ship },
        { name: 'Schedule', to: '/projects/schedule', icon: CalendarDays },
        { name: 'Tasks', to: '/projects/tasks', icon: Radar },
        { name: 'Assignments', to: '/projects/assignments', icon: Navigation },
        { name: 'Locations', to: '/projects/locations', icon: Map },
        { name: 'Files', to: '/projects/files', icon: Files }
      ]
    },
    {
      name: 'Events',
      to: '/events',
      icon: PalmTree,
      submenu: [
        { name: 'Events', to: '/events/list', icon: PalmTree },
        { name: 'Ticketing', to: '/events/ticketing', icon: Ticket },
        { name: 'Bookings', to: '/events/bookings', icon: Waves },
        { name: 'Talent', to: '/events/talent', icon: Drama },
        { name: 'Management', to: '/events/management', icon: Flag },
        { name: 'Venues', to: '/events/venues', icon: Theater },
        { name: 'Media', to: '/events/media', icon: Camera }
      ]
    },
    {
      name: 'Crew',
      to: '/crew',
      icon: Skull,
      submenu: [
        { name: 'Roster', to: '/crew/roster', icon: Skull },
        { name: 'Scheduling', to: '/crew/scheduling', icon: CalendarDays },
        { name: 'Timekeeping', to: '/crew/timekeeping', icon: Calendar },
        { name: 'Travel', to: '/crew/travel', icon: Plane },
        { name: 'Onboarding', to: '/crew/onboarding', icon: Navigation2 },
        { name: 'Applicants', to: '/crew/applicants', icon: FileText },
        { name: 'Positions', to: '/crew/positions', icon: HardHat },
        { name: 'Resources', to: '/crew/resources', icon: FileText }
      ]
    },
    {
      name: 'Companies',
      to: '/companies',
      icon: Flag,
      submenu: [
        { name: 'Directory', to: '/companies/list', icon: Flag },
        { name: 'Contacts', to: '/companies/contacts', icon: Users },
        { name: 'Contracts', to: '/companies/contracts', icon: FileText },
        { name: 'Bids', to: '/companies/bids', icon: RadioTower },
        { name: 'Jobs', to: '/companies/jobs', icon: Navigation }
      ]
    },
    {
      name: 'Assets',
      to: '/assets',
      icon: Anchor,
      submenu: [
        { name: 'Assets', to: '/assets/list', icon: Anchor },
        { name: 'Tracking', to: '/assets/tracking', icon: Navigation2 },
        { name: 'Service', to: '/assets/service', icon: Wrench },
        { name: 'Inventory', to: '/assets/inventory', icon: Package },
        { name: 'Logistics', to: '/assets/logistics', icon: Truck },
        { name: 'Advances', to: '/assets/advances', icon: ClipboardList },
        { name: 'Catalog', to: '/assets/catalog', icon: Book }
      ]
    },
    {
      name: 'Finance',
      to: '/finance',
      icon: Coins,
      submenu: [
        { name: 'Budget', to: '/finance/budget', icon: Coins },
        { name: 'Transactions', to: '/finance/transactions', icon: Navigation },
        { name: 'Revenue', to: '/finance/revenue', icon: Plus },
        { name: 'Expenses', to: '/finance/expenses', icon: Minus },
        { name: 'Orders', to: '/finance/orders', icon: Navigation },
        { name: 'Reports', to: '/finance/reports', icon: FileText }
      ]
    }
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
      } h-screen bg-mono-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="shrink-0 px-4 py-6 border-b border-mono-800">
        <button 
          onClick={toggleUserMenu}
          className="w-full flex flex-col items-center"
        >
          <div className={`relative ${isCollapsed ? 'w-8 h-8' : 'w-16 h-16'} rounded-full bg-mono-800 overflow-hidden transition-all duration-300`}>
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className={`${isCollapsed ? 'w-4 h-4' : 'w-8 h-8'} text-mono-400`} />
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="mt-2 text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || 'User Name'}
              </div>
              <div className="text-xs text-mono-400 truncate">
                {user?.email}
              </div>
              <ChevronDown className={`w-4 h-4 mt-1 text-mono-400 transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {isUserMenuOpen && !isCollapsed && (
          <div className="mt-4 py-2 space-y-1 border-t border-mono-800">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className="flex items-center px-2 py-2 text-sm text-mono-400 hover:text-white rounded-md transition-colors"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (isMobile && onClose) {
                      onClose();
                    }
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isHovered = hoveredMenu === item.name;

          return (
            <div key={item.name} className="relative">
              <NavLink
                to={hasSubmenu ? '#' : item.to}
                onClick={(e) => {
                  if (hasSubmenu) {
                    e.preventDefault();
                  } else if (isMobile && onClose) {
                    onClose();
                  }
                }}
                onMouseEnter={() => handleMouseEnter(item.name)}
                className={({ isActive }) =>
                  `flex items-center justify-between h-9 px-2 transition-colors text-sm ${
                    isActive || (hasSubmenu && isHovered)
                      ? 'text-white'
                      : 'text-mono-400 hover:text-white'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center">
                  <Icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </div>
                {hasSubmenu && !isCollapsed && (
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${isHovered ? 'rotate-180' : ''}`} />
                )}
              </NavLink>
              
              {hasSubmenu && (isHovered || (!isCollapsed && hoveredMenu === item.name)) && (
                <div 
                  ref={el => submenuRefs.current[item.name] = el}
                  className={`
                    ${isCollapsed 
                      ? 'absolute left-full top-0 ml-1 bg-mono-800 rounded-md p-1 min-w-[180px] shadow-lg' 
                      : 'mt-1 ml-7'
                    }
                  `}
                  onMouseEnter={() => handleMouseEnter(item.name)}
                >
                  {item.submenu.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <NavLink
                        key={subItem.name}
                        to={subItem.to}
                        onClick={() => {
                          if (isMobile && onClose) {
                            onClose();
                          }
                          if (isCollapsed) {
                            setHoveredMenu(null);
                          }
                        }}
                        className={({ isActive }) =>
                          `flex items-center h-8 px-2 text-sm transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-mono-400 hover:text-white'
                          }`
                        }
                      >
                        <SubIcon className="w-4 h-4 mr-3" />
                        <span className="font-medium">{subItem.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 px-2 py-4 mt-auto border-t border-mono-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-2 py-2 text-sm text-mono-400 hover:text-white hover:bg-mono-800 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}