// Reusable select dropdown.

function Select({ label, name, value, onChange, options = [], error = "", placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default Select;
