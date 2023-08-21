module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo inkorrekt oder existiert schon";

  if (err.message.includes("email")) errors.email = "Email inkorrekt";

  if (err.message.includes("password"))
    errors.password = "Email soll minimum 6 Zeichen haben";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Pseudo existiert schon";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Email existiert schon";

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "Email nicht bekannt";

  if (err.message.includes("password"))
    errors.password = "Password stimmt nicht";

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file")) errors.format = "schlechtes Format";

  if (err.message.includes("max size"))
    errors.maxSize = "Datei überschreit 500ko";

  return errors;
};
