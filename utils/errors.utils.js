// Define a function to handle sign-up errors
module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  // Check if the error message includes "pseudo"
  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect or already exists";

  // Check if the error message includes "email"
  if (err.message.includes("email")) errors.email = "Email incorrect";

  // Check if the error message includes "password"
  if (err.message.includes("password"))
    errors.password = "Email must be at least 6 characters long";

  // Check if the error code is 11000 (duplicate key error) and if it's related to "pseudo" or "email"
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Pseudo already exists";
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Email already exists";

  return errors;
};

//Define a function to handle sign-in errors
module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  // Check if the error message includes "email"
  if (err.message.includes("email")) errors.email = "Unknown email address";

  // Check if the error message includes "password"
  if (err.message.includes("password"))
    errors.password = "Password is incorrect";

  return errors;
};

// Define a function to handle upload errors
module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  // Check if the error message includes "invalid file"
  if (err.message.includes("invalid file")) errors.format = "Invalid format";

  // Check if the error message includes "max size"
  if (err.message.includes("max size")) errors.maxSize = "File exceeds 500 KB";

  return errors;
};
