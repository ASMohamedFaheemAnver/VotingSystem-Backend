import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Developer from "../model/developer";
import Position from "../model/position";

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

    const members = await Member.find();
    return members;
  },

  getAllMembersByPosition: async (parent, { position }, { request }, info) => {
    const userData = getUserData(request);

    // console.log(userData);
    if (userData.category !== "developer" && userData.category !== "member") {
      throw new Error(
        "only developer or member can view eligible member's details."
      );
    }

    const gPosition = await Position.findById(position);
    let members;
    if (gPosition.gender === "M" || gPosition.gender === "M") {
      members = await Member.find({
        year: gPosition.eligible_year,
        gender: gPosition.gender,
      });
    } else {
      members = await Member.find({
        year: gPosition.eligible_year,
      });
    }
    return members;
  },
};

export { Query as default };
