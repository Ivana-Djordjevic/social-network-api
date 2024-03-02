const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find({})
        .populate('friends')
        .populate('thoughts');
      
      if (!users) {
        return res.status(404).json({ message: 'No users found' });
      }
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne(
        { _id: req.params.userId }
      )
        .populate('friends')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }

      res.json({ user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  //update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true}
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  // Delete a user 
  async deleteUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId})

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No such user exists' });
      }

      await Thought.deleteMany({ username: user.username})
      await user.deleteOne()

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  // Remove friend from a user
  async removeFriend(req, res) {
    console.log('you are removing a friend')
    console.log(req.params.friendId)

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
};
