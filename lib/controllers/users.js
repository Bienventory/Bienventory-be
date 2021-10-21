const { Router } = require('express');
const User = require('../models/Users.js');

// None of these routes are protected, meaning anyone could
// update or delete a user by hitting the route directly.
// Make sure to add authentication to routes that require it.
module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const newUser = await User.insert(req.body);
      res.send(newUser);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.getById(id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedUser = await User.updateById(id, req.body);
      res.send(updatedUser);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.send({
        message: 'user deleted'
      });
    } catch (error) {
      next(error);
    }
  });
