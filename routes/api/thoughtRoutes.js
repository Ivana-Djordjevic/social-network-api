const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReactionToThought,
  deleteReactionFromThought
} = require('../../controllers/thoughtController.js');

// /api/thoughts
router.route('/')
  .get(getThoughts) // works
  .post(createThought); //works partially

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(getSingleThought) //works
  .put(updateThought) //works
  .delete(deleteThought); //works

//api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
  .post(createReactionToThought) // DOES NOT work
  .delete(deleteReactionFromThought); //cannot test because cannot POST
  // it says Thought validation failed

module.exports = router;
