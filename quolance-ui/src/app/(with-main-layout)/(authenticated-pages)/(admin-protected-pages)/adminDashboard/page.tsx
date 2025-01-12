import Link from 'next/link'
import { FiUser } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";


export default function adminDashboard (){


   return (
       <>
           <h1 className = "text-center font-medium text-3xl m-10">Admin Dashboard</h1>
           <div className="flex flex-wrap justify-center items-center gap-14">
               <Link data-test="create-admin-card"  href="adminDashboard/adminCreateAdmin">
                   <div className = " rounded-2xl border-2 w-64 h-32 flex justify-center items-center hover:border-blue-500 gap-2">
                       <FiUser className="text-2xl" />
                       <div className="text-lg ">Create Admin</div>
                   </div>
               </Link>
               <Link data-test="pending-projects-card"  href="adminDashboard/adminApproveProject">
               <div className = " rounded-2xl border-2  w-64 h-32 flex justify-center items-center hover:border-blue-500 gap-2">
                   < FaRegFileAlt className="text-2xl" />
                   <div className="text-lg ">Pending Projects</div>
               </div>
               </Link>
           </div>
       </>
   )
}
