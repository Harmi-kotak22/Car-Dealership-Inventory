class AuthRepository {
  async createUser(userData) {
    return userData;
  }

  async findByEmail(email) {
    return null;
  }
}

module.exports = new AuthRepository();
