import jwt from "jsonwebtoken";

const getUserData = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decodedData = jwt.verify(token, process.env.secret_word);
    return decodedData;
  }

  if (requireAuth) {
    throw new Error("authentication required");
  }

  return null;
};

export { getUserData as default };
