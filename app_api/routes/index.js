const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require ('express-jwt');

//Set authToken to authenticate
const authToken = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  algorithms: ["HS256"],
});

const authController = require('../controllers/authContoller');
const listController = require('../controllers/listController');

//login route
router
  .route('/login')
  .post(authController.login);

//register route
router
  .route('/register')
  .post(authController.register);

  //list home route
router
  .route('/list-home')
  .get(authToken, listController.getUserList);

//items route (add item)
router
  .route('/items')
  .post(authToken, listController.addItem)

//items for existing item route (delete and search)
router
  .route('/items/:itemName')
  .delete(authToken, listController.deleteItem)
  .get(authToken, listController.searchItem)

//items route to update status
router
  .route('/items/:status')
  .put(authToken, listController.updateStatus);

//edit item route
router
  .route('/edit-item')
  .put(authToken, listController.updateItem);



module.exports = router;
