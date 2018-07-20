const router = require('koa-router')();
const profileController = require('../controllers/profile');

router.get('/:id', profileController.profile);
router.get('/:id/*', profileController.profile);

module.exports = router;
