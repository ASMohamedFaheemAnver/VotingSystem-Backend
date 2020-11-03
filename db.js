// Demo user data
let users = [
  {
    id: "1",
    name: "freedom",
    email: "jstrfaheem065@gmail.com",
    age: 23,
  },
  {
    id: "12",
    name: "freedom2",
    email: "jstrfaheem065@gmail.com",
    age: 23,
  },
  {
    id: "13",
    name: "freedom3",
    email: "jstrfaheem065@gmail.com",
    age: 23,
  },
];

// Demo user data
let posts = [
  {
    id: "1",
    title: "intro",
    body: "",
    published: true,
    author: "1",
  },
  {
    id: "12",
    title: "intro2",
    body: "",
    published: true,
    author: "12",
  },
  {
    id: "13",
    title: "intro4",
    body: "",
    published: true,
    author: "13",
  },
];

// Demo comments
let comments = [
  {
    id: "1",
    text: "comment1",
    author: "1",
    post: "1",
  },
  {
    id: "12",
    text: "comment12",
    author: "12",
    post: "1",
  },
  {
    id: "13",
    text: "comment13",
    author: "13",
    post: "1",
  },
];

const db = {
  users,
  comments,
  posts,
};

export { db as default };
