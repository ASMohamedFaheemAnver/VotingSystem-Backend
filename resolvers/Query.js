import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Developer from "../model/developer";
import Position from "../model/position";
import Vote from "../model/vote";

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
    if (
      gPosition.eligible_gender.toString() === "M" ||
      gPosition.eligible_gender.toString() === "F"
    ) {
      members = await Member.find({
        year: gPosition.eligible_year,
        gender: gPosition.eligible_gender,
      });
    } else {
      members = await Member.find({
        year: gPosition.eligible_year,
      });
    }
    return members;
  },

  getAllPositions: async (parent, args, { request }, info) => {
    const userData = getUserData(request);

    // console.log(userData);
    if (userData.category !== "developer" && userData.category !== "member") {
      throw new Error("only developer or member can view available positions.");
    }

    const positions = await Position.find();
    return positions;
  },

  /* should learn aggregate in mongoose
  getFirstPollResult: async (parent, args, { request }, info) => {
    const userData = getUserData(request);

    // console.log(userData);
    if (userData.category !== "developer") {
      throw new Error("only developer can view poll result.");
    }

    const positions = await Position.find();
    // console.log(positions);
    let pollResults = [];

    for (let i = 0; i < positions.length; i++) {
      const eligible_member_infos = [];

      let pollResult = {
        position: positions[i],
        eligible_member_infos: eligible_member_infos,
      };

      const eligible_members = await Vote.find({
        position: position[i],
        meta: "first",
      });
    }

    return pollResults;
  },
  */

  getFirstPollAllResult: async (parent, args, { request }, info) => {
    const userData = getUserData(request);

    // console.log(userData);
    if (userData.category !== "developer") {
      throw new Error("only developer can view poll result.");
    }

    const positions = await Position.find();
    // console.log(positions);
    let pollResults = [];

    for (let i = 0; i < positions.length; i++) {
      const eligible_member_infos = [];

      let pollResult = {
        position: positions[i],
        eligible_member_infos: eligible_member_infos,
      };

      let members;
      const gPosition = positions[i];
      if (
        gPosition.eligible_gender.toString() === "M" ||
        gPosition.eligible_gender.toString() === "F"
      ) {
        members = await Member.find({
          year: gPosition.eligible_year,
          gender: gPosition.eligible_gender,
        });
      } else {
        members = await Member.find({
          year: gPosition.eligible_year,
        });
      }

      // console.log(members);
      let eligible_member_info;
      // console.log(members.length);
      for (let j = 0; j < members.length; j++) {
        const received_vote = await Vote.countDocuments({
          position: gPosition._id,
          to: members[j]._id,
          meta: "first",
        });
        eligible_member_info = {
          member: members[j],
          vote_recieved: received_vote,
        };
        // console.log(eligible_member_info);
        pollResult.eligible_member_infos.push(eligible_member_info);

        // pollResult.eligible_member_infos.push(eligible_member_info);
      }
      pollResults.push(pollResult);
    }

    return pollResults;
  },
};

export { Query as default };
