const {
  NODE_ENV,
  SECRET,
  MONGODB_URL,
  PORT
} = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = {
  secret: isProduction ? SECRET : 'secret',
  mongodb: isProduction ? MONGODB_URL : 'mongodb://localhost/testdb',
  port: isProduction ? PORT : 8000,
  isProduction
};
