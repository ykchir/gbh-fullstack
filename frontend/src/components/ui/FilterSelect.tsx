interface FilterSelectProps {
  label: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export default function FilterSelect({
  label,
  options,
  value,
  onChange,
  disabled,
}: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
        className="p-2 border rounded w-full"
      >
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
