import getUserData from "../middleware/auth";
import Member from "../model/member";
import Position from "../model/position";
import Vote from "../model/vote";

const Mutation = {
  createMember: async (
    parent,
    { data: { secret, year, gender } },
    { request },
    info
  ) => {
    try {
      const userData = getUserData(request);
      if (userData.category !== "developer") {
        throw new Error("only developer can add new member.");
      }
      const newMember = new Member({
        secret,
        year,
        admin: userData.encryptedId,
        gender,
      });
      await newMember.save();
      return newMember;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  createPosition: async (
    parent,
    { data: { title, eligible_year, eligible_gender } },
    { request },
    info
  ) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can add new member.");
    }

    const position = new Position({ title, eligible_year, eligible_gender });
    await position.save();
    return position;
  },

  createVote: async (parent, { data: { position, to } }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "member") {
      throw new Error("only member can vote.");
    }

    const vote = new Vote({
      position: position,
      to: to,
      from: userData.encryptedId,
      meta: "undefined",
    });

    const existingVote = await Vote.findOne({
      position: vote.position,
      from: vote.from,
    });
    if (existingVote) {
      throw new Error("already voted for this position.");
    }

    await vote.save();
    return vote;
  },
};

export { Mutation as default };
