import zxcvbn from "zxcvbn";

interface PasswordStrengthBarProps {
  password: string;
}

export default function PasswordStrengthBar(props: Readonly<PasswordStrengthBarProps>) {
  const password = props.password || ""; // Fallback to empty string if password is undefined
  const strength = zxcvbn(password).score;

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${strengthColors[strength]}`}
          style={{ width: `${(strength + 1) * 20}%` }}
        ></div>
      </div>

      {/* Strength Label */}
      <div className="flex justify-end text-sm/6">{strengthLabels[strength]}</div>
    </div>
  );
}
