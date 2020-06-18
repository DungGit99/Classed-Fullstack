const jwt = require('jsonwebtoken');
const {SECRET_KEY} =require('../config');
const { AuthenticationError } = require('apollo-server');
module.exports = (context)=>{

    const {authorization} = context.req.headers;

    if(authorization){
        const token= authorization.split('Bearer ')[1];

        if(token){
            try {
                const user = jwt.verify(token,SECRET_KEY);
                return user ;
            } catch (error) {
                throw new AuthenticationError('Invalid token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')

    }

    throw new Error('Authentication header must be provided');
}