
const Post = require('../models/Post')
const User = require('../models/User')


async function user(_, args) {
	const userDoc = await User.findById(args.id, 'username')
	
	if(!userDoc) {
		throw new Error(`No user found with id '${args.id}'`)
	}

	const user = {
		id: userDoc.id,
		username: userDoc.username
	}
	return user
}

async function users() {
	const documents = await User.find({}, 'username')
	const users = []

	documents.forEach(el => {
		users.push({
			id: el.id,
			username: el.username
		})
	})

	return users
}


async function post(_, args) {
	const postDoc = await Post.findById(args.id)

	if(!postDoc) {
		throw new Error(`Post with id '${args.id}' was not found.`)
	}

	const post = {
		id: 		postDoc.id,
		userId:		String(postDoc.userId),
		title: 		postDoc.title,
		content:	postDoc.content
	}
	return post
}

async function posts() {
	const postDocs = await Post.find()
	const posts = []

	postDocs.forEach(doc => {
		posts.push({
			id: 		doc.id,
			userId:		String(doc.userId),
			title: 		doc.title,
			content:	doc.content
		})
	})

	return posts
}


async function feed(_, args) {
	const titleFilter = {}
	args.filter && (titleFilter.title = {$regex: args.filter, $options: 'i'});

	const contentFilter = {}
	args.filter && (contentFilter.content = {$regex: args.filter, $options: 'i'});

	const options = {}
	args.skip && (options.skip = args.skip);
	args.take && (options.limit = args.take);

	return await Post.find({$or: [titleFilter, contentFilter]}, '', options)
}

module.exports = {
	user,
	users,
	post,
	posts,
	feed
}
