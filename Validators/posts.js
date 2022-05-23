// validating date
export const validateDate = (date) => {
  if (date.getFullYear() >= new Date().getFullYear() + 10) {
    return false;
  }
  if (date <= new Date()) {
    return false;
  }
  return true;
};
