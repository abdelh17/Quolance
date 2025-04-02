import React from 'react';

type Props = {
  password: string;
};

export default function PasswordRequirements({ password }: Props) {
  const rules = [
    {
      label: 'At least 8 characters',
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: 'At least one lowercase letter',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: 'At least one uppercase letter',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least one number',
      test: (pw: string) => /\d/.test(pw),
    },
    {
      label: 'At least one special character',
      test: (pw: string) => /[^a-zA-Z0-9]/.test(pw),
    },
  ];

  if (!password) return null;

  return (
    <div className="p-2 mt-2 border rounded-md text-sm bg-gray-50">
      <p className="font-medium mb-1">Password must contain:</p>
      <ul className="space-y-1">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>
              {rule.test(password) ? '✅' : '❌'}
            </span>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
