export const validateReviewInput = (
  rating: string,
  comment: string,
  setError: (message: string) => void,
): boolean => {
  const parsedRating = parseInt(rating);
  if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
    setError('Please enter a valid rating between 1 and 5.');
    return false;
  }
  if (!comment || comment.length > 200) {
    setError('Please keep your comment under 200 characters.');
    return false;
  }
  setError(''); // Clear previous errors if all validations pass
  return true;
};
