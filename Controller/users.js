import User from "../Models/users.js";
// get all posts
export const getUsers = async (req, res, next) => {
  const pages = Number(req.query.pages ? req.query.pages : 1);
  const perPage = Number(req.query.perPage ? req.query.perPage : 20);
  const skipRecords = Number((pages - 1) * perPage);

  try {
    const users = await User.find()
      .select({ name: 1, email: 1, role: 1, createdAt: 1, _id: 0 })
      .skip(skipRecords)
      .limit(perPage);
    const total = await User.countDocuments();

    res.status(200).json({ users, total });
  } catch (error) {
    next(error);
  }
};
