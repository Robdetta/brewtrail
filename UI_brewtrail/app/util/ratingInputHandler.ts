export const handleRatingInput = (
  text: string,
  setterFunction: (value: string) => void,
): void => {
  const num = parseInt(text);
  if (num >= 1 && num <= 5) {
    setterFunction(String(num)); // Convert num back to string and set it
  } else if (text === '') {
    setterFunction(''); // Allow clearing the input
  } else {
    // Ignore the input if it's not a single digit between 1 and 5
    setterFunction('');
  }
};
