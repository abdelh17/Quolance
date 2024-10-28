"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PiBriefcase,
  PiEnvelopeSimple,
  PiImage,
  PiLinkedinLogo,
  PiLock,
  PiMapPin,
  PiUser,
} from "react-icons/pi";

import facebook from "@/public/images/facebook_icon.png";
import google from "@/public/images/google_icon.png";

function SignUpPage() {
  const [loginStep, setLoginStep] = useState(1);
  return (
    <>
      <section className="relative overflow-hidden flex justify-center">
        <div className="absolute -bottom-40 rtl:-right-20 ltr:-left-20 size-[550px] rounded-full bg-eb100/20 max-lg:hidden"></div>

        <div className="absolute -top-40 rtl:right-32 ltr:left-32 h-[600px] w-[550px] rounded-full bg-r50/30 max-lg:hidden"></div>

        <div className="absolute -bottom-60 rtl:-left-40 ltr:-right-40 -z-10 size-[500px] rounded-full bg-eb50/20 max-lg:hidden"></div>

        <div className="flex h-full items-center justify-start max-lg:justify-center">
          <div className="flex h-full w-full max-w-[530px] flex-col items-start justify-start max-lg:px-6 max-lg:pt-40 max-sm:pt-32 lg:ml-20 xl:max-w-[380px] xxl:max-w-[530px] 3xl:ml-40">
            {loginStep === 1 && (
              <>
                <div className="flex items-center justify-start pt-8">
                  <p className="heading-5">Welcome to Quolance</p>
                </div>
                <form className="flex w-full flex-col pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiUser />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Your Name"
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className=" text-2xl !leading-none">
                        <PiEnvelopeSimple />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Your Email"
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiLock />
                      </span>
                      <input
                        type="password"
                        placeholder="Enter Your Email"
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                  </div>
                </form>
              </>
            )}

            {loginStep === 2 && (
              <>
                <div className="flex items-center justify-start pt-8">
                  <p className="heading-5">Welcome to Quolance</p>
                  QUOLANCE
                </div>

                <form className="flex w-full flex-col pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiUser />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Company Name"
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-start gap-3">
                      <input type="checkbox" />
                      <p className="text-sm text-n300">
                        I’m hiring as an indiviual
                      </p>
                    </div>
                  </div>
                </form>
              </>
            )}

            {loginStep === 3 && (
              <form className="flex w-full flex-col pt-6">
                <div className="flex flex-col gap-6">
                  <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                    <span className="text-2xl !leading-none">
                      {" "}
                      <PiBriefcase />{" "}
                    </span>
                    <input
                      type="text"
                      placeholder="Professional Title"
                      className="w-full text-sm text-n300 outline-none"
                    />
                  </div>

                  <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                    <span className=" text-2xl !leading-none">
                      <PiMapPin />
                    </span>
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full text-sm text-n300 outline-none"
                    />
                  </div>
                  <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                    <span className=" text-2xl !leading-none">
                      <PiLinkedinLogo />
                    </span>
                    <input
                      type="text"
                      placeholder="Linkedin URL"
                      className="w-full text-sm text-n300 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-start gap-3">
                    <input type="checkbox" />
                    <p className="text-sm text-n300">
                      I don’t have a Linkedln account
                    </p>
                  </div>
                  <div className="">
                    <p className="pb-3 text-sm text-n300">
                      Add a photo to help build connection and trust.
                    </p>
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-b50 bg-n10 px-3 py-10">
                      <span className="text-6xl !leading-none">
                        <PiImage />
                      </span>
                      <p className="pt-3 text-sm font-medium">
                        Upload profile photo
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}

            <div className="w-full">
              <Link
                href="/contact"
                className="block py-3 text-end text-sm font-medium text-n300"
              >
                Forgot Password?
              </Link>
              {loginStep < 3 && (
                <button
                  onClick={() => setLoginStep(loginStep + 1)}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
                >
                  <span className="relative z-10">Continue</span>
                </button>
              )}
              {loginStep === 3 && (
                <Link
                  href="/sign-in"
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
                >
                  <span className="relative z-10">Sign In</span>
                </Link>
              )}

              {loginStep === 1 && (
                <>
                  <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                    <p className="text-n300">Already have an account?</p>
                    <Link href="/sign-in" className="text-b300 underline">
                      Sign in here
                    </Link>
                  </div>

                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3">
                    <Image src={google} alt="" />
                    <span className="text-sm">Google</span>
                  </button>

                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3">
                    <Image src={facebook} alt="" />
                    <span className="text-sm">Facebook</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUpPage;