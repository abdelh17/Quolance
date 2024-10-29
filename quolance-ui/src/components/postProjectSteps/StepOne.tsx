"use client";

import ServiceModal from "@/components/ui/ServiceModal";


function StepOne() {
    return (
        <div className="">
            <h4 className="heading-4">Project information</h4>
            <p className="pb-4 pt-6 lg:pt-10">
                Project Title *
            </p>
            <input
                type="text"
                className="w-full rounded-lg bg-n30 p-3 outline-none"
            />

            <p className="pb-4 pt-6 font-medium text-n300 lg:pt-10">
                Detailed Project Description*
            </p>
            <textarea className="mt-4 min-h-[130px] w-full rounded-lg bg-n30"></textarea>

            <p className="pb-4 pt-6 font-medium text-n300 lg:pt-10">
                Project Category*
            </p>

            <ServiceModal />
        </div>
    );
}

export default StepOne;
