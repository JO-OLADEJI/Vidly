const { User, userSchema } = require('../../../models/user.js');
const jwt = require('jsonwebtoken');
require('dotenv/config.js');


describe('user', () => {
  it('should generate a mock json web token for the user object', () => {
    userSchema.methods.genAuthToken = jest.fn().mockReturnValue('...');

    const user = new User({
      'name': 'abc xyz',
      'email': 'abc@example.com',
      'password': '0123456789'
    });

    const token = user.genAuthToken();
    expect(token).toMatch(/.../);
  });

  it('should generate a real json web token for the user object', () => {
    const user = new User({
      'name': 'abc xyz',
      'email': 'abc@example.com',
      'password': '0123456789'
    });
    
    const token = user.genAuthToken();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    expect(payload['_id']).toMatch(user['_id'].toHexString());
  });
});