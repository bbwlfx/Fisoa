package models

import (
	"utils"
)

type Question struct {
	Qid        int    `json:"qid"`
	Uid        int    `json:"uid"`
	Title      string `json:"title"`
	Tags       string `json:"tags"`
	Content    string `json:"content"`
	Time       string `json:"time"`
	Status     int    `json:"status"`
	UpdateTime string `json:"updateTime"`
}

func InsertQuestion(uid int, title string, tags string, content string, time string, updateTime string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_question(uid, title, tags, content, time, updateTime) values(?,?,?,?,?,?)", uid, title, tags, content, time, updateTime)
}

func SelectQuestion(uid int, start int, end int) (q []Question) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_question where uid=? order by time desc limit ?,?", uid, start, end)
	utils.CheckError(err)

	for rows.Next() {
		var (
			qid        int
			uid        int
			title      string
			tags       string
			content    string
			time       string
			status     int
			updateTime string
		)
		rows.Scan(&qid, &uid, &title, &tags, &content, &time, &status, &updateTime)
		q = append(q, Question{qid, uid, title, tags, content, time, status, updateTime})
	}
	return
}

func SelectQuestionByQid(qid int) (q Question) {
	db := utils.GetConnect()
	defer db.Close()
	err := db.QueryRow("select * from T_question where qid=?", qid).Scan(&q.Qid, &q.Uid, &q.Title, &q.Tags, &q.Content, &q.Time, &q.Status, &q.UpdateTime)
	utils.CheckError(err)
	return
}
