
const Input = ({ className = '', ...props }) => {
  return (
    <input 
      className={`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export { Input };
