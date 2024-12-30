import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/util/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-b300 text-white hover:bg-b300/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        white:
          'bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        footerColor: 'bg-n900 text-white hover:bg-n800',
        animated: '',
        custom: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
        full: 'w-full',
        auto: 'xl:w-min xl:px-10',
      },
      shape: {
        default: 'rounded-md',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  }
);

interface AnimationConfig {
  hoverTextColor?: string;
  overlayColor?: string;
}

export const animationPresets = {
  default: {
    hoverTextColor: 'text-n900',
    overlayColor: 'bg-yellow-400',
  },
} as const;

export type AnimationPreset = keyof typeof animationPresets;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'shape'>,
    Omit<VariantProps<typeof buttonVariants>, 'shape'> {
  asChild?: boolean;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  animation?: AnimationConfig | AnimationPreset;
  bgColor?: string;
  textColor?: string;
  shape?: VariantProps<typeof buttonVariants>['shape'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size,
      shape,
      asChild = false,
      icon,
      iconPosition = 'left',
      animation,
      bgColor,
      textColor,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const animationConfig =
      typeof animation === 'string' ? animationPresets[animation] : animation;

    const IconWrapper = icon
      ? React.cloneElement(icon, {
          className: cn(
            'h-5 w-5',
            iconPosition === 'left' ? '-ml-0.5 mr-1.5' : '-mr-0.5 ml-1.5',
            animationConfig ? 'relative z-10 !text-current' : 'text-gray-400',
            icon.props.className
          ),
        })
      : null;

    const animationClasses = animationConfig
      ? cn(
          'relative overflow-hidden duration-700',
          !bgColor && 'bg-b300',
          !textColor && 'text-white',
          bgColor && `bg-${bgColor}`,
          textColor && `text-${textColor}`,
          `hover:${animationConfig.hoverTextColor || 'text-n900'}`,
          'after:absolute after:-left-2 after:-right-2',
          'after:w-0 after:h-[calc(100%+16px)]',
          'after:-top-2 ',
          `after:${animationConfig.overlayColor || 'bg-yellow-400'}`,
          'after:duration-700 hover:after:w-[calc(100%+16px)]',
          'after:transition-all after:ease-out',
          shape === 'full' ? 'after:rounded-full' : 'after:rounded-md'
        )
      : '';

    const customColorClasses =
      !animationConfig && (bgColor || textColor)
        ? cn(bgColor && `bg-${bgColor}`, textColor && `text-${textColor}`)
        : '';

    const effectiveVariant = customColorClasses
      ? 'custom'
      : animationConfig
      ? 'animated'
      : variant;

    return (
      <Comp
        className={cn(
          'group',
          buttonVariants({
            variant: effectiveVariant,
            size,
            shape,
            className,
          }),
          effectiveVariant === 'custom' || effectiveVariant === 'animated'
            ? cn(animationClasses, customColorClasses)
            : null
        )}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && IconWrapper}
        <span className='bg-b relative z-10 flex  flex-row'>{children}</span>
        {icon && iconPosition === 'right' && IconWrapper}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
