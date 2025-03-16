const LoadingSpinner = ({ size = "large" }: { size?: "small" | "medium" | "large" }) => {
    const sizeClasses = {
      small: "h-5 w-5 border-2",
      medium: "h-8 w-8 border-3",
      large: "h-12 w-12 border-4",
    };
    
    const spinnerClass = `${sizeClasses[size]} animate-spin rounded-full border-solid border-primary border-t-transparent`;
    
    return (
      <div className="flex items-center justify-center">
        <div className={spinnerClass} role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;