const Input = ({
  placeholder,
  reference,
  className,
  type = "text"
}: {
  placeholder: string;
  reference: any;
  className?: string;
  type?: string;
}) => {
  return (
    <div className="w-full flex  justify-center">
      <input
        placeholder={placeholder}
        ref={reference}
        type={type}
        className={`px-4 w-full py-2 border border-gray-300 rounded-md ${className || ''}`}
      />
    </div>
  );
};

export default Input;
