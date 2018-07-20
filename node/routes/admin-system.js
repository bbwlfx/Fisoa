const router = require('koa-router')();
const adminController = require('../controllers/admin-system.js');

router.get('*', adminController.index);

module.exports = router;
