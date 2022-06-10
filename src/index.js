const fs = require('fs')
const path = require('path')

const {connectToMongo} = require('./config/mongoConfig')
const {ApolloServer} = require('apollo-server')

const Query			= require('./resolvers/Query')
const Mutation		= require('./resolvers/Mutation')
const Subscription	= require('./resolvers/Subscription')
const User			= require('./resolvers/User')
const Post			= require('./resolvers/Post')

connectToMongo();

const server = new ApolloServer({
	typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
	resolvers: {
		Query,
		Mutation,
		Subscription,
		User,
		Post
	},
	csrfPrevention: true,
})

server.listen()
	.then(({url}) => {
		console.log(`Server running at ${url}`)
	})
