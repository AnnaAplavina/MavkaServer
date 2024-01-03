const User = require('./../data-access/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getUser(username) {
    const res = await this.getUserPrivateInfo(username);
    delete res.email;
    return res;
  }

  async getUserPrivateInfo(username) {
    let readUserRes;
    try {
      readUserRes = await User.readUser(username);
    } catch (exc) {
      console.log(exc);
      throw new Error('server error');
    }
    if (readUserRes.rows.length == 0) {
      throw new Error(`user with username ${username} does not exist`);
    } else {
      return {
        username: readUserRes.rows[0].username,
        email: readUserRes.rows[0].email,
        first_name: readUserRes.rows[0].first_name,
        last_name: readUserRes.rows[0].last_name,
        wall_id: readUserRes.rows[0].wall_id,
        avatar_url: readUserRes.rows[0].avatar_url,
      };
    }
  }

  async updateUser(newData) {
    try {
      const queryRes = await User.updateUser(
        newData.username,
        newData.new_email,
        newData.new_pass,
        newData.new_first_name,
        newData.new_last_name,
        newData.new_avatar
      );
      if (queryRes.rowCount == 0) {
        throw new Error(`user does not exist`);
      }
    } catch (exc) {
      if (exc.constraint == 'users_email_key') {
        throw new Error('this email is already used');
      } else {
        console.log(exc);
        throw new Error('server error');
      }
    }
  }
}

module.exports = new UserService();
