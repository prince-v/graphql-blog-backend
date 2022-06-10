
const mongoose = require('mongoose')
const mongoUri = 'mongodb://localhost:27017/graphql-blog'

function connectToMongo() {
	mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	
	const mongoConnection = mongoose.connection
	
	mongoConnection.on('error', () => {
		throw new Error('Failed to connect to MongoDB')
	})
	mongoConnection.once('open', () => {
		console.log('Mongodb connected')
	})
}

module.exports = {
	connectToMongo
}
