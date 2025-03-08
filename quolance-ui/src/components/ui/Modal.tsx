import { PiX } from 'react-icons/pi';
import { ReactNode, SetStateAction } from 'react';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  icon?: ReactNode;
  iconColor?: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  confirmButtonColor?: string;
}

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  icon,
  iconColor = 'text-blue-600',
  children,
  onConfirm,
  confirmText = 'Confirm',
  confirmButtonColor = 'bg-blue-600',
}: ModalProps) {
  return (
    <>
      <section
        className={`fixed left-0 right-0 top-0 z-[999] flex h-auto items-center justify-center overflow-y-auto delay-[30ms] duration-700 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className='mx-3 my-20 max-w-[500px] rounded-2xl bg-white p-8 drop-shadow-2xl'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              {icon && <span className={`text-3xl ${iconColor}`}>{icon}</span>}
              <p className='text-xl font-medium'>{title}</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <PiX className='text-2xl' />
            </button>
          </div>

          <div className='py-6'>{children}</div>

          <div className='flex items-end justify-end gap-4'>
            <button
              data-test="cancel-btn"
              onClick={() => setIsOpen(false)}
              className='bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-gray-200 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Cancel</span>
            </button>
            <button
              data-test="confirm-btn"
              onClick={onConfirm}
              className={`hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full ${confirmButtonColor} px-6 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]`}
            >
              <span className='relative z-10'>{confirmText}</span>
            </button>
          </div>
        </div>
      </section>

      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      />
    </>
  );
}
