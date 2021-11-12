// Require Section ::
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const { helperGetUserByEmail } = require("./helpers");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");



// Setup Section ::
const app = express();
const PORT = 8080; // default port 8080



// Use it Section ::
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



///////////////////////////////////////////////////////////////////
// All the DB Section ::
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



///////////////////////////////////////////////////////////////////
// Functions Section ::
const urlsForUser = (id) => {
  let urlPair = {};
  for (const [key, value] of Object.entries(urlDatabase)) {
    if (id === value.userID) {
      urlPair[key] = value.longURL;
    }
  }
  return urlPair;
};

const generateRandomString = function() {
  const arr = [
    "d87s8d",
    "df923j",
    "345gfg",
    "345gdf",
    "567ytr",
    "34fdsf",
    "34dfsf",
    "34fknd",
    "34sskf",
    "34f32f",
    "3dfdsf",
    "34fsds",
    "34fdsf",
    "3d234f",
    "34f5sf",
    "df3fds",
    "sd3dsf",
    "756hsf",
    "sdf345",
    "344fds",
  ];

  let randomNum = Math.random() * 20;
  let roundNumber = Math.floor(randomNum);

  return arr[roundNumber];
};



///////////////////////////////////////////////////////////////////
// All my Routes Section ::
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



// Urls ::
app.get("/urls", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];
  const templateVars = { urls: urlsForUser(userId), user };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {
    longURL: req.body.longURL,
    userID: req.session.id,
  };

  res.redirect(`/urls/${newShortUrl}`);
});



// New URLs ::
app.get("/urls/new", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];
  const templateVars = { user };

  if (user === undefined) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});



// Generate a ShortURLs ::
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.id;
  const user = users[userId];

  if (!userId) {
    return res.redirect("/login");
  }

  const urlsBelongsToUsers = urlDatabase[req.params.shortURL].userID === userId;

  if (!urlsBelongsToUsers) {
    return res.send("This URL doesn't belong to you!");
  }

  const templateVars = {
    shortURL: req.params.shortURL,

    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user,
  };

  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;

  urlDatabase[shortURL] = {
    longURL: newLongURL,
    userID: req.session.id,
  };
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});



// Login ::
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

  const user = helperGetUserByEmail(body.email, users);

  if (!user) {
    return res.status(403).send("<h1>Email doesn't correct</h1>");
  }

  if (!bcrypt.compareSync(body.password, user.password)) {
    return res.status(403).send("<h1>Password is incorrect</h1>");
  }
  req.session.id = user.id;
  res.redirect("/urls");
});



// LogOut ::
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/urls");
});



// Register ::
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let newUserId = generateRandomString();

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const newUser = {
    id: newUserId,
    email: req.body.email,
    password: hashedPassword,
  };

  if (newUser.email === "") {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  if (bcrypt.compareSync("", newUser.password)) {
    return res.status(400).send("<h1>Please try again</h1>");
  }

  if (helperGetUserByEmail(newUser.email, users)) {
    return res
      .status(400)
      .send("<h1>Email exists already! 400 status code</h1>");
  }

  users[newUserId] = newUser;

  res.redirect("/login");
});



// Port ::
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
