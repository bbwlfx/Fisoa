package models

import "utils"

type SupportArticleComment struct {
	Cid int `json:"cid"`
	Uid int `json:"uid"`
}

func InsertArticleCommentSupport(cid int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_support_article_comment(cid, uid) values(?,?)", cid, uid)
}

func SelectArticelCommentSupport(cid int) (sac []SupportArticleComment) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select count(*) as count from T_support_article_comment where cid=?", cid)
	utils.CheckError(err)

	for rows.Next() {
		var (
			cid int
			uid int
		)
		rows.Scan(&cid, uid)
		sac = append(sac, SupportArticleComment{cid, uid})
	}
	return
}

func SelectIfArticleCommentSupport(cid int, uid int) int {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select count(*) from T_support_article_comment where cid=? and uid=?", cid, uid).Scan(&count)
	utils.CheckError(err)

	return count
}
