
import Link from "next/link";
import { SetStateAction } from "react";
import AnimateHeight from "react-animate-height";
import { PiCaretRight, PiX } from "react-icons/pi";
import { headerMenu } from "../../data/data";
import useToggle from "../../hooks/useToggle";

function MobileMenu({
  showMobileMenu,
  setShowMobileMenu,
}: {
  showMobileMenu: boolean;
  setShowMobileMenu: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { menuToggle, handleToggle } = useToggle();
  return (
    <nav className="">
      <div
        className={`${
          showMobileMenu
            ? "translate-y-0  opacity-30 "
            : " translate-y-[-100%] delay-500 opacity-0 "
        } fixed rtl:right-0 ltr:left-0 top-0 z-[998] h-full w-full bg-r50 duration-700 lg:hidden`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      <div
        className={`fixed rtl:right-0 ltr:left-0 top-0 z-[999] flex h-full w-3/4 flex-col items-start justify-start gap-8 bg-r300 text-white/80 duration-700 min-[500px]:w-1/2 lg:hidden lg:gap-20 ${
          showMobileMenu
            ? "translate-y-0 delay-500 opacity-100  visible"
            : " translate-y-[100%] opacity-50 invisible"
        }`}
      >
        <div className="fixed top-0 flex w-full items-center justify-between bg-r300 p-4 sm:p-8">
          <Link href="/" className="text-2xl font-bold">
            Quolance
          </Link>
          <div
            className="cursor-pointer !text-3xl"
            onClick={() => setShowMobileMenu(false)}
          >
            <PiX />
          </div>
        </div>

        <ul className="flex w-full flex-col items-start gap-6 overflow-y-auto pb-10 rtl:pr-8 ltr:pl-8 pt-24 text-lg sm:text-xl lg:gap-10">
          {headerMenu.map((menu) => (
            <li key={menu.id}>
              {menu.isSubmenu ? (
                <div className="subMenuToggle group flex flex-col items-start justify-start">
                  <div
                    className="flex cursor-pointer items-center justify-start"
                    onClick={() => handleToggle(menu.id)}
                  >
                    <span className="mobileSubMenuTitle">{menu.name}</span>

                    <span
                      className={`pl-1 pt-1 !text-xl duration-500 ${
                        menuToggle === menu.id ? "rotate-[90deg]" : ""
                      }`}
                    >
                      <PiCaretRight />
                    </span>
                  </div>
                  <AnimateHeight
                    duration={500}
                    height={menuToggle === menu.id ? "auto" : 0}
                  >
                    <ul className=" flex flex-col items-start justify-start gap-2 overflow-hidden pl-4 duration-700">
                      {menu.submenu?.map(({ id, name, link }) => (
                        <li key={id}>
                          <Link href={link} className="text-base">
                            <span>-</span> {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AnimateHeight>
                </div>
              ) : (
                <Link href={"#"} className=" hover:text-b500 duration-300">
                  {menu.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link
          href=""
          className="rtl:mr-4 ltr:ml-4 rounded-full bg-y300 px-4 py-2 text-base font-medium text-n900"
        >
          Post A Project
        </Link>

        <Link
          href=""
          className="rtl:mr-4 ltr:ml-4 rounded-full bg-y300 px-4 py-2 text-base font-medium text-n900"
        >
          Offer Your Services
        </Link>
      </div>
    </nav>
  );
}

export default MobileMenu;