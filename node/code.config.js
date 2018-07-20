module.exports.code = {
  success: 0,
  serverError: 101,
  paramsError: 102,
  loginError: 103,
  otherError: 104,
  noPermission: 105,
  userExist: 106,
  accountBanned: 107
};
module.exports.errorMsg = {
  serverError: '服务器异常，请稍后重试',
  paramsError: '参数错误，请重新填写',
  userExist: '用户已存在',
  verificationCodeError: '验证码错误',
  passwordError: '密码错误',
  userNotExist: '用户不存在',
  contentNotNull: '内容不能为空',
  needLogin: '您尚未登录，请先登录账号',
  articleNotExist: '文章不存在',
  cannotDeleteArticle: '您无权限删除文章',
  cannotDeleteQuestion: '您无权限删除问题',
  questionNotExist: '问题不存在',
  commentNotExist: '评论不存在',
  changePasswordError: '密码错误',
  imageTypeError: '图片类型错误，请上传png、jpg、jpeg类型的图片',
  imageUploadError: '图片上传错误，请稍后重试',
  noPermissionError: '用户权限不足',
  accountBanned: '账号暂时被封禁，如有疑问请点击右下角发送反馈给管理员',
  sendMailError: '发送邮件失败，请稍后重新尝试',
  resetPassError: '重置密码失败，请稍后重新尝试'
};
