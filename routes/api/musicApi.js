const express = require('express');
const router = express.Router();
const musicApiController = require('../../controller/api/musicApiController');

router.get('/', musicApiController.getMusic);
router.post('/', musicApiController.addMusic);
router.post('/data', musicApiController.getMusicById);
router.delete('/', musicApiController.deleteMusicById);

module.exports = router;
