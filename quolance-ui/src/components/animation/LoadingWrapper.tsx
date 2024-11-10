import React, { ReactElement } from 'react';

const LoadingWrapper = ({
  isLoading,
  children,
  className = '',
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  // If not loading, render children normally
  if (!isLoading) {
    return <>{children}</>;
  }

  // Function to create skeleton version of an element
  const createSkeleton = (element: ReactElement): ReactElement => {
    const elementClassNames = element.props.className || '';

    return React.cloneElement(element, {
      className: `${elementClassNames} z-100 rounded-md p-[1px] before:absolute before:inset-0 before:animate-pulse before:bg-slate-200 dark:before:bg-slate-600 relative overflow-hidden text-transparent ${className}`,
      children: element.props.children
        ? React.Children.map(element.props.children, (child) =>
            React.isValidElement(child) ? createSkeleton(child) : child
          )
        : element.props.children,
    });
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? createSkeleton(child) : child
      )}
    </>
  );
};

export default LoadingWrapper;
