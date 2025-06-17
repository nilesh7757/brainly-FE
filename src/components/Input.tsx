const Input = ({
  placeholder,
  reference,
}: {
  placeholder: string;
  reference: any;
}) => {
  return (
    <div>
      <input
        placeholder={placeholder}
        ref={reference}
        type="text"
        className="px-4 py-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default Input;
