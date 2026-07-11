class AuthService {
  async registerUser(data) {
    return { success: true, data };
  }

  async loginUser(data) {
    return { success: true, data };
  }
}

module.exports = new AuthService();
