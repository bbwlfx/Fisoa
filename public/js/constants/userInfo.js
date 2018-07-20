export default {
  uid: '用户ID',
  account: '用户账号',
  password: '用户密码',
  nickname: '昵称',
  avatar: '头像',
  age: '年龄',
  sex: '性别',
  fans: '粉丝数量',
  blog: '博客地址',
  school: '学校',
  qq: 'QQ账号',
  wechat: '微信账号',
  weibo: '微博账号',
  area: '领域',
  description: '自我介绍',
  overt: '是否开放隐私信息',
  banner: '背景墙图片',
  status: '账号状态'
};

export const accountStatus = {
  '0': '账号被封禁',
  '1': '正常账号',
  '2': '备用状态',
  '3': '备用状态',
  '4': '备用状态',
  '5': '管理员账号'
};

export const accountController = {
  '0': [{
    text: '解封账号',
    targetStatus: '1'
  }],
  '1': [{
    text: '封禁账号',
    targetStatus: '0'
  }, {
    text: '设置管理员账号',
    targetStatus: '5'
  }],
  '5': [{
    text: '取消管理员账号',
    targetStatus: '1'
  }]
};
