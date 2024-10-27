import React, {useEffect, useState} from 'react';
import {ProjectFilterOptions} from "@/types/projectTypes";

type ProjectFilterProps = {
    filter: ProjectFilterOptions;
    setFilter: (filter: ProjectFilterOptions) => void;
}

function ProjectFilter({ filter, setFilter }: ProjectFilterProps) {

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-n30 px-6 py-8">
                <h5 className="heading-5">Filter by</h5>
                <div className="flex flex-col gap-6 pt-8">
                    <div className="rounded-xl bg-n10 p-6">
                        <p className="pb-3 text-lg font-semibold">Date</p>
                        <select
                            className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                            name="order"
                            value={filter.order}
                            onChange={handleFilterChange}
                        >
                            <option value="desc">Latest to Oldest</option>
                            <option value="asc">Oldest to Latest</option>
                        </select>
                    </div>
                    <div className="rounded-xl bg-n10 p-6">
                        <p className="pb-3 text-lg font-semibold">Status</p>
                        <select
                            className="w-full rounded-xl border border-n40 bg-transparent px-4 py-3 outline-none"
                            name="status"
                            value={filter.status}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <button
                        className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3">
                        <span className="relative z-10">Filter</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectFilter;