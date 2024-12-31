import Link from 'next/link';
import { SetStateAction } from 'react';
import AnimateHeight from 'react-animate-height';
import { PiCaretRight, PiX } from 'react-icons/pi';

import { headerMenu } from '@/constants/data';
import useToggle from '@/util/hooks/useToggle';
import { UserResponse } from '@/constants/models/user/UserResponse';

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
  return (
    <nav className=''>
      <div
        className={`${
          showMobileMenu
            ? 'translate-y-0  opacity-30 '
            : ' translate-y-[-100%] opacity-0 delay-500 '
        } black/50 4xl:hidden fixed top-0 z-[998] h-full w-full shadow-lg duration-700 ltr:left-0 rtl:right-0`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      <div
        className={`bg-b300 4xl:hidden fixed top-0 z-[999] flex h-full w-3/4 flex-col items-start justify-start gap-8 text-white/80 duration-700 min-[500px]:w-1/2 lg:gap-20 ltr:left-0 rtl:right-0 ${
          showMobileMenu
            ? 'visible translate-y-0 opacity-100  delay-500'
            : ' invisible translate-y-[100%] opacity-50'
        }`}
      >
        <div className=' top-0 mt-2 flex w-full items-center justify-between p-4 sm:p-8'>
          {user ? (
            <Link href='/dashboard' className='text-2xl font-bold text-white'>
              Quolance
            </Link>
          ) : (
            <Link href='/' className='text-2xl font-bold text-white'>
              Quolance
            </Link>
          )}
          <div
            className='cursor-pointer !text-3xl '
            onClick={() => setShowMobileMenu(false)}
          >
            <PiX color='white' />
          </div>
        </div>

        <ul className='flex w-full flex-col items-start gap-6 overflow-y-auto pb-10 text-lg sm:text-xl lg:gap-10 ltr:pl-8 rtl:pr-8'>
          {headerMenu.map((menu) => (
            <li key={menu.id}>
              {menu.isSubmenu ? (
                <div className='subMenuToggle group flex flex-col items-start justify-start'>
                  <div
                    className='flex cursor-pointer items-center justify-start'
                    onClick={() => handleToggle(menu.id)}
                  >
                    <span className='mobileSubMenuTitle'>{menu.name}</span>

                    <span
                      className={`pl-1 pt-1 !text-xl duration-500 ${
                        menuToggle === menu.id ? 'rotate-[90deg]' : ''
                      }`}
                    >
                      <PiCaretRight />
                    </span>
                  </div>
                  <AnimateHeight
                    duration={500}
                    height={menuToggle === menu.id ? 'auto' : 0}
                  >
                    <ul className=' flex flex-col items-start justify-start gap-2 overflow-hidden pl-4 duration-700'>
                      {menu.submenu?.map(({ id, name, link }) => (
                        <li key={id}>
                          <Link href={link} className='text-base'>
                            <span>-</span> {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AnimateHeight>
                </div>
              ) : (
                <Link href='#' className=' hover:text-b500 duration-300'>
                  {menu.name}
                </Link>
              )}
            </li>
          ))}

          {user ? (
            <>
              <li className='hover:text-b500 duration-500'>
                <Link href='/dashboard'>Dashboard</Link>
              </li>
              {user.role === 'FREELANCER' && (
                <li className='hover:text-b500 duration-500'>
                  <Link href='/profile'>My Profile</Link>
                </li>
              )}
              <li className='hover:text-b500 duration-500'>
                <Link href='/setting'>Settings</Link>
              </li>
              <li
                className='hover:text-b500 cursor-pointer duration-500'
                onClick={() => logout()}
              >
                Logout
              </li>
            </>
          ) : (
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
          )}
        </ul>

        {user?.role === 'CLIENT' && (
          <Link
            href='/post-project'
            className='bg-y300 text-n900 rounded-full px-4 py-2 text-base font-medium ltr:ml-4 rtl:mr-4'
          >
            Post A Project
          </Link>
        )}

        {user?.role === 'FREELANCER' && (
          <Link
            href=''
            className='bg-y300 text-n900 mb-6 rounded-full px-4 py-2 text-base font-medium ltr:ml-4 rtl:mr-4'
          >
            Browse All Projects
          </Link>
        )}
      </div>
    </nav>
  );
}

export default MobileMenu;
