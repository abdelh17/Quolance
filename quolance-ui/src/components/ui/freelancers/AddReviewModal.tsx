import React, { SetStateAction ,useState } from 'react';
import { PiStar, PiX } from 'react-icons/pi';
import { PostReviewType } from '@/models/user/UserResponse';
import { reviewSchema } from './FreelancerCard';
import { ReviewFormValues } from './FreelancerCard';




interface AddReviewModalProps {
isOpen: boolean;
setIsOpen: React.Dispatch<SetStateAction<boolean>>;
freelancerName: string;
ratings: PostReviewType;
setRatings: React.Dispatch<SetStateAction<PostReviewType>>;
step: number;
setStep: React.Dispatch<SetStateAction<number>>;
errors: { title: string; comment: string };
setErrors: React.Dispatch<SetStateAction<{ title: string; comment: string }>>;
onSubmit: () => void;
}




function AddReviewModal({ isOpen, setIsOpen, freelancerName,ratings,setRatings,step,setStep,errors,setErrors,onSubmit}: AddReviewModalProps) {
  const ratingOptions = [
     { label: 'Very poor', emoji: '☹️',value:1 },
     { label: 'Poor', emoji: '🙁',value:2 },
     { label: 'Average', emoji: '😐' ,value:3},
     { label: 'Very good', emoji: '🙂' ,value:4},
     { label: 'Exceptional', emoji: '🤩',value:5 },
   ];
 
    const handleRatingChange = (category: string, value: number) => {
     setRatings({ ...ratings, [category]: value });
   };








   const closeModal = () => {
    setIsOpen(false);
    setStep(1);
    setErrors({ title: '', comment: '' });
    setRatings({
      title: '',
      communicationRating: 1,
      qualityOfWorkRating: 1,
      qualityOfDeliveryRating: 1,
      comment: '',
      projectId: '',
      reviewedFreelancerId: ''
    });
  };
 
    const handleNext = () => {
     setStep((prev) => prev + 1);
   }
    const handlePrevious = () => setStep((prev) => prev - 1);
 
   return (
 <>
   {/* Modal Section */}
   <section
     className={`fixed left-0 right-0 top-0 z-[999] flex h-auto items-center justify-center overflow-y-auto delay-[30ms] duration-700 ease-out ${
       isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
     }`}
   >
     <div className='mx-3 my-20 w-[575px] rounded-2xl bg-white p-8 drop-shadow-2xl'>
       {/* Header */}
       <div className='flex items-center justify-between gap-3'>
         <div className='flex items-center gap-3'>
           <PiStar className='text-xl sm:text-3xl text-yellow-500' />
           <p className='text-sm sm:text-xl font-medium'>
             {step === 1 && 'Rate Delivery Time'}
             {step === 2 && 'Rate Communication'}
             {step === 3 && 'Rate Quality of Work'}
             {step === 4 && 'Write Your Public Review'}
           </p>
         </div>
         <button onClick={closeModal}>
            <PiX className='text-2xl' />
         </button>




       </div>
      {/* Step 1 - Rate Delivery Time */}
      {step === 1 && (
         <div className='py-6'>
           <p className='text-n300 text-sm sm:text-md'>
             {`Based on your expectations, how would you rate ${freelancerName} delivery time?`}
           </p>
           <div className='mt-0 sm:mt-4 flex justify-between flex-wrap'>
             {ratingOptions.map((option) => (
               <button
                 key={option.label}
                 className={`flex flex-col items-center rounded-lg border w-full sm:w-24 px-3 py-2 mt-2 ${
                   ratings.qualityOfDeliveryRating === option.value ? 'border-black' : 'border-gray-300'
                 }`}
                 onClick={() => handleRatingChange('qualityOfDeliveryRating', option.value)}
               >
                 <span className='text-sm sm:text-lg'>{option.emoji}</span>
                 <span className='text-sm sm:text-xs'>{option.label}</span>
               </button>
             ))}
           </div>
         </div>
       )}








       {/* Step 2 - Rate Communication */}
       {step === 2 && (
         <div className='py-6'>
           <p className='text-n300 text-sm sm:text-md'>
             {`How was ${freelancerName} communication throughout the project?`}
           </p>
           <div className='mt-0 sm:mt-4 flex justify-between flex-wrap'>
             {ratingOptions.map((option) => (
               <button
                 key={option.label}
                 className={`flex flex-col items-center rounded-lg border w-full sm:w-24 px-3 py-2 mt-2 ${
                   ratings.communicationRating === option.value ? 'border-black' : 'border-gray-300'
                 }`}
                 onClick={() => handleRatingChange('communicationRating', option.value)}
               >
                 <span className='text-sm sm:text-lg'>{option.emoji}</span>
                 <span className='text-sm sm:text-xs'>{option.label}</span>
               </button>
             ))}
           </div>
         </div>
       )}








       {/* Step 3 - Rate Quality of Work */}
       {step === 3 && (
         <div className='py-6'>
           <p className='text-n300 text-sm sm:text-md'>
             {`How would you rate ${freelancerName} quality of work delivered?`}
             </p>
           <div className='mt-0 sm:mt-4 flex justify-between flex-wrap'>
             {ratingOptions.map((option) => (
               <button
                 key={option.label}
                 className={`flex flex-col items-center rounded-lg border w-full sm:w-24 px-3 py-2 mt-2 ${
                   ratings.qualityOfWorkRating=== option.value ? 'border-black' : 'border-gray-300'
                 }`}
                 onClick={() => handleRatingChange('qualityOfWorkRating', option.value)}
               >
                   <span className='text-sm sm:text-lg'>{option.emoji}</span>
                   <span className='text-sm sm:text-xs'>{option.label}</span>
               </button>
             ))}
           </div>
         </div>
       )}








       {/* Step 4 - Written Review */}
       {step === 4 && (
          <div className='py-6'>
            <p className='text-n300 mb-4 text-sm sm:text-md'>
              Share your feedback for <b>{freelancerName}</b>.
            </p>




            <label className = "text-sm sm:text-md">Title</label>
            <input
              type='text'
              placeholder='Review title'
              className={`mb-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-yellow-400`}
              value={ratings.title}
              onChange={(e) =>
                setRatings({ ...ratings, title: e.target.value })
              }
            />
            {errors.title && (
               <p className='text-red-500 text-sm mb-3'>{errors.title}</p>
             )}




            <label className = "text-sm sm:text-md">Review</label>
            <textarea
              placeholder='Write your review...'
              className={`w-full rounded-lg border p-3 focus:ring-2 focus:ring-yellow-400 $`}
              rows={6}
              value={ratings.comment}
              onChange={(e) =>
                setRatings({ ...ratings, comment: e.target.value })
              }
            ></textarea>
           {errors.comment && (
             <p className='text-red-500 text-sm mt-1'>{errors.comment}</p>
           )}
          </div>
        )}
















       {/* Navigation Buttons */}
       <div className={`flex items-end gap-4 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
         {step > 1 && (
           <button
             onClick={handlePrevious}
             className=' text-sm sm:text-base bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
           >
             <span className='relative z-10'>Previous</span>
           </button>
         )}
         {step < 4 ? (
           <button
             onClick={handleNext}
             className='text-sm sm:text-base hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-green-600 px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
           >
             <span className='relative z-10'>Next</span>
           </button>
         ) : (
           <button
             onClick={onSubmit}
             className=' text-sm sm:text-base hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-green-600 px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
           >
             <span className='relative z-10'>Submit</span>
           </button>
         )}
       </div>
  
     </div>
   </section>








   {/* Background Overlay */}
   <div
     className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
       isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full'
     }`}
   />
 </>
);
}








export default AddReviewModal;
