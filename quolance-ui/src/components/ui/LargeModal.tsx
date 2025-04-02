import { PiX } from 'react-icons/pi';
import { ReactNode, SetStateAction } from 'react';

interface LargeModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string | ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string | number | boolean | ReactNode | null;
  confirmButtonColor?: string;
  cancelText?: string;
  footerExtra?: ReactNode;
  disableConfirm?: boolean;
  showConfirmButton?: boolean;
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
  cancelText = 'Cancel',
  footerExtra,
  disableConfirm = false,
  showConfirmButton = true,
}: LargeModalProps) {
  const confirmButtonClass = disableConfirm
    ? 'relative flex items-center justify-center overflow-hidden rounded-full bg-gray-300 px-6 py-2 font-medium text-white opacity-70 cursor-not-allowed'
    : `hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full ${confirmButtonColor} px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]`;

  return (
    <>
      <section
        className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-700 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className='flex max-h-[90vh] min-h-[300px] w-full max-w-[1000px] flex-col overflow-y-auto rounded-2xl bg-white p-8 drop-shadow-2xl'>
          {/* Header */}
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              {icon && <span className={`text-3xl ${iconColor}`}>{icon}</span>}
              <div className='text-xl font-medium'>{title}</div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <PiX className='text-2xl' />
            </button>
          </div>

          {/* Body */}
          <div className='flex-grow py-6'>{children}</div>

          {/* Footer */}
          <div className='mt-auto flex items-center justify-end gap-4'>
            {footerExtra}
            <button
              data-test='cancel-btn'
              onClick={() => setIsOpen(false)}
              className='bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-gray-200 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>{cancelText}</span>
            </button>
            {showConfirmButton && (
              <button
                data-test='confirm-btn'
                onClick={!disableConfirm && onConfirm ? onConfirm : undefined}
                disabled={disableConfirm || !onConfirm}
                className={confirmButtonClass}
              >
                <span className='relative z-10'>{confirmText}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Overlay */}
      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      />
    </>
  );
}
