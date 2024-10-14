'use client';
import Link from 'next/link';
import React from 'react';
import { PiArrowUpRight } from 'react-icons/pi';

function LinkButton({
  link,
  text,
  isBgWhite,
  isGreen,
  isBlue,
}: {
  link: string;
  text: string;
  isBgWhite?: boolean;
  isGreen?: boolean;
  isBlue?: boolean;
}) {
  const oneItemRef = React.useRef<HTMLSpanElement>(null);
  const twoItemRef = React.useRef<HTMLSpanElement>(null);
  const handleMouseOver = () => {
    const oneWidth = oneItemRef.current!.offsetWidth;
    const twoWidth = twoItemRef.current!.offsetWidth;
    oneItemRef.current!.style.transform = `translateX(${twoWidth}px)`;
    twoItemRef.current!.style.transform = `translateX(-${oneWidth}px)`;
  };
  const handleMouseOut = () => {
    oneItemRef.current!.style.transform = 'none';
    twoItemRef.current!.style.transform = 'none';
  };
  return (
    <Link
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      href={link}
      className='group relative flex items-center justify-start pr-12 font-semibold'
    >
      <span
        ref={oneItemRef}
        className={`rounded-full ${
          isBgWhite
            ? 'bg-white'
            : isGreen
            ? 'bg-g300'
            : isBlue
            ? 'bg-b300'
            : 'bg-y300'
        } px-6 py-3 duration-500 group-hover:translate-x-12`}
      >
        {text}
      </span>
      <span
        ref={twoItemRef}
        className={`translate-x-0 rounded-full ${
          isBgWhite
            ? 'bg-white'
            : isGreen
            ? 'bg-g300'
            : isBlue
            ? 'bg-b300'
            : 'bg-y300'
        } p-[14px] text-xl !leading-none duration-500  group-hover:rotate-45`}
      >
        <PiArrowUpRight />
      </span>
    </Link>
  );
}

export default LinkButton;
