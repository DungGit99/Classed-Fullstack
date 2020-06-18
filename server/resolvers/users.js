const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {SECRET_KEY}= require('../config');
const {UserInputError} = require('apollo-server');

const {validateRegisterInput,validateLoginInput} = require('../util/validators');

// generate token
const generateToken= (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
  }

module.exports = {
    Mutation: {
        // login
        async login(parent,{username,password}){

            // validate username & password
            const { errors,valid }=validateLoginInput(username,password);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User do not found';
                throw new UserInputError('User do not found',{errors});
            }

            // compare password hash
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials',{errors});
            }

            // create token
            const token = generateToken(user);

            return{
                ...user._doc, // note
                id: user.id,
                token
            };
        },
        // register
        async register(parent,{registerInput:{username,email,password,confirmPassword}}){

            // validate user data
            const {valid,errors}=validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Errors',{errors})
            }

            // check user already exist
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken',{
                    errors:{
                        username: 'This username is taken'
                    }
                })
            }

            // hash password
            password = await bcrypt.hash(password,12);
            // create new user
            const newUser = new User({
                email,
                username,
                password,
                createAt: new Date().toISOString()
            });
            const res = await newUser.save();

            // create an auth token
            const token = generateToken(res);

            return{
                ...res._doc, // note
                id: res.id,
                token
            };
        }
    }
}