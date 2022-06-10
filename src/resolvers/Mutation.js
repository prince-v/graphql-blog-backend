
const User = require('../models/User')
const Post = require('../models/Post')
const mongoose = require('mongoose')


async function createUser(parent, args) {
	const user = new User({...args})
	await user.save()
	return {id: user.id, username: user.username}
}

async function updateUser(parent, args) {
	const data = {};
	args.username && (data.username = args.username);
	args.password && (data.password = args.password);

	const doc = await User.findByIdAndUpdate(args.id, {$set: data}, {new: true})

	if(!doc) {
		throw new Error(`User with id '${args.id}' was not found.`)
	}
	return { id: doc.id, username: doc.username}
}

async function deleteUser(parent, args) {
	const doc = await User.findByIdAndDelete(args.id)
	if(!doc) {
		throw new Error(`User with id '${args.id}' was not found.`)
	}

	const postDocs = await Post.find({userId: doc._id})

	postDocs.forEach(async (postDoc) => {
		await postDoc.remove()
	})

	return `Deleted ${doc.id}`
}


async function createPost(parent, args, context) {
	const userId = args.userId
	const userDoc = await User.findById(args.userId)

	if(!userDoc) {
		throw new Error(`User with id '${userId}' was not found.`)
	}

	const doc = new Post({
		userId: userDoc._id,
		title: args.title,
		content: args.content
	})
	await doc.save()

	const newPost = {
		id: doc.id,
		title: doc.title,
		content: doc.content
	}
	return newPost
}

async function updatePost(parent, args) {
	const dataToSet = {}
	args.title && (dataToSet.title = args.title);
	args.content && (dataToSet.content = args.content);

	const postDoc = await Post.findById(args.id)

	if(!postDoc) {
		throw new Error(`Post with id '${args.id}' was not found.`)
	}

	const dataToPush = {}

	if(args.likedBy) {
		const userId = args.likedBy
		if(!mongoose.isValidObjectId(userId)) {
			throw new Error(`updateUser.likedBy '${userId}' is not a valid ID!`)
		}
		
		const userDoc = await User.findById(userId)
		if(!userDoc) {
			throw new Error(`updateUser.likedBy '${userId}' is not a valid user ID!`)
		}
		
		if(userDoc.id === String(postDoc.userId)) {
			throw new Error(`You Cannot like your own post!`)
		}

		if(!postDoc.likes.includes(userDoc._id)) {
			dataToPush.likes = userDoc._id
		}
		else {
			console.log(`Already liked!`)
		}
	}

	if(args.comment) {
		const userId = args.comment.userId
		if(!mongoose.isValidObjectId(userId)) {
			throw new Error(`comment.userId '${userId}' is not a valid ID!`)
		}
		
		const userDoc = await User.findById(userId)
		if(!userDoc) {
			throw new Error(`comment.userId '${userId}' is not a valid user ID!`)
		}
		dataToPush.comments = {
			userId: userDoc._id,
			content: args.comment.content
		}
	}

	const doc = await Post.findByIdAndUpdate(args.id, {
		$set: dataToSet,
		$push: dataToPush
	}, {new: true})

	return {id: doc.id, title: doc.title, content: doc.content}
}

async function deletePost(parent, args) {
	const doc = await Post.findByIdAndDelete(args.id)

	if(!doc) {
		throw new Error(`Post with id '${args.id}' was not found.`)
	}

	return `Deleted post ${doc.id}`
}

module.exports = {
	createUser,
	updateUser,
	deleteUser,
	createPost,
	updatePost,
	deletePost
}
