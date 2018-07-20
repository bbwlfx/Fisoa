const router = require('koa-router')();
const storyController = require('../controllers/story');

router.get('/article/:id', storyController.story);
router.get('/question/:id', storyController.question);
router.get('/preview/:id', storyController.preview);

module.exports = router;
