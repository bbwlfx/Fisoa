const router = require('koa-router')();
const settingController = require('../controllers/setting');

router.get('/setting', settingController.setting);

module.exports = router;
