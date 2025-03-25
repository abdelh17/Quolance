import { PiX } from 'react-icons/pi';
import { ReactNode, SetStateAction } from 'react';

interface LargeModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  icon?: ReactNode;
  iconColor?: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  confirmButtonColor?: string;
  /** Extra content to be rendered in the footer, before the Cancel/Confirm buttons */
  footerExtra?: ReactNode;
}

export default function LargeModal({
  isOpen,
  setIsOpen,
  title,
  icon,
  iconColor = 'text-blue-600',
  children,
  onConfirm,
  confirmText = 'Confirm',
  confirmButtonColor = 'bg-blue-600',
  footerExtra,
}: LargeModalProps) {
  return (
    <>
      <section
        className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-700 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        {/* 
          Adaptive modal:
          - max-w-[1000px]: up to 1000px wide
          - min-h-[300px]: ensures a minimum height
          - max-h-[90vh] overflow-y-auto: scroll if content is tall
        */}
        <div className="w-full max-w-[1000px] min-h-[300px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 drop-shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {icon && <span className={`text-3xl ${iconColor}`}>{icon}</span>}
              <p className="text-xl font-medium">{title}</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <PiX className="text-2xl" />
            </button>
          </div>

          {/* Body */}
          <div className="py-6">{children}</div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4">
            {/* Extra content (e.g., Generate button) */}
            {footerExtra}

            {/* Cancel */}
            <button
              data-test="cancel-btn"
              onClick={() => setIsOpen(false)}
              className="bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-gray-200 after:duration-700 hover:after:w-[calc(100%+2px)]"
            >
              <span className="relative z-10">Cancel</span>
            </button>

            {/* Confirm (Apply) */}
            <button
              data-test="confirm-btn"
              onClick={onConfirm}
              className={`hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full ${confirmButtonColor} px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]`}
            >
              <span className="relative z-10">{confirmText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Semi-opaque background overlay */}
      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      />
    </>
  );
}
