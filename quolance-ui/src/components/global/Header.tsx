'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PiCaretDown, PiListBold, PiPlusBold } from 'react-icons/pi';

import { useAuthGuard } from '@/api/auth-api';
import { authenticatedHeaderMenu } from '@/constants/header-data';
import useScroll from '@/util/hooks/useScroll';

import MobileMenu from './MobileMenu';
import NotificationPanel from '../ui/notifications/NotificationPanel';

function Header() {
  const { user, logout } = useAuthGuard({ middleware: 'auth' });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const path = usePathname();
  const { scrolled } = useScroll();

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

  const isMenuActive = (menu: MenuItem) => {
    if (menu.isSubmenu && menu.submenu) {
      return menu.submenu.some((submenu: SubMenuItem) => path === submenu.link);
    }
    return path === menu.link;
  };

  return (
    <header className="h-24">
      <motion.div
        className={`left-0 right-0 top-0 z-50 ${
          scrolled
            ? 'fixed bg-white/95 backdrop-blur-sm shadow-lg'
            : 'absolute bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7.5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            {/* Left side: Logo and non-user related links */}
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-start gap-3">
                {/* Mobile menu button - only visible below lg breakpoint */}
                <button
                  className="text-3xl !leading-none lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setShowMobileMenu(true)}
                  aria-label="Open menu"
                >
                  <PiListBold className="pt-1" />
                </button>
                
                {user?.role ? (
                  <Link
                    href={
                      user.role === 'ADMIN' ? '/adminDashboard' : '/dashboard'
                    }
                    className="flex items-center"
                  >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Quolance</h1>
                  </Link>
                ) : (
                  <Link href="/" className="flex items-center">
                    <h1
                      data-test="quolance-header-unauthenticated"
                      className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
                    >
                      Quolance
                    </h1>
                  </Link>
                )}
              </div>

              {/* Desktop Navigation - visible from lg breakpoint and up */}
              <div className="hidden lg:block ml-6">
                <ul className="flex items-center justify-start gap-5 font-medium">
                  {authenticatedHeaderMenu.map((menu) => (
                    <li key={menu.id}>
                      {menu.isSubmenu && (
                        <div className="group relative">
                          <div
                            className={`relative flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                              isMenuActive(menu) 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'hover:text-blue-600 hover:bg-gray-50'
                            }`}
                            data-test={`${menu.name}`}
                          >
                            {menu.name}
                            <PiCaretDown className="block pt-0.5 duration-300 group-hover:rotate-180" />
                          </div>
                          <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <ul className="bg-white rounded-xl py-2 shadow-lg text-gray-700 border border-gray-100 w-[240px]">
                              {menu.submenu?.map(({ id, name, link }) => (
                                <li key={id} className="w-full">
                                  <Link
                                    href={link}
                                    className={`block px-4 py-2.5 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${
                                      path === link ? 'text-blue-600 bg-blue-50/60' : ''
                                    }`}
                                    data-test={`${name}`}
                                  >
                                    {name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: User-related content - Desktop only */}
            <div className="hidden items-center gap-5 lg:flex">
              {!user?.email ? (
                <div className="flex items-center gap-4 font-medium">
                  <Link
                    data-test="sign-in-header"
                    href="/auth/login"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    data-test="sign-up-header"
                    href="/auth/register"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <ul className="flex items-center gap-4 font-medium">
                    <li>
                      <NotificationPanel />
                    </li>
                    <li>
                      <Link
                        href={
                          user.role === 'ADMIN'
                            ? '/adminDashboard'
                            : '/dashboard'
                        }
                        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                          path === '/dashboard' || path === '/adminDashboard'
                            ? 'text-blue-600 bg-blue-50'
                            : 'hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        Dashboard
                      </Link>
                    </li>
                    {user?.role === 'FREELANCER' && (
                      <li>
                        <Link
                          href="/profile"
                          className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                            path === '/profile'
                              ? 'text-blue-600 bg-blue-50'
                              : 'hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          My profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/blog"
                        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                          path === '/blog'
                            ? 'text-blue-600 bg-blue-50'
                            : 'hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/setting"
                        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                          path === '/setting'
                            ? 'text-blue-600 bg-blue-50'
                            : 'hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        Settings
                      </Link>
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg cursor-pointer hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                      onClick={() => logout()}
                    >
                      Sign out
                    </li>
                  </ul>

                  {user?.role === 'CLIENT' && (
                    <Link
                      href="/post-project"
                      className="relative group flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <PiPlusBold className="text-lg" />
                        Post A Project
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}
                  {user?.role === 'FREELANCER' && (
                    <Link
                      href="/projects"
                      className="relative group flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]"
                    >
                      <span className="relative z-10">Browse All Projects</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Original Mobile Menu Component */}
      <div className="lg:hidden">
        <MobileMenu
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          user={user}
          logout={logout}
        />
      </div>
    </header>
  );
}

export default Header;