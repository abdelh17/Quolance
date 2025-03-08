'use client';
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PiCaretDown, PiListBold, PiPlusBold } from 'react-icons/pi';

import { useAuthGuard } from '@/api/auth-api';
import { headerMenu } from '@/constants/data';
import useScroll from '@/util/hooks/useScroll';

import MobileMenu from './MobileMenu';
import NotificationPanel from '../ui/notifications/NotificationPanel';

function Header() {
  const { user, logout } = useAuthGuard({ middleware: 'auth' });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const path = usePathname();
  const [isImageError, setIsImageError] = useState(false);

  const userNavigation = [
    { name: 'My Profile', href: '/profile' },
    { name: 'Settings', href: '/setting' },
    { name: 'Sign out', href: '/auth/login', action: 'logout' },
  ];

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

  const { scrolled } = useScroll();

  return (
    <header className="h-24">
      <div
        className={`left-0 right-0 top-0 z-50 ${
          scrolled
            ? 'animationOne fixed bg-white shadow-md'
            : 'animationTwo absolute'
        }`}
      >
        <div className="max-xxl:container xxl:px-25">
          <div className="text-s1 flex items-center justify-between py-6">
            {/* Left side: Logo and non-user related links */}
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-start gap-3 pb-1">
                {/* Mobile menu button - only visible below lg breakpoint */}
                <button
                  className="lg:hidden text-4xl !leading-none"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <PiListBold className="text-b500 pt-2" />
                </button>
                {user?.role ? (
                  <Link
                    href={
                      user.role === 'ADMIN' ? '/adminDashboard' : '/dashboard'
                    }
                  >
                    <h1 className="text-2xl font-bold">Quolance</h1>
                  </Link>
                ) : (
                  <Link href="/">
                    <h1 data-test="quolance-header-unauthenticated"  className="text-2xl font-bold">Quolance</h1>
                  </Link>
                )}
              </div>

              {/* Desktop Navigation - visible from lg breakpoint and up */}
              <div className="hidden lg:block">
                <ul className="xxl:gap-6 flex items-center justify-start gap-2 font-medium">
                  {headerMenu.map((menu) => (
                    <li key={menu.id}>
                      {menu.isSubmenu && (
                        <div className="group relative cursor-pointer">
                          <div
                            className={`subMenuTitle hover:text-b500 relative flex items-center justify-center gap-1 px-2 py-3 ${
                              isMenuActive(menu) ? 'text-b500' : ''
                            }`}
                            data-test={`${menu.name}`}
                          >
                            {menu.name}
                            <PiCaretDown className="block pt-0.5 duration-700 group-hover:rotate-180" />
                          </div>
                          <ul className="group-hover:eventunset ltl:left-0 bg-b300 pointer-events-none invisible absolute top-12 flex w-[220px] translate-y-8 scale-75 flex-col items-start justify-start gap-3 rounded-lg py-6 font-medium text-white/90 opacity-0 duration-500 group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 rtl:right-0">
                            {menu.submenu?.map(({ id, name, link }) => (
                              <li key={id}>
                                <Link
                                  href={link}
                                  className={`subMenuItem hover:text-y200 px-6 duration-500 hover:ml-2 ${
                                    path === link && 'text-y200'
                                  }`}
                                  data-test={`${name}`}
                                >
                                  {name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: User-related content - Desktop only */}
            <div className="hidden lg:flex items-center gap-6">
              {!user?.email ? (
                <ul className="flex items-center gap-2 font-medium">
                  <li className="hover:text-b500 duration-500">
                    <Link data-test="sign-up-header" href="/auth/register" className="rounded-lg px-2 py-3">
                      Sign up
                    </Link>
                  </li>
                  <li className="hover:text-b500 duration-500">
                    <Link data-test="sign-in-header" href="/auth/login" className="rounded-lg px-2 py-3">
                      Sign in
                    </Link>
                  </li>
                </ul>
              ) : (
                <div className="flex items-center gap-6">
                  <ul className="xxl:gap-6 flex items-center justify-start gap-2 font-medium">
                    <li className="hover:text-b500 duration-500">
                      <Link
                        href={
                          user.role === 'ADMIN'
                            ? '/adminDashboard'
                            : '/dashboard'
                        }
                      >
                        Dashboard
                      </Link>
                    </li>
                    {user?.role === 'FREELANCER' && (
                      <li className="hover:text-b500 duration-500">
                        <Link href="/profile">My profile</Link>
                      </li>
                    )}
                    <li className="hover:text-b500 duration-500">
                      <Link href="/setting">Settings</Link>
                    </li>
                    <li
                      className="hover:text-b500 cursor-pointer duration-500"
                      onClick={() => logout()}
                    >
                      Sign out
                    </li>
                  </ul>

                  <Disclosure as="nav" className="bg-white">
                    <div className="flex items-center">
                      {/* Bell icon with real notification badge */}
                      <div className="relative">
                          <NotificationPanel />
                      </div>
                      {user?.role === 'FREELANCER' && (
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {!isImageError && user.profileImageUrl ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img
                                    alt=""
                                    src={user.profileImageUrl}
                                    className="object-cover w-full h-full"
                                    onError={() => setIsImageError(true)}
                                  />
                                </div>
                              ) : (
                                <div className="size-8 rounded-full bg-blue-400 backdrop-blur-sm flex items-center justify-center text-white">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                            </MenuButton>
                          </div>
                          <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                {item.action === 'logout' ? (
                                  <button
                                    type="button"
                                    onClick={() => logout()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        logout();
                                      }
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 cursor-pointer focus:bg-gray-100 focus:outline-none"
                                  >
                                    {item.name}
                                  </button>
                                ) : (
                                  <Link
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                      )}
                    </div>
                  </Disclosure>

                  {user?.role === 'CLIENT' && (
                    <Link
                      href="/post-project"
                      className="bg-b300 hover:text-n900 max-xxl:size-11 max-xxl:!leading-none xxl:px-8 xxl:py-3 relative flex items-center justify-center overflow-hidden rounded-full text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
                    >
                      <span className="max-xxl:hidden relative z-10">
                        Post A Project
                      </span>
                      <PiPlusBold className="xxl:hidden relative z-10 text-xl" />
                    </Link>
                  )}
                  {user?.role === 'FREELANCER' && (
                    <Link
                      href="/projects"
                      className="bg-b50 text-b300 hover:text-n900 relative overflow-hidden rounded-full px-8 py-3 duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] max-xl:hidden"
                    >
                      <span className="relative z-10">
                        Browse All Projects
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only render below lg breakpoint */}
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
