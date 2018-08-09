package models

import "utils"

type SupportArticle struct {
	Aid int `json:"aid"`
	Uid int `json:"uid"`
}

func InsertArticleSupport(aid int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_support_article(aid, uid) values(?,?)", aid, uid)
}

func SelectArticleSupportCount(aid int) int {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select count(*) as count from T_support_article where aid=?", aid).Scan(&count)
	utils.CheckError(err)
	return count
}

func SelectArticleSupport(aid int, uid int) (support []SupportArticle) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_support_article where aid=? and uid=?", aid, uid)
	utils.CheckError(err)

	for rows.Next() {
		var (
			aid int
			uid int
		)
		rows.Scan(&aid, &uid)
		support = append(support, SupportArticle{aid, uid})
	}
	return
}
