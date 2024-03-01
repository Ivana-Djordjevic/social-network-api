const { Thought } = require('../models');

module.exports = {
  // Get all thought
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne(
        { _id: req.params.thoughtId }
      )
        .populate('reactions');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId }
      );

      if (!thought) {
        res.status(404).json({ message: 'No  with that ID' });
      }

      await Reaction.deleteMany({ _id: { $in: thought.reactions } });
      res.json({ message: 'Thought and reactions deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create reaction 
  async createReactionToThought(req, res) {
    const { reactionBody, username } = req.body;
  
    try {
      const thought = await Thought.findOne(
        { _id: req.params.thoughtId}
      );
  
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
  
      thought.reactions.push({ reactionBody, username });
  
      const updatedThought = await thought.save();
  
      if (updatedThought) {
        return res.status(200).json(
          { message: 'Reaction added successfully',
           thought: updatedThought }
        );
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'reaction not added' });
    }
  },
  // delete reaction 
  async deleteReactionFromThought(req, res) {
    const { thoughtId, reactionId } = req.params;
  
    try {
      const thought = await Thought.findOne(thoughtId);
  
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      const reactionIndex = thought.reactions.findIndex(
        reaction => reaction._id.toString() === reactionId
      );
  
      if (reactionIndex === -1) {
        return res.status(404).json({ error: 'Reaction not found' });
      }
  
      thought.reactions.splice(reactionIndex, 1);
  
      const updatedThought = await thought.save();
  
      return res.status(200).json({ message: 'Reaction deleted successfully', thought: updatedThought });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'error deleting reaction' });
    }
  }
};

