const mongoose = require('mongoose');

const comment = new mongoose.Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	comment: {
		type: String,
		required: true,
	},
	comments: {
		type: [this.comment],
		required: false,
		default: [],
	},
});

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	post: {
		type: String,
		required: false,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	comment: {
		type: [comment],
		default: [],
	},
	vote:{
		type: Number,
		default: 0,
	}
});


const Post = mongoose.model('Post', postSchema);

module.export = Post