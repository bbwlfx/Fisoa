const router = require('koa-router')();
const editorController = require('../controllers/editor');

router.get('/article', editorController.index);

module.exports = router;
