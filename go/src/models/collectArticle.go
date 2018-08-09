package models

import "utils"

type CollectArticle struct {
	Aid int `json:"aid"`
	Uid int `json:"uid"`
}

func InsertCollectArticle(aid int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_collect_article(aid, uid) values(?,?)", aid, uid)
}

func SelectIfCollectArticle(aid int, uid int) int {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select count(*) from T_collect_article where aid=? and uid=?", aid, uid).Scan(&count)
	utils.CheckError(err)
	return count
}

func SelectCollectArticleCount(aid int) int {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select count(*) as count from T_collect_article where aid=?", aid).Scan(&count)

	utils.CheckError(err)

	return count
}

func SelectCollectList(uid int, start int, end int) (ca []CollectArticle) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_article where aid in (select aid from T_collect_article where uid=?) limit ?,?", uid, start, end)
	utils.CheckError(err)

	for rows.Next() {
		var (
			aid int
			uid int
		)
		rows.Scan(&aid, &uid)
		ca = append(ca, CollectArticle{aid, uid})
	}
	return
}

func RemoveCollect(aid int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_collect_article where aid=? and uid=?", aid, uid)
}

func UpdateArticleTime(aid int, updateTime string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_article set updateTime=? where aid=?", updateTime, aid)
}
