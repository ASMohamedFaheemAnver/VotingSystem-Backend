import Member from "../model/member";

const Mutation = {
  createMember: async (
    parent,
    { data: { name, secret, year } },
    ctx,
    info
  ) => {},
};

export { Mutation as default };
