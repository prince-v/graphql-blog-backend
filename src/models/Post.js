
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	}],
	comments: [{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		content: {
			type: String,
			required: true
		},
		timestamp: {
			type: Date,
			default: Date.now()
		}
	}]
})

const Post = mongoose.model("Post", PostSchema)
module.exports = Post
