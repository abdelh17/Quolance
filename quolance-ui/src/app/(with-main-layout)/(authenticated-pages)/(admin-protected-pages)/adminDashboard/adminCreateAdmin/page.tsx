
import  {CreateAdminForm}  from "../../componentsAdmin/CreateAdminForm"


export default function adminCreateAdmin(){


   return(
      
        <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full min-w-52 max-w-screen-sm mx-auto pt-24 px-2">
        <h1 className="text-2xl font-semibold">Create a new admin</h1>
        <CreateAdminForm />
      </div>
   )
}
