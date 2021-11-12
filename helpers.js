
const helperGetUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};


module.exports = { helperGetUserByEmail };