const Input = ({
  placeholder,
  reference,
  classname
}: {
  placeholder: string;
  reference: any;
  classname?:string
}) => {
  return (
    <div className="w-full flex  justify-center">
      <input
        placeholder={placeholder}
        ref={reference}
        type="text"
        className={`px-4 w-full py-2 border border-gray-300 rounded-md ${classname}`}
      />
    </div>
  );
};

export default Input;
