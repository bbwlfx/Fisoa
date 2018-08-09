/*eslint-disable */
const mysql = require('mysql');
const config = require('../node/lib/mysql/config');

const connection = mysql.createConnection(config);

const createTuser = `CREATE TABLE T_user(
  uid int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  account VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(20) NOT NULL DEFAULT '新注册用户',
  avatar VARCHAR(200) DEFAULT '',
  age TINYINT DEFAULT 18,
  sex TINYINT DEFAULT 0,
  fans INT DEFAULT 0,
  blog VARCHAR(50) DEFAULT '',
  school VARCHAR(100) NOT NULL DEFAULT '',
  qq VARCHAR(11) DEFAULT '',
  wechat VARCHAR(30) DEFAULT '',
  weibo VARCHAR(50) DEFAULT '',
  area VARCHAR(20) DEFAULT '',
  description VARCHAR(255) DEFAULT '',
  overt TINYINT DEFAULT 0,
  banner VARCHAR(200) DEFAULT '',
  status int NOT NULL DEFAULT 1,
  email VARCHAR(255) NOT NULL,
  lv int NOT NULL DEFAULT 1,
  expr int NOT NULL DEFAULT 0,
  openmail int NOT NULL DEFAULT 0
) DEFAULT CHARSET=utf8mb4;`;

const createTarticle = `CREATE TABLE T_article(
  aid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  uid INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  time VARCHAR(15) NOT NULL,
  tags TEXT NOT NULL,
  view INT DEFAULT 0,
  report_reason INT DEFAULT 0,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE,
  status int NOT NULL DEFAULT 5,
  cover VARCHAR(255) default '',
  banner VARCHAR(255) default '',
  updateTime VARCHAR(15) NOT NULL
) DEFAULT CHARSET=utf8mb4;`;

const createTquestion = `CREATE TABLE T_question(
  qid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  uid INT NOT NULL,
  title TEXT NOT NULL,
  tags VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  time VARCHAR(15) NOT NULL,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE,
  status int NOT NULL DEFAULT 5,
  updateTime VARCHAR(15) NOT NULL
) DEFAULT CHARSET=utf8mb4;`;

const createTQcomment = `CREATE TABLE T_question_comment(
  cid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  qid INT NOT NULL,
  uid INT NOT NULL,
  time VARCHAR(15) NOT NULL,
  content TEXT NOT NULL,
  report_reason INT DEFAULT 0,
  thanks INT DEFAULT 0,
  FOREIGN KEY(qid) REFERENCES T_question(qid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE,
  status int NOT NULL DEFAULT 5  
) DEFAULT CHARSET=utf8mb4;`;

const createTAcomment = `CREATE TABLE T_article_comment(
  cid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  aid INT NOT NULL,
  uid INT NOT NULL,
  content TEXT NOT NULL,
  time VARCHAR(15) NOT NULL,
  support INT DEFAULT 0,
  report_reason INT DEFAULT 0,
  FOREIGN KEY(aid) REFERENCES T_article(aid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE,
  status int NOT NULL DEFAULT 5
) DEFAULT CHARSET=utf8mb4;`;

const createAttention = `CREATE TABLE T_user_attention(
  uid INT NOT NULL,
  atid INT NOT NULL,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE,
  FOREIGN KEY(atid) REFERENCES T_user(uid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createCollectArticle = `CREATE TABLE T_collect_article(
  aid INT NOT NULL,
  uid INT NOT NULL,
  FOREIGN KEY(aid) REFERENCES T_article(aid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createSuppportArticle = `CREATE TABLE T_support_article(
  aid INT NOT NULL,
  uid INT NOT NULL,
  FOREIGN KEY(aid) REFERENCES T_article(aid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createSuppportQuesionComment = `CREATE TABLE T_support_quesion_comment(
  cid INT NOT NULL,
  uid INT NOT NULL,
  FOREIGN KEY(cid) REFERENCES T_question_comment(cid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createSupportArticleComment = `CREATE TABLE T_support_article_comment(
  cid INT NOT NULL,
  uid INT NOT NULL,
  FOREIGN KEY(cid) REFERENCES T_article_comment(cid) ON DELETE CASCADE,
  FOREIGN KEY(uid) REFERENCES T_user(uid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createBulletin = `CREATE TABLE T_bulletin(
  bid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  aid INT NOT NULL,
  time VARCHAR(15) NOT NULL,
  uid INT NOT NULL,
  FOREIGN KEY(aid) REFERENCES T_article(aid) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;`;

const createMessageList = `CREATE TABLE T_message_list(
  mid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  target VARCHAR(20) NOT NULL,
  content VARCHAR(1024) NOT NULL,
  time VARCHAR(15) NOT NULL,
  unread int NOT NULL DEFAULT 1
) DEFAULT CHARSET=utf8mb4;`;

const createFeedbackList = `CREATE TABLE T_feedback_list(
  fid INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  uid INT,
  content VARCHAR(1024)
) DEFAULT CHARSET=utf8mb4;`;

const createBannedList = `CREATE TABLE T_banned_list(
  uid INT PRIMARY KEY NOT NULL,
  time VARCHAR(15) NOT NULL,
  reason VARCHAR(1024) DEFAULT '不符合规定'
) DEFAULT CHARSET=utf8mb4;`;

const createArticleRank = `CREATE TABLE T_article_rank(
  aid INT PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  score INT DEFAULT 0,
  author VARCHAR(20)
) DEFAULT CHARSET=utf8mb4;`;

const createOnlineTime = `CREATE TABLE T_online_time(
  uid INT PRIMARY KEY NOT NULL UNIQUE,
  lastTime VARCHAR(15) NOT NULL
) DEFAULT CHARSET=utf8mb4`;

const queryList = [createTuser, createTarticle,
  createTquestion, createTQcomment,
  createTAcomment, createAttention,
  createCollectArticle, createSuppportArticle,
  createSuppportQuesionComment, createSupportArticleComment,
  createBulletin, createFeedbackList, createMessageList,
  createBannedList, createArticleRank, createOnlineTime];

queryList.forEach((query, index) => {
  connection.query(query, (err) => {
    if(err) {
      if(err.errno !== 1050) {
        console.log(`${query} error!:`, err.sqlMessage);
      } else {
        console.log('[table already exists!]');
      }
    } else {
      console.log('[create table success!]');
    }
    if(index === queryList.length - 1) {
      process.exit();
    }
  });
});

