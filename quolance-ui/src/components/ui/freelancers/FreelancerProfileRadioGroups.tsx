import React, { useEffect } from 'react';
import { EXPERIENCE_LEVEL_OPTIONS, AVAILABILITY_OPTIONS } from '@/constants/types/form-types';


interface RadioGroupProps {
 name: string;
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 options: typeof EXPERIENCE_LEVEL_OPTIONS;
}


export function RadioGroup({
 name,
 value,
 onChange,
 options,
}: RadioGroupProps) {
 useEffect(() => {
   if (!value && options.length > 0) {
     try {
       onChange({
         target: {
           name,
           value: options[0].value,
         },
       } as React.ChangeEvent<HTMLInputElement>);
     } catch (error) {
       console.error('Error setting default value:', error);
     }
   }
 }, [name, onChange, value, options]);


 return (
   <fieldset>
 <div className="ml-1 flex flex-col sm:flex-wrap sm:flex-row gap-4 w-full">
   {options.map((item) => (
     <div key={item.id} className="flex items-center w-full sm:w-auto">
       <input
         id={item.id}
         type="radio"
         name={name}
         value={item.value}
         checked={value === item.value}
         onChange={onChange}
         className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-600 focus:ring-offset-0"
       />
       <label
         htmlFor={item.id}
         className="ml-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-purple-600 transition-colors duration-200"
       >
         {item.label}
       </label>
     </div>
   ))}
 </div>
</fieldset>


 );
}


export function ExperienceLevelRadioGroup(props: Omit<RadioGroupProps, 'options'>) {
 return <RadioGroup {...props} options={EXPERIENCE_LEVEL_OPTIONS} />;
}


export function AvailabilityRadioGroup(props: Omit<RadioGroupProps, 'options'>) {
 return <RadioGroup {...props} options={AVAILABILITY_OPTIONS} />;
}


