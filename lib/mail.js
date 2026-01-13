export const validateEmailFormat = (value) => {
  const regex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com|yahoo\.[a-zA-Z.]+|icloud\.com|me\.com|mac\.com|outlook\.com|hotmail\.com|live\.com)$/;
  return regex.test(value);
};
