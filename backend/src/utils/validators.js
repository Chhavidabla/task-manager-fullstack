/**
 * Returns an error message string if invalid, or null if valid.
 */
function validateTitle(title) {
  if (title === undefined || title === null) return "Title is required.";
  if (typeof title !== "string") return "Title must be a string.";
  if (title.trim().length === 0) return "Title cannot be empty.";
  if (title.trim().length < 2) return "Title must be at least 2 characters.";
  if (title.trim().length > 200) return "Title cannot exceed 200 characters.";
  return null;
}

module.exports = { validateTitle };
