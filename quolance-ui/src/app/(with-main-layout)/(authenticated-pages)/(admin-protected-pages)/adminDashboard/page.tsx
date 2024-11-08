
import Link from 'next/link'

export default function adminDashboard (){

    return (
        <>
            <h1 className = "text-center  heading-1 m-10">Admin Dashboard</h1>
            <div className="flex flex-wrap justify-center items-center gap-8 font-bold text-xl">
                <Link href="adminDashboard/adminApproveProject"> <div className = " rounded-lg border-4 border-2 w-72 h-72 flex justify-center items-center hover:bg-blue-300">Approve/Reject Project</div> </Link>
            </div>
        </>
    )
}