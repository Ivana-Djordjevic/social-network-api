const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// /api/users
router.route('/')
  .get(getUsers) // works
  // TypeError: Cannot read properties of undefined (reading 'length')
  .post(createUser); // works

// /api/users/:userId
router.route('/:userId')
  .get(getSingleUser) // works
  .put(updateUser) // works
  .delete(deleteUser); // works 

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId')
  .post(addFriend) // works 
  .delete(removeFriend); // does not work
  //is not being process at all, even the console log 'you are removing a friend is not showing"

module.exports = router;
