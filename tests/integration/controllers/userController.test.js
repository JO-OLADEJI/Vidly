let server;
const request = require('supertest');
const { User } = require('../../../models/user.js');
const bcrypt = require('bcrypt');
require('dotenv').config();


describe('/api/users', () => {
  beforeEach(() => server = require('../../../server.js'));
  afterEach(async () => {
    server.close();
    await User.deleteMany({}); // clear the user document
  });


  describe('POST /', () => {
    let user;
    beforeEach(() => {
      user = { name: 'abc xyz', email: 'abc@example.com', password: 'abc-123' };
    });
    const exec = async () => {
      return await request(server).post('/api/users').send(user);
    }

    it('should create and auth a new user if request body is valid and email does not exist before', async () => {
      const res = await exec();

      const passwordMatch = await bcrypt.compare(user.password, res.body.password);

      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(typeof res.body).toBe('object');
      expect(passwordMatch).toBeTruthy();
      expect(res.header['x-auth-token']).toBeDefined();
    });

    it('should return an error with status-code 400 if any key in request body is invalid', async () => {
      user.name = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with a status-code 400 if email already exists as a user', async () => {
      await exec();
      const res = await exec();
      expect(res.status).toBe(400);
    });

  });


  describe('POST /login', () => {
    let loginCredentials;
    beforeEach(async () => {
      // register a new user
      await request(server).post('/api/users').send({ 
        name: 'abc xyz', 
        email: 'abc@example.com', 
        password: 'abcd-1234-wxyz' 
      });
      loginCredentials = { email: 'abc@example.com', password: 'abcd-1234-wxyz' };
    });
    const exec = async () => {
      return await request(server).post('/api/users/login').send(loginCredentials);
    }

    it('should authenticate and send a user object if login credentials is correct', async () => {
      const res = await exec();

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.header['x-auth-token']).toBeDefined();
      expect(res.body['email']).toBe(loginCredentials['email']);
    });

    it('should return an error with a status-code 400 if email is invalid', async () => {
      loginCredentials.email = 'xyz@example.com';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with a status-code 400 if password is invalid', async () => {
      loginCredentials.password = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with a status-code of 400 if password for a given email does not match the hashed password', async () => {
      loginCredentials.password = new Array(11).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

  });

  
  describe('GET /me', () => {
    let userObj;
    let token;
    beforeEach(async () => {
      userObj = { name: 'abc xyz', email: 'abc@example.com', password: 'abcd-1234-wxyz' };
      await request(server).post('/api/users/').send(userObj);
    });
    const exec = async () => {
      return await request(server).get('/api/users/me').set('x-auth-token', token);
    }

    it('should return the user with the ID encoded in the payload if token is valid', async () => {
      const user = await User.findOne({ email: userObj['email'] });
      token = user.genAuthToken();

      const res = await exec();

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.body['_id']).toBe(user['_id'].toHexString());
    });

    it('should return an error with status-code 400 if no token is provided', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with status-code 401 if token is invalid', async () => {
      token = 'abc-xyz';
      const res = await exec();
      expect(res.status).toBe(401);
    });

  });

});