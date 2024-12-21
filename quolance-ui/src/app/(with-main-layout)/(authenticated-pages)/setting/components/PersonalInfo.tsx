"use client";

import { useAuthGuard } from '@/api/auth-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function PersonalInfo() {
 const { user } = useAuthGuard({ middleware: 'auth' });


 return (
   <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
     <div>
       <h2 className="text-base/7 font-semibold">Personal Information</h2>
       <p className="mt-1 text-sm/6 text-gray-400">
         View your personal information associated with your account.
       </p>
     </div>


     <form className="md:col-span-2">
       <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
         <div className="sm:col-span-3">
           <Label htmlFor="first-name">First name</Label>
           <Input
             id="first-name"
             type="text"
             autoComplete="given-name"
             value={user?.firstName || ''}
             disabled
             className="block w-full rounded-md px-3 py-1.5 outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           />
         </div>


        
         <div className="sm:col-span-3">
           <Label htmlFor="last-name">Last name</Label>
           <Input
             id="last-name"
             type="text"
             autoComplete="family-name"
             value={user?.lastName || ''}
             disabled
             className="block w-full rounded-md px-3 py-1.5 outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           />
         </div>


        
         <div className="col-span-full">
           <Label htmlFor="email">Email address</Label>
           <Input
             id="email"
             type="email"
             autoComplete="email"
             value={user?.email || ''}
             disabled
             className="block w-full rounded-md px-3 py-1.5 outline outline-1 focus:outline-indigo-500 sm:text-sm/6"
           />
         </div>
       </div>
     </form>
   </div>
 );
}
''