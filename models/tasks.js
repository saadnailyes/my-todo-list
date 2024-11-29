const mongoose = require('mongoose');

// Define Task Schema
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Export Task Model
module.exports = mongoose.model('Task', taskSchema);
