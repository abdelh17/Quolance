export default function ClientBudgetRadioGroup() {
  const clientBudget = [
    { id: 'budget-1', label: 'Less than $500' },
    { id: 'budget-2', label: '$500 to $1,000' },
    { id: 'budget-3', label: '$1,000 to $5,000' },
    { id: 'budget-4', label: '$5,000 to $10,000' },
    { id: 'budget-5', label: '$10,000 and above' },
  ];  
  return (
    <fieldset>
      <div className='space-y-6'>
        {clientBudget.map((budget) => (
          <div key={budget.id} className='flex items-center'>
            <input
              defaultChecked={budget.id === 'budget-1'}
              id={budget.id}
              type='radio'
              name='clientBudget'
              className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
            />
            <label
              htmlFor={budget.label}
              className='ml-3 block text-sm/6 font-medium text-gray-900'
            >
              {budget.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
