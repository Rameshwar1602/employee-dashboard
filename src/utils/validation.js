// Validation for the employee form. Returns an object of errors keyed by field.
export function validateEmployee(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.department) {
    errors.department = "Please select a department";
  }

  if (!values.role) {
    errors.role = "Please select a role";
  }

  if (!values.status) {
    errors.status = "Please select a status";
  }

  if (!values.joiningDate) {
    errors.joiningDate = "Joining date is required";
  }

  return errors;
}
