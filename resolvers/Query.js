import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Developer from "../model/developer";
import Member from "../model/member";
import getUserData from "../middleware/auth";

const Query = {
  loginDeveloper: async (parent, { data: { email, password } }, ctx, info) => {
    try {
      const developer = await Developer.findOne({
        email: email,
      });
      const isAuth = await bcrypt.compare(password, developer.password);
      if (isAuth) {
        const token = jwt.sign(
          { encryptedId: developer._id.toString(), category: "developer" },
          process.env.secret_word,
          { expiresIn: "10h" }
        );
        return { _id: developer._id, token: token, expiresIn: 36000 };
      } else {
        throw new Error("your entered password is incorrect.");
      }
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  loginMember: async (parent, { data: { secret } }, ctx, info) => {
    try {
      const member = await Member.findOne({
        secret: secret,
      });

      if (member) {
        const token = jwt.sign(
          { encryptedId: member._id.toString(), category: "member" },
          process.env.secret_word,
          { expiresIn: "10h" }
        );
        return { _id: member._id, token: token, expiresIn: 36000 };
      } else {
        throw new Error("your entered secret is incorrect.");
      }
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  getAllMembers: async (parent, args, { request }, info) => {
    const userData = getUserData(request);

    if (userData.category !== "developer") {
      throw new Error("only developer can view member's details.");
    }

    const members = Member.find();
    return members;
  },
};

export { Query as default };
