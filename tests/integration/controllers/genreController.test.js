let server;
const request = require('supertest');
const Genre = require('../../../models/genre.js');
const mongoose = require('mongoose');

describe('/api/genres', () => {
  beforeEach(() => server = require('../../../server.js'));
  afterEach(async () => {
    server.close();
    await Genre.remove({}); // clear the genre document
  });


  describe('GET /', () => {

    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { value: 'genre-a' },
        { value: 'genre-b' },
        { value: 'genre-c' }
      ]);
      
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((genre) => genre['value'] === 'genre-a')).toBeTruthy();
    });

  });


  describe('GET /:id', () => {

    it('should return the genre with the given ID', async () => {
      const genre = new Genre({ value: 'genre-a' });
      await genre.save();
      const genreId = genre['_id'];

      const res = await request(server).get('/api/genres/' + genreId);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body['_id'].toString()).toEqual(genreId.toHexString());
      expect(res.body['value']).toBe('genre-a');
    });

    it('should return an error with status-code 404 if genre with gien ID is not found', async () => {
      const randomId = mongoose.Types.ObjectId();

      const res = await request(server).get('/api/genres/' + randomId);
      expect(res.status).toBe(404);
    });

    it('should return an error with status-code 500 if given ID is not valid', async () => {
      const fakeId = '123';

      const res = await request(server).get('/api/genres/' + fakeId);
      expect(res.status).toBe(500);
    });

  });

});