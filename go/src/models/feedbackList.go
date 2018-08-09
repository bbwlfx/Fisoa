package models

import "utils"

type FeedbackList struct {
	Fid     int    `json:"fid"`
	Uid     int    `json:"uid"`
	Content string `json:"content"`
}

func PostFeedback(uid int, content string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_feedback_list(uid, content) values(?,?)", uid, content)
}

func GetFeedbackList() (fb []FeedbackList) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_feedback_list")
	utils.CheckError(err)

	for rows.Next() {
		var (
			fid     int
			uid     int
			content string
		)
		rows.Scan(&fid, &uid, &content)
		fb = append(fb, FeedbackList{fid, uid, content})
	}
	return
}
