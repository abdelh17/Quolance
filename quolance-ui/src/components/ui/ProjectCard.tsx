import Link from "next/link";

function ProjectCard({
  name,
  tags,
  datePosted,
  status,
  applicants,
}: {
  name: string;
  tags: string[];
  datePosted: string;
  status: string;
  applicants: number;
}) {
  return (
    <div className="flex items-center  justify-between gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col min-w-[200px]">
     
      <div className="flex items-center w-full justify-start max-xxl:gap-2 max-sm:flex-col">
        <div className="">
          <h5 className="heading-5">{name}</h5>
          <p className="pt-2 text-sm text-n400"> Date Posted: {datePosted}</p>
          <p className="text-sm mt-2 text-n400">Applicants: {applicants}</p>

          <p
          className={`w-max flex items-center justify-center gap-2 rounded-xl px-3 py-2 mt-2 font-medium ${
            status === "open" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {status}
        </p>

         
          <div className="flex flex-wrap gap-1 pt-3 text-sm text-n400 xxl:pt-6">
            {tags.map((tag, index) => (
              <p
                key={index}
                className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium"
              >
                <span>{tag}</span>
              </p>
            ))}
          </div>

          
        </div>
      </div>

      
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl  border-n30 px-6 py-8 text-center text-n300 md:max-w-[176px]">
     
      <Link
            href="/services/service-details"
            className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-3 py-2 mt-4 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-3 max-md:w-full"
          >
            <span className="relative z-10">View Details</span>
          </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
