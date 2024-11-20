// pages/about-us.tsx
import React from 'react';
import CollapsibleList from '@/components/ui/CollapsibleList';

const aboutUsData = [
  {
    question: "What is our mission?",
    answer: "At Quolance, our mission is to redefine freelancing by creating a skill-based marketplace where freelancers and clients can connect and collaborate effortlessly. We empower freelancers with real-time insights, help clients find the right talent, and prioritize a seamless, efficient experience for both parties."
  },
  {
    question: "What is the platform?",
    answer: "Quolance leverages advanced technology, including machine learning and AI-driven moderation, to dynamically match freelancers and projects based on skills, past performance, and other key metrics. We aim to provide: Intelligent project matching for freelancers and clients. Profile optimization and career growth tools for freelancers. Built-in tools for communication, project management, and collaboration. Transparent ratings to foster trust and long-term partnerships. Cost-effective, commission-free transactions to support freelancers directly."
  },
  {
    question: "What is our impact and innovation?",
    answer: "Quolance brings innovative solutions to freelancing challenges through experience-based matching, platform-mediated trust guarantees, and comprehensive project lifecycle support. By focusing on both skill development and real-time industry insights, Quolance aims to elevate freelancing to a more fulfilling, career-oriented path for our users."
  },
  {
    question: "Who is behind Quolance?",
    answer: (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Meet the crew</h2>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">Creative people</p>
        </div>
        {/* End Title */}

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 ">
          {/* Team Member */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Abdelkader Habel</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Team Lead / CEO</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Zakaria El Manar</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Back-End Lead Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Chems-Saidi Eddine </h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Front-End Lead Developer </p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Anes Khadiri</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white">Full-Stack Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Francesco Ferrato</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Front-End Developer </p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white"> Adel Bouchatta</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Front-End Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white">Ismail Feham</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white">Front-End Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white">Abdelmalek Anes</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white"> Back-End Developer </p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white">Sathurthikan Saththyvel</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white">Back-End Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <img
              className="rounded-lg size-20"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
              alt="David Forren"
            />
            <div className="grow">
              <div>
                <h3 className="font-medium text-white text-white">Oussama Cherifi</h3>
                <p className="mt-1 text-xs uppercase text-white dark:text-white">Back-End Developer</p>
              </div>
              <div className="mt-2 sm:mt-auto space-x-2.5">
                <a
                  className="inline-flex justify-center items-center text-white rounded-full hover:text-white focus:outline-none focus:text-white dark:text-white dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  {/* Social icon */}
                  <svg
                    className="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Repeat the above block for each team member */}

          
          
        </div>
        {/* End Grid */}
      </div>
    )
  }
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex justify-center p-8 bg-gray-800 dark:bg-neutral-950">
      <div className="w-[80%] max-w-3xl">
        <h1 className="heading-2 mb-6 text-center">About Quolance</h1>

        {/* Reusing FAQList component for About Us Sections */}
        <CollapsibleList items={aboutUsData} />
      </div>
    </div>
  );
};

export default AboutUsPage;