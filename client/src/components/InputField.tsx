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
    className={`${className}`}
  />
);

export default InputField;