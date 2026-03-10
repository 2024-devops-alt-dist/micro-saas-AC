type InputFieldProps = {
  type: string;
  placeholder: string;
  id: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  "aria-label"?: string;
};

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  id,
  required,
  "aria-label": ariaLabel,
}: InputFieldProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    id={id}
    className={`${className}`}
    required={required}
    aria-label={ariaLabel}
  />
);

export default InputField;