package models

import "utils"

type AComment struct {
	Cid          int    `json:"cid"`
	Aid          int    `json:"aid"`
	Uid          int    `json:"uid"`
	Time         string `json:"time"`
	Content      string `json:"content"`
	ReportReason int    `json:"report_reason"`
	Support      int    `json:"support"`
	Status       int    `json:"status"`
}

func InsertArticleComment(aid int, uid int, content string, time string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_article_comment(aid, uid, content, time) values(?,?,?,?)", aid, uid, content, time)
}

func SelectArticleComment(aid int) (ac []AComment) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_article_comment where aid=? order by support desc", aid)
	utils.CheckError(err)
	for rows.Next() {
		var (
			cid          int
			aid          int
			uid          int
			time         string
			content      string
			reportReason int
			support      int
			status       int
		)
		rows.Scan(&cid, &aid, &uid, &time, &content, &reportReason, &support, &status)
		ac = append(ac, AComment{cid, aid, uid, time, content, reportReason, support, status})
	}
	return
}
