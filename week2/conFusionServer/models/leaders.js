const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadersSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: true
  }
},
  {

    timestamps: true
  });

var Leaders = mongoose.model('Leader', leadersSchema);

module.exports = Leaders;
