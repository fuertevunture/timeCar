const userRepository = require('../repositories/userRepository');

class UserService {
  async getAllUsers() {
    try {
      return await userRepository.getAllUsers();
    } catch (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const user = await userRepository.getUserById(id);
      if (!user) {
        throw new Error('用户不存在');
      }
      return user;
    } catch (error) {
      throw new Error(`获取用户失败: ${error.message}`);
    }
  }

  async checkUserExist(userInfo) {
      try {
          const user = await userRepository.checkUserExist(userInfo);
          console.log("完成查询",user)
          const result = {
              user: user,
              exists: user ? true : false,
          }
          return result;
      }catch(error) {
          throw Error('检查用户失败')
      }
  }
}

module.exports = new UserService();