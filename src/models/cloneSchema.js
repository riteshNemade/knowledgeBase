const mongoose = require('mongoose');

const cloneSchema = new mongoose.Schema({
  parentId:{
   type:  mongoose.Schema.Types.ObjectId,
   ref: 'Content' 
  },
  content: {
    type: Object
  },
});



const Clone = mongoose.model('Clone', cloneSchema);

module.exports = Clone;
