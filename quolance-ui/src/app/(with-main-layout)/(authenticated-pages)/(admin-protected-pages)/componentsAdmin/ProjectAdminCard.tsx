
import Link from "next/link";


function ProjectAdminCard({
 id,
 title,
 projectStatus,
 expirationDate,
 clientId,
}: {
 id: number;
 title: string;
 projectStatus: string;
 expirationDate: string;
 clientId: number;
}) {
 return (
   <div className=" flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-y-4 sm:gap-x-6 py-5 border-b border-gray-300">
    
     <div className="min-w-0">
       <div className="flex items-center gap-x-3">
         <p className="text-sm font-semibold text-gray-900">{title}</p>
         <p
           className="text-gray-600 bg-gray-50 ring-gray-500/10 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
         >
           {projectStatus}
         </p>
       </div>
       <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
         <p className="whitespace-nowrap">
           Expiration Date: <time dateTime={expirationDate}>{expirationDate}</time>
         </p>
         <svg viewBox="0 0 2 2" className="h-1 w-1 fill-current">
           <circle r={1} cx={1} cy={1} />
         </svg>
         <p>Client ID: {clientId}</p>
       </div>
     </div>

     <div className="flex w-full sm:w-auto flex-none items-center sm:justify-end gap-x-4">
       <Link
         href={`./adminApproveProject/${id}`}
         className="rounded-md px-2.5 py-1.5 text-sm  shadow-sm ring-1 ring-inset ring-gray-300 bg-blue-500 hover:bg-yellow-500 text-white w-full sm:w-auto text-center"
       >
         Update Status
       </Link>
     </div>
   </div>
 );
}


export default ProjectAdminCard;

