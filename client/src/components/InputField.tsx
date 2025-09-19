type InputFieldProps = {
  type: string;
  placeholder: string;
  id: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const InputField = ({ type, placeholder, value, onChange, className, id }: InputFieldProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    id={id}
    className={`border bg-white rounded px-3 py-2 ${className}`}
  />
);

export default InputField;