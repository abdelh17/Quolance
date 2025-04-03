import Link from 'next/link';
import { SetStateAction, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import { PiCaretRight, PiX } from 'react-icons/pi';
import { motion } from 'framer-motion';

import { mobileHeaderMenu } from '@/constants/header-data';
import useToggle from '@/util/hooks/useToggle';
import { UserResponse } from '@/models/user/UserResponse';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  isSubmenu: boolean;
  link?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  name: string;
  link: string;
}


function MobileMenu({
  showMobileMenu,
  setShowMobileMenu,
  user,
  logout,
}: {
  showMobileMenu: boolean;
  setShowMobileMenu: React.Dispatch<SetStateAction<boolean>>;
  user: UserResponse | undefined;
  logout: () => void;
}) {
  const { menuToggle, handleToggle } = useToggle();
  const path = usePathname();

  // Close mobile menu on path change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [path, setShowMobileMenu]);

  // Handler to close menu when a link is clicked
  const handleLinkClick = () => {
    setShowMobileMenu(false);
  };

  // Handler for logout that closes menu and calls logout function
  const handleLogout = () => {
    setShowMobileMenu(false);
    logout();
  };

  // Check if a menu item or its submenu is active
  const isMenuActive = (link?: string, submenu?: any[]) => {
    if (submenu) {
      return submenu.some((item) => item.link === path);
    }
    return link === path;
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showMobileMenu ? 0.5 : 0,
          transitionEnd: { 
            visibility: showMobileMenu ? "visible" : "hidden" 
          }
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[998] bg-gray-900 backdrop-blur-sm"
        onClick={() => setShowMobileMenu(false)}
      />

      {/* Mobile menu panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ 
          x: showMobileMenu ? 0 : '-100%',
          transitionEnd: { 
            visibility: showMobileMenu ? "visible" : "hidden" 
          }
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 bottom-0 z-[999] w-3/4 min-[500px]:w-1/2 max-w-sm flex flex-col bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden"
      >
        <div className="flex items-center justify-between p-5">
          <Link
            href={user ? '/dashboard' : '/'}
            className="text-2xl font-bold text-white"
            onClick={handleLinkClick}
          >
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Quolance
            </span>
          </Link>
          <button
            className="p-2 text-3xl text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu"
          >
            <PiX />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col space-y-1 px-4">
            {mobileHeaderMenu.map((menu: MenuItem) => (
              <li key={menu.id} className="w-full">
                {menu.isSubmenu ? (
                  <div className="rounded-lg overflow-hidden">
                    <button
                      className={`flex w-full items-center justify-between py-3 px-4 rounded-lg ${
                        isMenuActive(undefined, menu.submenu) 
                          ? 'bg-white/15 text-white' 
                          : 'hover:bg-white/10 text-white/90 hover:text-white'
                      }`}
                      onClick={() => handleToggle(menu.id)}
                    >
                      <span className="text-base font-medium">{menu.name}</span>
                      <motion.span
                        animate={{ rotate: menuToggle === menu.id ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg"
                      >
                        <PiCaretRight />
                      </motion.span>
                    </button>
                    
                    <AnimateHeight
                      duration={300}
                      height={menuToggle === menu.id ? 'auto' : 0}
                      easing="ease-in-out"
                    >
                      <ul className="bg-white/5 rounded-b-lg mb-1">
                        {menu.submenu?.map(({ id, name, link }) => (
                          <li key={id}>
                            <Link
                              href={link}
                              className={`block py-2.5 px-8 text-sm ${
                                path === link 
                                  ? 'text-blue-200' 
                                  : 'text-white/80 hover:text-white'
                              }`}
                              onClick={handleLinkClick}
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AnimateHeight>
                  </div>
                ) : (
                  <Link
                    href={menu.link || '#'}
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      isMenuActive(menu.link) 
                        ? 'bg-white/15 text-white' 
                        : 'hover:bg-white/10 text-white/90 hover:text-white'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="text-base font-medium">{menu.name}</span>
                  </Link>
                )}
              </li>
            ))}

            {/* User-specific menu items */}
            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      path === '/dashboard' 
                        ? 'bg-white/15 text-white' 
                        : 'hover:bg-white/10 text-white/90 hover:text-white'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="text-base font-medium">Dashboard</span>
                  </Link>
                </li>
                {user.role === 'FREELANCER' && (
                  <li>
                    <Link
                      href="/profile"
                      className={`block py-3 px-4 rounded-lg transition-colors ${
                        path === '/profile' 
                          ? 'bg-white/15 text-white' 
                          : 'hover:bg-white/10 text-white/90 hover:text-white'
                      }`}
                      onClick={handleLinkClick}
                    >
                      <span className="text-base font-medium">My Profile</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/setting"
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      path === '/setting' 
                        ? 'bg-white/15 text-white' 
                        : 'hover:bg-white/10 text-white/90 hover:text-white'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="text-base font-medium">Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full text-left py-3 px-4 rounded-lg transition-colors text-white/90 hover:text-white hover:bg-red-500/20"
                    onClick={handleLogout}
                  >
                    <span className="text-base font-medium">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="block py-3 px-4 rounded-lg transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                    onClick={handleLinkClick}
                  >
                    <span className="text-base font-medium">Sign in</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="block py-3 px-4 rounded-lg transition-colors bg-white/15 text-white"
                    onClick={handleLinkClick}
                  >
                    <span className="text-base font-medium">Sign up</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Action button at the bottom */}
        {user && (
          <div className="px-4 py-5 border-t border-white/10">
            {user.role === 'CLIENT' && (
              <Link
                href="/post-project"
                className="block w-full py-3 px-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-medium text-center transition-all hover:shadow-lg hover:shadow-yellow-500/20"
                onClick={handleLinkClick}
              >
                Post A Project
              </Link>
            )}
            {user.role === 'FREELANCER' && (
              <Link
                href="/projects"
                className="block w-full py-3 px-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-medium text-center transition-all hover:shadow-lg hover:shadow-yellow-500/20"
                onClick={handleLinkClick}
              >
                Browse All Projects
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
}

export default MobileMenu;