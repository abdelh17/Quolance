export default function ExpectectedDeliveryRadioGroup() {
  const expectedDelivery = [
    { id: '1-immediately', label: 'Immediately' },
    { id: '2-this_month', label: 'This month' },
    { id: '3-next_few_months', label: 'In the next few months' },
    { id: '4-flexible', label: 'Flexible' },
  ];

  return (
    <fieldset>
      <div className='space-y-6'>
        {expectedDelivery.map((item) => (
          <div key={item.id} className='flex items-center'>
            <input
              defaultChecked={item.id === '1-immediately'}
              id={item.id}
              type='radio'
              name='expectedDelivery'
              className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
            />
            <label
              htmlFor={item.label}
              className='ml-3 block text-sm/6 font-medium text-gray-900'
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
