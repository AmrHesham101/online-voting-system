// Import required modules and packages
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get a list of all users
const getUsers = async (req, res, next) => {
  let users;
  try {
    // Retrieve all users, excluding the password field
    users = await UserModel.find({}, "-password");
  } catch (error) {
    // Handle errors during user retrieval
    return next(new HttpError("Fetching users failed, please try again", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// User signup function
const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    // Handle validation errors
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password, imageUrl } = req.body;
  let existingUser;

  try {
    // Check if a user with the provided email already exists
    existingUser = await UserModel.findOne({ email: email });
  } catch (error) {
    // Handle errors during the user check
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  if (existingUser) {
    // Handle the case where the user already exists
    return next(new HttpError("User already exists, please login instead", 422));
  }

  let hashedPassword;
  try {
    // Hash the user's password for security
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    // Handle errors during password hashing
    return next(new HttpError("Could not create user, please try again", 500));
  }

  const createdUser = new UserModel({
    name,
    email,
    image: imageUrl,
    password: hashedPassword,
    places: [],
  });

  try {
    // Save the new user in the database
    await createdUser.save();
  } catch (err) {
    // Handle errors during user creation
    return next(new HttpError("User creation failed, please try again", 500));
  }

  let token;
  try {
    // Generate a JSON Web Token (JWT) for the user
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    // Handle errors during JWT generation
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  // Respond with user data and token
  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
    token: token,
  });
};

// User login function
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    // Find the user by their email
    existingUser = await UserModel.findOne({ email: email });
  } catch (error) {
    // Handle errors during user retrieval
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  if (!existingUser) {
    // Handle the case where the user does not exist
    return next(
      new HttpError("Invalid credentials, could not log you in", 403)
    );
  }

  let isValidPassword = false;

  try {
    // Check if the provided password matches the hashed password
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    // Handle errors during password comparison
    return next(
      new HttpError(
        "Could not log in, please check your credentials and try again",
        403
      )
    );
  }

  if (!isValidPassword) {
    // Handle invalid password
    return next(
      new HttpError("Invalid credentials, could not log you in", 403)
    );
  }

  let token;

  try {
    // Generate a JSON Web Token (JWT) for the user
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    // Handle errors during JWT generation
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  // Respond with user data and token
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    token: token,
  });
};

// Export the controller functions
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
