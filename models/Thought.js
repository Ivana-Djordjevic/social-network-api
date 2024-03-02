const { Schema, model } = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: new ObjectId()
    },
    reactionBody: {
      type: String, 
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
      get: function (timestamp) {
        return new Date(timestamp).toLocaleString()
      }
    }

  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String, 
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createAt: {
      type: Date,
      default: Date.now,
      get: function (timestamp) {
        return new Date(timestamp).toLocaleString()
      }
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
