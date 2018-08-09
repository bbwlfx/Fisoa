package models

import (
	"utils"
)

type CommentMessage struct {
	Email    string `json:"email"`
	Openmail int    `json:"openmail"`
	Aid      int    `json:"aid"`
	Qid      int    `json:"qid"`
	Title    string `json:"title"`
}

func CommentPushMessage(aid int) (cm CommentMessage) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from (select email, openmail, aid, title from T_user join T_article on T_user.uid = T_article.uid) as t1 where t1.aid=?", aid).Scan(&cm.Email, &cm.Openmail, &cm.Aid, &cm.Title)
	utils.CheckError(err)

	return
}

func AnswerPushMessage(qid int) (cm CommentMessage) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from (select email, openmail, qid, title from T_user join T_question on T_user.uid = T_question.uid) as t1 where t1.qid=?", qid).Scan(&cm.Email, &cm.Openmail, &cm.Qid, &cm.Title)
	utils.CheckError(err)

	return
}
