const router = require('koa-router')();
const adminController = require('../controllers/api/admin');

// admin-system api
router.get('/get_article_info', adminController.adminGetArticleInfo);
router.get('/get_question_info', adminController.adminGetQuestionInfo);
router.get('/get_bulletin', adminController.adminGetBulletin);
router.post('/post_bulletin', adminController.adminPostBulletin);
router.post('/delete_bulletin', adminController.adminDeleteBulletin);
router.post('/post_system_message', adminController.adminPostSystemMessage);
router.get('/get_system_message', adminController.adminGetSystemMessage);
router.post('/delete_system_message', adminController.adminDeleteSystemMessage);
router.get('/get_feedback_list', adminController.getFeedbackList);
router.get('/change_status', adminController.adminChangeStatus);
router.post('/ban_account', adminController.banAccount);
router.get('/get_banned_list', adminController.getBannedList);
router.get('/unblock_account', adminController.unblockAccount);

module.exports = router;
