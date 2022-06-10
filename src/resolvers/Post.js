
const User = require('../models/User')
const Post = require('../models/Post')

async function user(parent, args) {
	const postId = parent.id
	const postDoc = await Post.findById(postId)

	if(!postDoc) {
		throw new Error(`Post with id ${postId} was not found.`)
	}

	const userDoc = await User.findById(postDoc.userId)

	if(!userDoc) {
		throw new Error(`User with id ${postDoc.userId} was not found.`)
	}
	
	return {id: userDoc.id, username: userDoc.username}
}

async function likes(parent, args) {
	const postId = parent.id
	const postDoc = await Post.findById(postId)

	if(!postDoc) {
		throw new Error(`Post with id ${postId} was not found.`)
	}

	const likes = postDoc.likes
		? postDoc.likes.length
		: 0
	
	return likes
}

async function comments(parent, args) {
	const postId = parent.id
	const postDoc = await Post.findById(postId)

	if(!postDoc) {
		throw new Error(`Post with id ${postId} was not found.`)
	}

	const postComments = []

	for(const comment of postDoc.comments) {
		const userDoc = await User.findById(comment.userId)

		if(!userDoc) {
			throw new Error(`User '${comment.userId}' was not found.`)
		}

		postComments.push({
			user: {
				id: userDoc.id,
				username: userDoc.username
			},
			content: comment.content			
		})
	}

	return postComments
}


module.exports = {
	user,
	likes,
	comments
}
