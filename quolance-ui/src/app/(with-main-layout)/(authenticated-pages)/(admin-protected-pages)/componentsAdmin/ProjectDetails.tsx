import React from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  clientId: number;
  status: string;
}

interface ProjectDetailsProps {
  project: Project | null;
  status: string;
  onStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, status, onStatusChange, onSubmit }) => {
  return (
    <>
      <div className="flex w-4/5 min-w-[200px] rounded border flex-col justify-self-center mt-10">
        <h3 className="heading-3 text-center bg-gray-300 p-3 mb-3">{project?.name}</h3>

        <div className="p-5 flex flex-col gap-6">
          <div className="text-xl font-bold">Project Description</div>
          <div className="text-justify">{project?.description}</div>

          <div className="text-xl font-bold">Client ID</div> 
          <div>{project?.clientId}</div>

          <div className="text-xl font-bold">Tags</div>
          <div className="flex items-center justify-between">
            <div className="text-n400 flex flex-wrap gap-2 text-sm">
              {project?.tags.map((tag, index) => (
                <p key={index} className="bg-b50 rounded-xl px-3 py-2 font-medium">
                  {tag}
                </p>
              ))}
            </div>
          </div>

          <div className="text-xl font-bold">Project Status</div>
          <div className="rounded-xl w-max px-3 py-2 bg-blue-500 text-white">{project?.status}</div>
        </div>
      </div>

      <div className="flex w-4/5 min-w-[200px] rounded border flex-col justify-self-center mt-10">
        <h3 className="heading-3 text-center bg-gray-300 p-3">Change Status</h3>

        <div className="p-4 flex items-center justify-between">
          <div>
            <label htmlFor="status" className="font-bold pr-2">
              New Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={onStatusChange}
              className="rounded-xl border px-4 py-2"
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={onSubmit}
            className="border rounded px-3 py-2 bg-yellow-500 hover:bg-blue-500 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
