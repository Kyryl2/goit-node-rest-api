import User from "../schemas/user.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const createUser = ({ username, email, password }) => {
  const newUser = new User({ username, email });
  newUser.setPassword(password);
  return newUser.save();
};
