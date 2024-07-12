import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required" });
  }

  const existedUser = await User.findOne({ username });

  if (existedUser) {
    return res
      .status(409)
      .json({ status: 409, message: "User with username already exists" });
  }
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        status: 500,
        message: "Something went wrong while registering the user",
      });
    }

    return res.status(201).json({
      status: 201,
      user: createdUser,
      message: "User registered Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "username and passsword is required" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "User does not exist" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid user credentials" });
  }

  const accessToken = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(
    "username email fullName friends"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res.status(200).cookie("accessToken", accessToken, options).json({
    status: 200,
    user: loggedInUser,
    accessToken,
    message: "User logged In Successfully",
  });
};

const logoutUser = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json({ message: "User logged Out" });
};

const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!(typeof q === "string" && q.length > 0))
    return res.status(200).send({ users: [], message: "Please enter words." });
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } }, // Case-insensitive username match
        { fullName: { $regex: q, $options: "i" } }, // Case-insensitive full name match
      ],
    })
      .select("username fullName")
      .limit(20);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const getCurrentUser = async (req, res) => {
  const { fullName, username, email } = req.user;

  return res.status(200).json({ fullName, username, email });
};

// Update user by ID
const updateCurrentUser = async (req, res) => {
  const user = req.user;
  const { fullName, email, password } = req.body;

  try {
    // Update fields
    if (fullName) user.fullName = fullName;
    if (password) user.password = password;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ user, message: "Crediential Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Delete user by ID
const deleteCurrentUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    // Remove Friend List
    user.friends.forEach(async (friendId) => {
      try {
        await User.findByIdAndUpdate(friendId, { $pull: { friends: user.id } });
      } catch (error) {
        console.log(error.message);
      }
    });
    // TODO Delete Messages

    await user.deleteOne();
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", options).json({ message: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  searchUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};
