//join , leave , get etc

const users = [];

//join user to chat
function joinUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//user leaves chat
function userLeaves(id) {
  const index = users.findIndex((user) => user.id == id);
  if (index != -1) {
    console.log(users);
    return users.splice(index, 1)[0]; // remove '1' element from index 'index'
  }
}

// get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room == room);
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
};
