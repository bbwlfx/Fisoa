const router = require('koa-router')();
const userController = require('../controllers/api/user');
const articleController = require('../controllers/api/article');
const questionController = require('../controllers/api/question');
const feedController = require('../controllers/api/feed');
const feedbackController = require('../controllers/api/feedback');
const uploadController = require('../controllers/api/upload');
const userspaceController = require('../controllers/api/userspace');
const messageController = require('../controllers/api/message');

// /api
router.get('/user/has_exist', userController.userHasExist);
router.post('/user/login', userController.userLogin);
router.get('/user/detail', userController.getUserDetail);
router.post('/user/register', userController.handleUserRegister);
router.get('/user/judgment', userController.ifUserLogin);
router.post('/user/update_info', userController.updateInfo);
router.post('/user/change_password', userController.changePassword);
router.post('/user/exit', userController.userExit);
router.get('/user/info', userController.getUserInfo);
router.post('/forget_password', userController.forgetPassword);
router.get('/get_dynamic_content', userController.getDynamicContent);

// question api
router.post('/post_question', questionController.postQuestion);
router.get('/get_question', questionController.getQuestion);
router.get('/get_answer', questionController.getAnswerList);
router.post('/post_answer', questionController.postAnswer);
router.post('/post_answer_support', questionController.postAnswerSupport);
router.post('/delete_question', questionController.deleteQuestion);

// article api
router.get('/view_article', articleController.viewArticle);
router.post('/post_article', articleController.postArticle);
router.get('/get_article', articleController.getArticle);
router.get('/delete_article', articleController.deleteArticle);
router.post('/post_article_comment', articleController.postArticleComment);
router.get('/get_article_comment', articleController.getArticleComment);
router.post('/post_article_support', articleController.postArticleSupport);
router.post('/post_article_comment_support', articleController.postArticleCommentSupport);
router.post('/post_collect_article', articleController.postCollectArticle);
router.get('/get_article_rank', articleController.getArticleRank);
router.get('/get_simple_article_list', articleController.getSimpleArticleList);

// feed api
router.get('/get_feed_list', feedController.getFeedList);

// upload
router.post('/upload_avatar', uploadController.uploadAvatar);
router.post('/upload_banner', uploadController.uploadBanner);
router.post('/upload_image', uploadController.uploadImage);

// userspace
router.get('/get_system_message_list', userspaceController.getSystemMessageList);
router.post('/post_attention', userspaceController.userAttention);
router.post('/delete_attention', userspaceController.deleteAttention);
router.get('/get_attention_list', userspaceController.getAttentionList);
router.get('/get_collect_list', userspaceController.getCollectList);
router.post('/remove_collect', userspaceController.removeCollect);

// feedback
router.post('/post_feedback', feedbackController.postFeedback);

// message
router.post('/read_message', messageController.readMessage);
router.get('/unread_message', messageController.getUnreadMessage);

module.exports = router;
