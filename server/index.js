const { ApolloServer,PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

// mongoose connect
mongoose.connect(MONGODB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
        .then(()=>{
            console.log('MogoDB connect');
            // GraphQl
            return server.listen({port:5000})
        })
        .then((res)=>{
            console.log(`Server running at ${res.url}`);
        })