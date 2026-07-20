import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../services/employeeService";
import { departments, roles, statuses } from "../services/mockData";
import { validateEmployee } from "../utils/validation";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  role: "",
  status: "Active",
  joiningDate: "",
  image: "",
};

function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [loadError,   setLoadError] = useState("");

  // if editing, fetch the existing employee and fill the form
  useEffect(() => {
    if (!isEdit) return;
    employeeService
      .getById(id)
      .then((data) => setValues(data))
      .catch(() => setLoadError("Could not load this employee."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // handle optional profile image - store as base64 data url
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValues((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateEmployee(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await employeeService.update(id, values);
      } else {
        await employeeService.create(values);
      }
      navigate("/employees");
    } catch {
      setLoadError("Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400">Loading...</p>;
  }

  if (loadError && isEdit && !values.name) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h1>
        <p className="text-sm text-slate-500">
          {isEdit
            ? "Update the employee's details below."
            : "Fill in the details to add a new employee."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
      >
        {loadError && (
          <div className="bg-red-50 text-red-600 rounded-lg px-3 py-2 text-sm">
            {loadError}
          </div>
        )}

        {/* profile image preview + upload */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-400 text-xl">
            {values.image ? (
              <img
                src={values.image}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              (values.name.charAt(0) || "?").toUpperCase()
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Profile Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Full name"
            error={errors.name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="name@company.com"
            error={errors.email}
          />
          <Select
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={departments}
            placeholder="Select department"
            error={errors.department}
          />
          <Select
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange}
            options={roles}
            placeholder="Select role"
            error={errors.role}
          />
          <Select
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={statuses}
            placeholder="Select status"
            error={errors.status}
          />
          <Input
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={values.joiningDate}
            onChange={handleChange}
            error={errors.joiningDate}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/employees")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
