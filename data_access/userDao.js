const { CustomError } = require('../middlewares/ErrorHandler');
const User = require('../models/User');

class UserDAO {
    static findOne = async (query) => {
        try {
            const user = await User.findOne(query);
            if (user) {
                return user.toJSON()
            } else {
                throw new CustomError(404, 'user not found')
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserDAO;
