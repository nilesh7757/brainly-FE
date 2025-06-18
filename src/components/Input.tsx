const Input = ({
  placeholder,
  reference,
  className,
  type = "text",
  disabled = false
}: {
  placeholder: string;
  reference: any;
  className?: string;
  type?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="w-full flex  justify-center">
      <input
        placeholder={placeholder}
        ref={reference}
        type={type}
        disabled={disabled}
        className={`px-4 w-full py-2 border border-gray-300 rounded-md ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${className || ''}`}
      />
    </div>
  );
};

export default Input;
