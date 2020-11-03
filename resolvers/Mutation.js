import getUserData from "../middleware/auth";
import Member from "../model/member";
import Position from "../model/position";

const Mutation = {
  createMember: async (
    parent,
    { data: { secret, year } },
    { request },
    info
  ) => {
    try {
      const userData = getUserData(request);
      if (userData.category !== "developer") {
        throw new Error("only developer can add new member.");
      }
      const newMember = new Member({ secret, year });
      await newMember.save();
      return newMember;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  createPosition: async (parent, { title }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can add new member.");
    }

    const position = new Position({ title });
    await position.save();
    return position;
  },
};

export { Mutation as default };
