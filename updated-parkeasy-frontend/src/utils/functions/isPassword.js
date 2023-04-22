const isPassword = (password) => {
  const length = /^.{8,32}/;
  const upper = /[A-Z]/;
  const lower = /[a-z]/;
  const numbers = /[0-9]/;
  const special = /[^A-Za-z0-9]/;
  return (
    length.test(password) &&
    upper.test(password) &&
    lower.test(password) &&
    numbers.test(password) &&
    special.test(password)
  );
};
export default isPassword;
