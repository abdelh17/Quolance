import StarRating from '@/components/ui/StarRating';




interface ReviewCardProps {
firstName: string;
lastName: string;
username: string;
title: string;
comment: string;
overallRating: number;
communicationRating: number;
qualityOfDeliveryRating: number;
qualityOfWorkRating: number;
}




const ReviewCard = ({
firstName,
lastName,
username,
title,
comment,
overallRating,
communicationRating,
qualityOfDeliveryRating,
qualityOfWorkRating,
}: ReviewCardProps) => {
return (
  <div className='border-n30 rounded-2xl border p-8 mb-4'>
    <div className='flex items-center justify-start gap-3 pb-2'>
      <div>
        <div className='flex items-center gap-3 flex-wrap'>
          <h5 className='heading-5 text-justify'>{title}</h5>
          <div className='flex items-center gap-1'>
            <StarRating rating={overallRating} />
            <span>{overallRating}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm flex-wrap">
    <p>Reviewed by -  </p>
    <p>{`${firstName} ${lastName}`}</p>
    <p>({username})</p>
    </div>




    <p className='text-sm sm:text-n300 my-8 font-medium text-justify'>{comment}</p>




    <div className='pt-5 text-sm flex flex-col gap-4'>
{[
  { label: 'Seller Communication Level', rating: communicationRating },
  { label: 'Quality Of Delivery', rating: qualityOfDeliveryRating },
  { label: 'Value Of Delivery', rating: qualityOfWorkRating }
].map(({ label, rating }, idx) => (
  <div key={idx} className='flex flex-wrap items-center justify-between gap-2'>
    <p className='min-w-[200px]'>{label}</p>
    <div className='flex items-center gap-1'>
      <StarRating rating={rating} />
      <span>{rating}</span>
    </div>
  </div>
))}
</div>




  </div>
);
};




export default ReviewCard;
