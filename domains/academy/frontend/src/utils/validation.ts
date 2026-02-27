export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return "Password must contain uppercase, lowercase, number and special character";
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirm: string,
): string | null => {
  if (!confirm) {
    return "Please confirm your password";
  }
  if (password !== confirm) {
    return "Passwords do not match";
  }
  return null;
};

export const validateName = (
  name: string,
  fieldName: string,
): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }

  // Alphabetic characters only (including spaces and hyphens)
  const nameRegex = /^[A-Za-z\s-]+$/;
  if (!nameRegex.test(name.trim())) {
    return `${fieldName} must contain only alphabetic characters`;
  }

  return null;
};
