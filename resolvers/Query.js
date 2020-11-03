import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Developer from "../model/developer";
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
};

export { Query as default };
