interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export default function FilterSelect({
  label,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="">All {label}s</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
