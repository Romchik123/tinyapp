const bodyParser = require("body-parser");

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const helperGetUserByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

const generateRandomString = function () {
  const arr = ["d87s8d", "df923j", "345gfg", "345gdf", "567ytr", "34fdsf"];

  let randomNum = Math.random() * 6;
  let roundNumber = Math.floor(randomNum);

  switch (roundNumber) {
  case 0:
    return arr[0];
  case 1:
    return arr[1];
  case 2:
    return arr[2];
  case 3:
    return arr[3];
  case 4:
    return arr[4];
  case 5:
    return arr[5];

  default:
    break;
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user };

  if (user === undefined) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  let newShortUrl = generateRandomString();

  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;

  urlDatabase[shortURL] = { longURL: newLongURL, userID: newShortUrl };
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const body = req.body;

  if (body.email === "") {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  if (body.password === "") {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  const user = helperGetUserByEmail(body.email);

  if (!user) {
    return res.status(403).send("<h1>Email doesn't correct</h1>");
  }

  if (user.password !== body.password) {
    return res.status(403).send("<h1>Password doesn't correct</h1>");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.id);

  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let newUserId = generateRandomString();

  const newUser = {
    id: newUserId,
    email: req.body.email,
    password: req.body.password,
  };

  if (newUser.email === "") {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  if (newUser.password === "") {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  if (helperGetUserByEmail(newUser.email)) {
    return res
      .status(400)
      .send("<h1>Email exists already! 400 status code</h1>");
  }

  users[newUserId] = newUser;
  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
