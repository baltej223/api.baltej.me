import { User } from "../../../db/database.js";
import SendJWT from "../../../utils/send_jwt.js";

export default async function HandleLogin(req, res) {
  let body = req.body;

  if (
    body == undefined ||
    body.email == undefined ||
    body.password == undefined
  ) {
    res
      .status(400)
      .json({
        error: "Bad Request",
        message: "Not all necessary parameters were passed.",
      });
  }

  let email = body.email;
  let password = body.password;

  let user;

  try {
    user = await User.find({ email, password }).exec();
  } catch (e) {
    res.status(500).json({
      error: "Internal Database Error",
      message: e,
    });
  }
  // console.log(user);
  if (user.length != 0) {
    SendJWT(res, user._id);
  } else {
    res.send("FORBIDDEN!", 400);
  }
}
