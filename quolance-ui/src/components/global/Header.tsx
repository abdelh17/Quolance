"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PiCaretDown, PiListBold, PiPlusBold } from "react-icons/pi";

import MobileMenu from "./MobileMenu";
import { headerMenu } from "../../data/data";
import useScroll from "../../hooks/useScroll";

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const path = usePathname();

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
    <header className="">

      <div
        className={`left-0 right-0 top-0 z-50 ${
          scrolled
            ? "animationOne fixed bg-white shadow-md"
            : "animationTwo absolute"
        }`}
      >
        <div className="max-xxl:container xxl:px-25">
          <div className="text-s1 flex items-center justify-between py-6">
            <div className="flex items-center justify-start gap-3 pb-1">
              <button
                className="text-5xl pt-1 !leading-none lg:hidden"
                onClick={() => setShowMobileMenu(true)}
              >
                <PiListBold className=" text-b500" />
              </button>
              <Link href="/" className="text-2xl pt-1 font-bold">
               Quolance
              </Link>
            </div>

            <nav className="max-lg:hidden">
              <ul className="flex items-center justify-center gap-2 font-medium xxl:gap-6">
                {headerMenu.map((menu) => (
                  <li key={menu.id}>
                    {menu.isSubmenu && (
                      <div className="group relative cursor-pointer">
                        <div
                          className={`subMenuTitle relative flex items-center justify-center gap-1 px-2 py-3 hover:text-b500 ${
                            isMenuActive(menu) ? "text-b500" : ""
                          }`}
                        >
                          {menu.name}
                          <PiCaretDown className="block pt-0.5 duration-700 group-hover:rotate-180" />
                        </div>
                        <ul className="group-hover:eventunset pointer-events-none invisible absolute rtl:right-0 ltl:left-0 top-12 flex w-[220px] translate-y-8 scale-75 flex-col items-start justify-start gap-3 rounded-lg bg-b300 py-6 font-medium text-white/90 opacity-0 duration-500 group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                          {menu.submenu?.map(({ id, name, link }) => (
                            <li key={id}>
                              <Link
                                href={link}
                                className={`subMenuItem px-6 duration-500 hover:ml-2 hover:text-y200 ${
                                  path === link && "text-y200"
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
              </ul>
            </nav>

            <div className="flex items-center justify-between gap-6">
              <ul className="flex items-center justify-start gap-2 font-medium max-sm:hidden xxl:gap-6">
                <li className="hover:text-b500 duration-500">
                  <Link href="" className="rounded-lg px-2 py-3 ">
                    Login
                  </Link>
                </li>
              </ul>
              <div className="flex items-center justify-between gap-3 font-semibold">
                <Link
                  href=""
                  className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] max-xxl:size-11 max-xxl:!leading-none xxl:px-8 xxl:py-3"
                >
                  <span className="relative z-10 max-xxl:hidden">
                    Post A Project
                  </span>
                  <PiPlusBold className=" relative z-10 text-xl xxl:hidden" />
                </Link>
                <Link
                  href=""
                  className="relative overflow-hidden rounded-full bg-b50 px-8 py-3 text-b300 duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] max-xl:hidden"
                >
                  <span className="relative z-10 "> Offer Your Services </span>
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