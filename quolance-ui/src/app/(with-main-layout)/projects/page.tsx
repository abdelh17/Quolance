"use client";

import { useState } from "react";
import BreadCrumb from "@/components/global/BreadCrumb";
import Pagination from "@/components/ui/Pagination";
import ServiceCard from "@/components/ui/ProjectCard";
import { ProjectList } from "@/data/data";

const ITEMS_PER_PAGE = 4; // Number of services per page

function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateOrder, setDateOrder] = useState("latest"); // Default to latest
  const [statusFilter, setStatusFilter] = useState("all"); // Default to all

  // Handle filtering logic based on date and status
  const filteredServices = ProjectList
    .filter((project) =>
      statusFilter === "all" ? true : project.status === statusFilter
    )
    .sort((a, b) => {
      if (dateOrder === "latest") {
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      } else {
        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      }
    });

  // Calculate total pages based on number of filtered items
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  // Get the services to display for the current page
  const currentServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to handle date order change
  const handleDateOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateOrder(e.target.value);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Function to handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  return (
    <>
      <BreadCrumb pageName="Projects" isSearchBoxShow={true} />

      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-n30 px-6 py-8">
              <h5 className="heading-5">Filter by</h5>
              <div className="flex flex-col gap-6 pt-8">
                <div className="rounded-xl bg-n10 p-6">
                  <p className="pb-3 text-lg font-semibold">Date</p>
                  <select
                    className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                    value={dateOrder}
                    onChange={handleDateOrderChange}
                  >
                    <option value="latest">Latest to Oldest</option>
                    <option value="oldest">Oldest to Latest</option>
                  </select>
                </div>
                <div className="rounded-xl bg-n10 p-6">
                  <p className="pb-3 text-lg font-semibold">Status</p>
                  <select
                    className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3">
                  <span className="relative z-10">Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 rounded-xl border border-n30 p-4 sm:p-8 lg:col-span-8">
            <div className="flex flex-col gap-4">
              {currentServices.map(({ id, ...props }) => (
                <ServiceCard key={id} id={id} {...props} />
              ))}
            </div>

            <div className="container pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;