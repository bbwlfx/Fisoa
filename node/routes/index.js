const router = require('koa-router')();
const indexController = require('../controllers/index');

router.get('/', indexController.index);

module.exports = router;
