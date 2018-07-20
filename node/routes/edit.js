const router = require('koa-router')();
const editController = require('../controllers/edit');

router.get('/:aid', editController.index);

module.exports = router;
