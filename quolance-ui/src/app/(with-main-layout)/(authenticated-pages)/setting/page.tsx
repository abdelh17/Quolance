
import PersonalInfo from './components/PersonalInfo';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';


export default function SettingPage() {

 return (
       <div className="flex justify-center">
        
           <div className="divide-y max-w-5xl">
          
           <div className=" px-4 py-4  lg:px-8">
               <h2 className="text-base/7 font-semibold ">Account Settings</h2>
               <p className="mt-1 text-sm/6 text-gray-400">
                      View and Manage your account settings.
               </p>
           </div>
          
             <PersonalInfo/>


             <ChangePassword/>


            <DeleteAccount/>
            
           </div>
       </div>
 )
}
