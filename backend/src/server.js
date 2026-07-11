const app = require('./app');
const { connectDB } = require('./config/database');
const env = require('./config/env');

connectDB();

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
