
const mongoose = require('mongoose')

const Post = require('../models/Post')

async function posts(parent, args) {
	const postDocs = await Post.find({userId: new mongoose.Types.ObjectId(parent.id)})
	const posts = []

	for(const doc in postDocs) {
		posts.push({
			id: doc.id,
			userId: String(doc.userId),
			title: doc.title,
			content: doc.content
		})
	}

	return posts
}

module.exports = {
	posts
}
