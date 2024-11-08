
import Link from "next/link";

function ProjectAdminCard({
    id,
    name,
    tags,
    clientId, 
    status,
  }: {
    id: number;
    name: string;
    tags: string[];
    clientId: number;
    status: string;
  }) {
    return (
      <div className='border-n30 flex w-full min-w-[200px] flex-col gap-3 rounded-2xl border p-5'>
        <div>
          <h5 className='heading-5'>{name}</h5>
          <p className='text-n400 pt-2 text-sm'>Client ID: {clientId}</p> 
              
          <p
            className={`mt-2 w-max rounded-xl px-3 py-2 font-medium ${
              status === 'approved'
                ? 'bg-green-500 text-white'
                : status === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white' 
            }`}
          >
            {status}
          </p>
        </div>
  
        <div className='flex items-center justify-between'>
          <div className='text-n400 flex flex-wrap gap-2 text-sm'>
            {tags.map((tag, index) => (
              <p key={index} className='bg-b50 rounded-xl px-3 py-2 font-medium'>
                {tag}
              </p>
            ))}
          </div>
  
          {status === "pending" && (
            <Link
              href={`./adminApproveProject/${id}`}
              className="bg-yellow-500 hover:bg-blue-500 border flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium"
            >
              Update Status
            </Link>
          )}
        </div>
      </div>
    );
  }
  
  export default ProjectAdminCard;
