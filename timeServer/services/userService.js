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

  async createUser(name, email) {
    try {
      if (!name || !email) {
        throw new Error('姓名和邮箱不能为空');
      }
      const userId = await userRepository.createUser(name, email);
      return { id: userId, name, email };
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  async updateUser(id, name, email) {
    try {
      if (!name || !email) {
        throw new Error('姓名和邮箱不能为空');
      }
      const success = await userRepository.updateUser(id, name, email);
      if (!success) {
        throw new Error('用户不存在');
      }
      return { id, name, email };
    } catch (error) {
      throw new Error(`更新用户失败: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const success = await userRepository.deleteUser(id);
      if (!success) {
        throw new Error('用户不存在');
      }
      return { message: '用户删除成功' };
    } catch (error) {
      throw new Error(`删除用户失败: ${error.message}`);
    }
  }
}

module.exports = new UserService();