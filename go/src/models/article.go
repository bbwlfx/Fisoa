package models

import "utils"

type Article struct {
	Aid          int    `json:"aid"`
	Uid          int    `json:"uid"`
	Title        string `json:"title"`
	Content      string `json:"content"`
	Time         string `json:"time"`
	Tags         string `json:"tags"`
	View         int    `json:"view"`
	ReportReason int    `json:"report_reason"`
	Status       int    `json:"status"`
	Cover        string `json:"cover"`
	Banner       string `json:"banner"`
	UpdateTime   string `json:"updateTime"`
}

func ViewArticle(aid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_article set view = view + 1 where aid=?", aid)
}

func InsertArticle(uid int, title string, content string, time string, tags string, cover string, banner string, updateTime string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_article(uid, title, content, time, tags, cover, banner, updateTime) values(?,?,?,?,?,?,?,?)", uid, title, content, time, tags, cover, banner, updateTime)
}

func ModifyArticle(aid int, title string, content string, time string, tags string, cover string, banner string, updateTime string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_article set title=?, content=?, time=?, tags=?, cover=?, banner=?, updateTime=? where aid=?", title, content, time, tags, cover, banner, updateTime, aid)
}

func SelectSimpleArticle(uid int) (article []Article) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select aid, title, cover, time, view from T_article where uid=? and aid not in (select aid from T_bulletin) order by time desc limit 0, 5")
	utils.CheckError(err)

	for rows.Next() {
		var (
			aid   int
			title string
			cover string
			time  string
			view  int
		)
		err = rows.Scan(&aid, &title, &cover, &time, &view)
		utils.CheckError(err)
		article = append(article, Article{Aid: aid, Title: title, Cover: cover, Time: time, View: view})
	}
	return
}

func SelectArticle(uid int, start int, end int) (article []Article) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_article where uid=? and aid not in (select aid from T_bulletin) order by time desc limit ?,?", uid, start, end)
	utils.CheckError(err)
	for rows.Next() {
		var (
			aid          int
			uid          int
			title        string
			content      string
			time         string
			tags         string
			view         int
			reportReason int
			status       int
			cover        string
			banner       string
			updateTime   string
		)
		err = rows.Scan(&aid, &uid, &title, &content, &time, &tags, &view, &reportReason, &status, &cover, &banner, &updateTime)
		utils.CheckError(err)
		article = append(article, Article{aid, uid, title, content, time, tags, view, reportReason, status, cover, banner, updateTime})
	}
	return
}

func SelectArticleCommentCount(aid int) int {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select count(*) as count from T_article_comment where aid=?", aid).Scan(&count)
	utils.CheckError(err)
	return count
}

func SelectArticleByAid(aid int) (article Article) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from T_article where aid=?", aid).Scan(&article.Aid, &article.Uid, &article.Title, &article.Content, &article.Time, &article.Tags, &article.View, &article.ReportReason, &article.Status, &article.Cover, &article.Banner, &article.UpdateTime)
	utils.CheckError(err)
	return
}

func DeleteArticle(aid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_article where aid=?", aid)
}

func SelectFeedArticle(start int, end int) (article []Article) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_article where aid not in (select aid from T_bulletin) order by updateTime desc limit ?,?", start, end)
	utils.CheckError(err)
	for rows.Next() {
		var (
			aid          int
			uid          int
			title        string
			content      string
			time         string
			tags         string
			view         int
			reportReason int
			status       int
			cover        string
			banner       string
			updateTime   string
		)
		err = rows.Scan(&aid, &uid, &title, &content, &time, &tags, &view, &reportReason, &status, &cover, &banner, &updateTime)
		utils.CheckError(err)
		article = append(article, Article{aid, uid, title, content, time, tags, view, reportReason, status, cover, banner, updateTime})
	}
	return
}
