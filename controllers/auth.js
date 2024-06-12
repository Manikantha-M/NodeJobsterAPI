const {StatusCodes} = require('http-status-codes');
const UserModel = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req, res) => {
    const user = await UserModel.create(req.body);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({token, user:{email:user.email, lastName:user.lastName, location:user.location, name:user.getName()}});
}
const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide valid credentials');
    }
    const user = await UserModel.findOne({email});

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials');
    }

    // compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials');

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({token, user:{email:user.email, lastName:user.lastName, location:user.location, name:user.getName()}})

}
const updateUser = async (req, res) => {
    const {email, name, lastName, location}  = req.body;
    if(!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values');
    }
    const user = await UserModel.findOne({_id: req.user.userId });
    user.email = email,
    user.name = name;
    user.lastName = lastName;
    user.location = location;
    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({token, user:{email:user.email, lastName:user.lastName, location:user.location, name:user.getName()}});
}
module.exports = {register, login, updateUser}