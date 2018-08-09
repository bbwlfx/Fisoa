package models

import (
	"config"
	"database/sql"
	"utils"
)

type QComment struct {
	Cid          int    `json:"cid"`
	Qid          int    `json:"qid"`
	Uid          int    `json:"uid"`
	Time         string `json:"time"`
	Content      string `json:"content"`
	ReportReason int    `json:"report_reason"`
	Thanks       int    `json:"thanks"`
	Status       int    `json:"status"`
}

func SelectQuestionCommentCount(qid int) (c QComment) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	err = db.QueryRow("select count(*) as count from T_question_comment where qid=?", qid).Scan(&c.Cid, &c.Qid, &c.Uid, &c.Time, &c.Content, &c.ReportReason, &c.Thanks, &c.Status)
	utils.CheckError(err)
	return
}

func SelectAnswer(qid int) (c QComment) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	err = db.QueryRow("select * from T_question_comment where qid=? order by thanks", qid).Scan(&c.Cid, &c.Qid, &c.Uid, &c.Time, &c.Content, &c.ReportReason, &c.Thanks, &c.Status)
	utils.CheckError(err)
	return
}

func InsertAnswer(qid int, uid int, content string, time string) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	db.Exec("insert into T_question_comment(qid, uid, content, time) values(?,?,?,?)", qid, uid, content, time)
}

func InsertAnswerSupport(cid int, uid int) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	db.Exec("insert into T_support_quesion_comment(cid, uid) values(?,?)", cid, uid)
}

func SelectAnswerSupportCount(cid int) int {
	var count = 0
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	err = db.QueryRow("select count(*) as count from T_support_quesion_comment where cid=?", cid).Scan(&count)
	utils.CheckError(err)
	return count
}

func SelectIfAnswerSupport(cid int, uid int) bool {
	var count = 0
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	err = db.QueryRow("select count(*) from T_support_quesion_comment where cid=? and uid=?", cid, uid).Scan(&count)
	if count > 0 {
		return true
	}
	return false
}

func DeleteQuestion(qid int) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	db.Exec("delete from T_question where qid=?", qid)
}

func UpdateQuestionTime(updateTime string, qid int) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	db.Exec("update T_question set updateTime=? where qid=?", updateTime, qid)
}
