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
    const exec = async () => {
      return await request(server).get('/api/genres');
    }

    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { value: 'genre-a' },
        { value: 'genre-b' },
        { value: 'genre-c' }
      ]);
      
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((genre) => genre['value'] === 'genre-a')).toBeTruthy();
    });

  });


  describe('GET /:id', () => {
    let genreId;
    beforeEach(() => {
      genreId = mongoose.Types.ObjectId();
    });
    const exec = async () => {
      return await request(server).get('/api/genres/' + genreId);
    }

    it('should return the genre with the given ID', async () => {
      const genre = new Genre({ value: 'genre-a' });
      await genre.save();
      genreId = genre['_id'];

      const res = await exec();

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body['_id'].toString()).toEqual(genreId.toHexString());
      expect(res.body['value']).toBe('genre-a');
    });

    it('should return an error with status-code 404 if genre with gien ID is not found', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return an error with status-code 500 if given ID is not valid', async () => {
      genreId = '123';
      const res = await exec();
      expect(res.status).toBe(500);
    });

  });


  describe('POST /', () => {
    let genreObj;
    beforeEach(() => {
      genreObj = { value: 'genre-a' };
    });
    const exec = async () => {
      return await request(server).post('/api/genres').send(genreObj);
    }

    it('should create a new genre if given input is valid', async () => {
      const res = await exec();

      expect(res.body).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('value', genreObj['value']);
    });

    it('should return an error with status-code 400 if input is invalid', async () => {
      genreObj = { value: 'xy' };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with status-code 400 if genre value with given input already exists', async () => {
      await exec();
      const res = await exec();
      expect(res.status).toBe(400);
    });

  });


  describe('PUT /:id', () => {
    let genreId;
    let genreEdit;
    let genre;
    beforeEach(async () => {
      genre = new Genre({ value: 'genre-a' });
      await genre.save();
      genreId = genre['_id'];
      genreEdit = { value: 'genre-x' };
    });
    const exec = async () => {
      return await request(server).put('/api/genres/' + genreId).send(genreEdit);
    }
    
    it('should update a given genre if a valid ID and valid genre is passed', async () => {
      const res = await exec();

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.body['_id']).toBe(genreId.toHexString());
      expect(res.body).toHaveProperty('value', genreEdit.value);
    });

    it('should return an error with a status-code of 400 if a valid ID and invalid genre is passed', async () => {
      genreEdit = { value: 'xy' };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with a status-code of 400 if an invalid ID and valid genre is passed', async () => {
      genreId = '123';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return an error with a status-code of 400 if an invalid ID and invalid genre is passed', async () => {
      genreId = '123';
      genreEdit = { value: 'xy' };

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should create a new genre if a valid ID that is not in the genre document and a valid genre is passed', async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(200);
    });

  });


  describe('DELETE /:id', () => {
    let genreId;
    beforeEach(() => {
      genreId = mongoose.Types.ObjectId();
    });
    const exec = async () => {
      return await request(server).delete('/api/genres/' + genreId);
    }

    it('should delete a genre from db if valid ID is given', async () => {
      const genre = new Genre({ value: 'genre-a' });
      await genre.save();
      genreId = genre['_id'];

      const res = await exec();

      expect(res.body).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.body['_id'].toString()).toEqual(genreId.toHexString());
      expect(res.body['value']).toEqual(genre['value']);
    });

    it('should return an error with status-code 500 if invalid ID is given', async () => {
      genreId = '123';
      const res = await exec();
      expect(res.status).toBe(500);
    });

    it('should return an error with status-code 404 if the given ID is valid but not found', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

  });

});