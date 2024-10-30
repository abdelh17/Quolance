export default function DesiredExperienceLevelRadioGroup() {
  const desiredExperienceLevel = [
    { id: 'beginner', label: 'Beginner ($)' },
    { id: 'intermediate', label: 'Intermediate ($$)' },
    { id: 'expert', label: 'Expert ($$$)' },
  ];
  

  return (
    <fieldset>
      <div className='space-y-6'>
        {desiredExperienceLevel.map((item) => (
          <div key={item.id} className='flex items-center'>
            <input
              defaultChecked={item.id === 'beginner'}
              id={item.id}
              type='radio'
              name="experienceLevel"
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
