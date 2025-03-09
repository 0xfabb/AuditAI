export function Button({ children, className, ...props }) {
    return (
      <button
        className={`bg-blue-600 hover:bg-blue-700 p-3 w-full text-white font-semibold rounded transition ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  