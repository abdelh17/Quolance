import zxcvbn from "zxcvbn";

interface PasswordStrengthBarProps {
  password: string;
}

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
    const strength = zxcvbn(password || "").score;

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

    return (
        <div>
            <div className="h-2 w-full bg-gray-200 rounded">
                <div
                    className={`h-2 rounded transition-all duration-300 ${strengthColors[strength]}`}
                    style={{ width: `${(strength + 1) * 20}%` }}
                ></div>
            </div>

            <div className="flex justify-end text-xs font-medium text-gray-600 mt-1">
                {strengthLabels[strength]}
            </div>
        </div>
    );
}
