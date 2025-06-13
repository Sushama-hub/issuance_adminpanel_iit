// Allow only digits on key press
export const allowOnlyDigitsKeyPress = (e) => {
  const char = String.fromCharCode(e.which || e.keyCode);
  // if (/^[0-9]+$/.test(char)) return true;
  // else e.preventDefault(); // If not match, don't add to input text

  // Allow only digits
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault();
  }
};
