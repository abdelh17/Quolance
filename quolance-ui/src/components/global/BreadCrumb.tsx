
import Link from "next/link";
import { PiCaretDoubleRight } from "react-icons/pi";


type PropsType = {
  pageName: string;
  isSearchBoxShow?: boolean;
  isMiddlePage?: boolean;
  middlePageName?: string;
  middlePageLink?: string;
};

function BreadCrumb({
  pageName,
  isMiddlePage,
  middlePageName,
  middlePageLink,
}: PropsType) {
  return (
    <>
      <section className=" bg-white p-6">
        <div className="container">
          <ul className="flex items-center justify-start gap-2 pt-3 font-medium">
            <li>
              <Link href="/">Home</Link>
            </li>
            {isMiddlePage && (
              <>
                <li className="">
                  <PiCaretDoubleRight />
                </li>
                <li>
                  <Link href={middlePageLink!}>{middlePageName}</Link>
                </li>
              </>
            )}
            <li className="text-r300">
              <PiCaretDoubleRight />
            </li>
            <li className="text-r300">{pageName}</li>
          </ul>
         
        </div>
      </section>

    </>
  );
}

export default BreadCrumb;