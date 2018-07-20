const router = require('koa-router')();
const userSpaceController = require('../controllers/userspace');

router.get('*', userSpaceController.userspace);

module.exports = router;
