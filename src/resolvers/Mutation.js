import getUserData from "../middleware/auth";
import Member from "../model/member";
import Developer from "../model/developer";
import Position from "../model/position";
import Vote from "../model/vote";

const Mutation = {
  createMember: async (
    parent,
    { data: { year, gender, name, secret } },
    { request },
    info
  ) => {
    try {
      const userData = getUserData(request);
      if (userData.category !== "developer") {
        throw new Error("only developer can add new member.");
      }
      // if (number_of_members > 50) {
      //   throw new Error("we don't allow more than 50 bult creation.");
      // }

      // const members = [];
      // for (let i = 0; i < number_of_members; i++) {
      const newMember = new Member({
        // secret: Math.random().toString().slice(2, 12),
        secret: secret,
        year,
        admin: userData.encryptedId,
        gender,
        name,
      });
      await newMember.save();
      // members.push(newMember);
      // }

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

  makeAMemberEligible: async (parent, { _id, position }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Member.findOneAndUpdate({ _id: _id }, { $push: { eligible_for: position } });
    return { msg: "member updated successfully." };
  },

  enableFirstPoll: async (parent, { _id }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Developer.findOneAndUpdate(
      { _id: userData.encryptedId },
      { is_first_poll_enabled: true }
    );
    return { msg: "first poll enabled." };
  },

  enableSecondPoll: async (parent, { _id }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Developer.findOneAndUpdate(
      { _id: userData.encryptedId },
      { is_second_poll_enabled: true }
    );
    return { msg: "second poll enabled." };
  },

  disableFirstPoll: async (parent, { _id }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Developer.findOneAndUpdate(
      { _id: userData.encryptedId },
      { is_first_poll_enabled: false }
    );
    return { msg: "first poll disabled." };
  },

  disableSecondPoll: async (parent, { _id }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Developer.findOneAndUpdate(
      { _id: userData.encryptedId },
      { is_second_poll_enabled: false }
    );
    return { msg: "second poll disabled." };
  },

  makeAMemberNotEligible: async (parent, { _id, position }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "developer") {
      throw new Error("only developer can update a member.");
    }

    await Member.findOneAndUpdate({ _id: _id }, { $pull: { eligible_for: position } }
    );
    return { msg: "member updated successfully." };
  },

  createVotes: async (parent, { data }, { request }, info) => {
    const userData = getUserData(request);
    if (userData.category !== "member") {
      throw new Error("only member can vote.");
    }

    for (let i = 0; i < data.length; i++) {
      const vote = data[i];
      for (let j = i + 1; j < data.length; j++) {
        if (vote.position.toString() === data[j].position.toString()) {
          throw new Error("duplicate votes are detected!");
        }
      }
    }

    if (data.length < 8) {
      throw new Error("should vote all positions.");
    }

    const votes = [];
    for (let i = 0; i < data.length; i++) {
      const vote = new Vote({
        position: data[i].position,
        to: data[i].to,
        from: userData.encryptedId,
        meta: "undefined",
      });

      /* offline check made */
      // const existingVote = await Vote.findOne({
      //   position: vote.position,
      //   from: vote.from,
      // });
      // if (existingVote) {
      //   throw new Error("already voted for this position.");
      // }
      vote.$is_final = i === data.length - 1 ? true : false;
      await vote.save();
      votes.push(vote);
    }
    return votes;
  },
};

export { Mutation as default };
