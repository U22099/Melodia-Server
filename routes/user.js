const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getData);
router.get('/admin', userController.getAdminData);
router.put('/', userController.updateData);
router.delete('/', userController.deleteUser);

module.exports = router;
