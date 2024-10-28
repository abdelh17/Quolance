"use client";

import { useParams } from "next/navigation"; // Use useParams to get the dynamic parameter
import { useEffect, useState } from "react";

import { ProjectList } from "@/data/data"; // Import your mock data

import BreadCrumb from "@/components/global/BreadCrumb";

type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  datePosted: string;
  status: string;
  applicants: number;
};

function FreelancerApply() {
  const { id } = useParams(); // Get project ID from the URL

  const [project, setProject] = useState<Project | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch project details from the mock data when the id is available
      const projectId = Number(id); // Convert id to a number
      const fetchedProject = ProjectList.find((p) => p.id === projectId); // Find project by id
      setProject(fetchedProject || null); // Set project or null if not found
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting application:", coverLetter, file);
    // Add form submission logic here
  };

  return (
    <>
      <BreadCrumb pageName="Apply to Project" isSearchBoxShow={false} />

      <section className="container stp-30 sbp-30">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="heading-1 mb-6 text-primary">Apply to Project</h2>

            {/* Display Project Details */}
            {project ? (
              <div className="mb-12 p-8 rounded-lg bg-white shadow-lg box-shadow-1">
                <h3 className="heading-2 mb-4 text-primary">{project.name}</h3>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <p>Date Posted: <span className="text-primary">{project.datePosted}</span></p>
                  <p>Status: <span className={`font-medium px-3 py-1 rounded-lg ${project.status === "open" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{project.status}</span></p>
                  <p>Applicants: <span className="text-primary">{project.applicants}</span></p>
                </div>

                <p className="mb-6 leading-relaxed text-gray-700">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-500 text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-error mb-6">No project found for ID: {id}</p> // Handle case when no project is found
            )}

            {/* Application Form */}
            <div className="mt-6 p-8 rounded-lg bg-white shadow-lg box-shadow-1">
              <h3 className="heading-3 text-primary mb-6">Your Application</h3>

              <div className="mb-6">
                <label htmlFor="coverLetter" className="block font-medium text-lg mb-2">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  className="w-full rounded-lg border border-gray-300 p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Introduce yourself and explain why you're a great fit for this project..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                />
                <p className="text-sm text-gray-500">Max 500 words</p>
              </div>

              <div className="mb-6">
                <label htmlFor="fileUpload" className="block font-medium text-lg mb-2">Attach Your Portfolio</label>
                <input
                  id="fileUpload"
                  type="file"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">Accepted formats: PDF, Docx, PNG</p>
              </div>

              <div className="mt-8">
                <button
                  className="w-full bg-primary text-white py-4 rounded-lg font-medium shadow-md transition-all hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                  onClick={handleSubmit}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FreelancerApply;