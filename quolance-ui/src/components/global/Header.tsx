'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PiCaretDown, PiListBold, PiPlusBold } from 'react-icons/pi';

import { useAuthGuard } from '@/lib/auth/use-auth';

import MobileMenu from './MobileMenu';
import { headerMenu } from '../../data/data';
import useScroll from '../../hooks/useScroll';

function Header() {
  const { user, logout } = useAuthGuard({ middleware: "auth" });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const path = usePathname();

  interface MenuItem {
    id: string;
    name: string;
    isSubmenu: boolean;
    link?: string; // Link is optional for parent menu items
    submenu?: SubMenuItem[]; // Submenu is an array of SubMenuItem objects
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
    <header className=''>
      <div
        className={`left-0 right-0 top-0 z-50 ${scrolled
          ? 'animationOne fixed bg-white shadow-md'
          : 'animationTwo absolute'
          }`}
      >
        <div className='max-xxl:container xxl:px-25'>
          <div className='text-s1 flex items-center justify-between py-6'>
            <div className='flex items-center justify-start gap-3 pb-1'>
              <button
                className='text-4xl !leading-none lg:hidden'
                onClick={() => setShowMobileMenu(true)}
              >
                <PiListBold className='text-b500 pt-2' />
              </button>
              <Link href='/'>
                <h1 className='text-2xl font-bold'>Quolance</h1>
              </Link>
            </div>

            <div className='flex items-center justify-between gap-6 max-lg:hidden'>
              <ul className='xxl:gap-6 flex items-center justify-start gap-2 font-medium max-sm:hidden'>
                {headerMenu.map((menu) => (
                  <li key={menu.id}>
                    {menu.isSubmenu && (
                      <div className='group relative cursor-pointer'>
                        <div
                          className={`subMenuTitle hover:text-b500 relative flex items-center justify-center gap-1 px-2 py-3 ${isMenuActive(menu) ? 'text-b500' : ''
                            }`}
                        >
                          {menu.name}
                          <PiCaretDown className='block pt-0.5 duration-700 group-hover:rotate-180' />
                        </div>
                        <ul className='group-hover:eventunset ltl:left-0 bg-b300 pointer-events-none invisible absolute top-12 flex w-[220px] translate-y-8 scale-75 flex-col items-start justify-start gap-3 rounded-lg py-6 font-medium text-white/90 opacity-0 duration-500 group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 rtl:right-0'>
                          {menu.submenu?.map(({ id, name, link }) => (
                            <li key={id}>
                              <Link
                                href={link}
                                className={`subMenuItem hover:text-y200 px-6 duration-500 hover:ml-2 ${path === link && 'text-y200'
                                  }`}
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
                {
                  user?.email ? (
                    <>

                      <li className='hover:text-b500 duration-500'>
                        <Link href='/profile'>
                          Profile
                        </Link>
                      </li>
                      <li className='hover:text-b500 cursor-pointer duration-500' onClick={() => logout()}>
                        Logout
                      </li>
                    </>
                  )
                    :
                    <>
                      <li className='hover:text-b500 duration-500'>
                        <Link href='/auth/register' className='rounded-lg px-2 py-3 '>
                          Sign up
                        </Link>
                      </li>
                      <li className='hover:text-b500 duration-500'>
                        <Link href='/auth/login' className='rounded-lg px-2 py-3'>
                          Sign in
                        </Link>
                      </li>
                    </>
                }

              </ul>
              <div className='flex items-center justify-between gap-3 font-semibold'>
                <Link
                  href='/post-project'
                  className='bg-b300 hover:text-n900 max-xxl:size-11 max-xxl:!leading-none xxl:px-8 xxl:py-3 relative flex items-center justify-center overflow-hidden rounded-full text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                >
                  <span className='max-xxl:hidden relative z-10'>
                    Post A Project
                  </span>
                  <PiPlusBold className=' xxl:hidden relative z-10 text-xl' />
                </Link>
                <Link
                  href=''
                  className='bg-b50 text-b300 hover:text-n900 relative overflow-hidden rounded-full px-8 py-3 duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] max-xl:hidden'
                >
                  <span className='relative z-10 '> Offer Your Services </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
    </header>
  );
}

export default Header;
