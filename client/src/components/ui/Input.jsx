export function Input({ className, ...props }) {
    return (
      <input
        className={`w-full p-3 text-lg rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    );
  }
  