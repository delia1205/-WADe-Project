import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res.json("Signup successful.");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    next(errorHandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(
        errorHandler(404, `User with username ${username} not found.`)
      );
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Password is invalid."));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_KEY
    );

    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json({ token, ...rest });
  } catch (error) {
    next(error);
  }
};
