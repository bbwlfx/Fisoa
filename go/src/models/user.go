package models

import (
	_ "github.com/go-sql-driver/mysql"
	"utils"
)

type User struct {
	Uid         int    `sql:"uid"`
	Account     string `sql:"account"`
	Password    string `sql:"password"`
	Nickname    string `sql:"nickname"`
	Avatar      string `sql:"avatar"`
	Age         int8   `sql:"age"`
	Sex         int8   `sql:"sex"`
	Fans        int    `sql:"fans"`
	Blog        string `sql:"blog"`
	School      string `sql:"school"`
	QQ          string `sql:"qq"`
	Wechat      string `sql:"wechat"`
	Weibo       string `sql:"weibo"`
	Area        string `sql:"Area"`
	Description string `sql:"description"`
	Overt       int8   `sql:"overt"`
	Banner      string `sql:"banner"`
	Status      int    `sql:"status"`
	Email       string `sql:"email"`
	LV          int    `sql:"lv"`
	Expr        int    `sql:"expr"`
	Openmail    int    `sql:"openmail"`
}

func SelectUser(account string) (user User) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from T_user where account=?", account).Scan(
		&user.Uid,
		&user.Account,
		&user.Password,
		&user.Nickname,
		&user.Avatar,
		&user.Age,
		&user.Sex,
		&user.Fans,
		&user.Blog,
		&user.School,
		&user.QQ,
		&user.Wechat,
		&user.Weibo,
		&user.Area,
		&user.Description,
		&user.Overt,
		&user.Banner,
		&user.Status,
		&user.Email,
		&user.LV,
		&user.Expr,
		&user.Openmail,
	)
	utils.CheckError(err)
	return
}

func InsertUser(account string, password string, email string) {
	db := utils.GetConnect()
	defer db.Close()

	stmt, err := db.Prepare("insert into T_user(account, password, email) values(?,?,?)")
	utils.CheckError(err)
	defer stmt.Close()
	stmt.Exec(account, password, email)
}

func SelectUserByUid(uid int) (user User) {
	db := utils.GetConnect()
	defer db.Close()
	err := db.QueryRow("select * from T_user where uid=?", uid).Scan(
		&user.Uid,
		&user.Account,
		&user.Password,
		&user.Nickname,
		&user.Avatar,
		&user.Age,
		&user.Sex,
		&user.Fans,
		&user.Blog,
		&user.School,
		&user.QQ,
		&user.Wechat,
		&user.Weibo,
		&user.Area,
		&user.Description,
		&user.Overt,
		&user.Banner,
		&user.Status,
		&user.Email,
		&user.LV,
		&user.Expr,
		&user.Openmail,
	)
	utils.CheckError(err)
	return
}

func SelectEamilByAccount(account string) (email string) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select email from T_user where account=?", account).Scan(&email)
	utils.CheckError(err)
	return
}

func ShowAttention(uid int) (count int) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select COUNT(*) as count from T_user_attention where uid=?", uid).Scan(&count)
	utils.CheckError(err)
	return
}

func ShowFans(atid int) (count int) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select COUNT(*) as count from T_user_attention where atid=?", atid).Scan(&count)
	utils.CheckError(err)
	return
}

func ShowIfPayAttention(uid int, atid int) bool {
	var count = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select COUNT(*) as count from T_user_attention where uid=? and atid=?").Scan(&count)
	utils.CheckError(err)

	if count > 0 {
		return true
	}
	return false
}

func UpdateUserInfo(sex string, school string, area string, nickname string, blog string, qq string, wechat string, weibo string, description string, overt int, openmail int, email string, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec(
		"update T_user set sex=?, school=?, area=?, nickname=?, blog=?, qq=?, wechat=?, weibo=?, description=?, overt=?, openmail=?, email=? where uid=?",
		sex, school, area, nickname, blog, qq, wechat, weibo, description, overt, openmail, email, uid,
	)
}

func ChangePassword(password string, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set password=? where uid=?", password, uid)
}

func GetAttentionList(uid int) (user []User) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_user where uid in (select atid from T_user_attention where uid=?)", uid)
	utils.CheckError(err)

	for rows.Next() {
		var (
			uid         int
			account     string
			password    string
			email       string
			nickname    string
			avatar      string
			age         int8
			sex         int8
			fans        int
			blog        string
			school      string
			qq          string
			wechat      string
			weibo       string
			area        string
			description string
			overt       int8
			banner      string
			status      int
			lv          int
			expr        int
			openmail    int
		)
		rows.Scan(&uid, &account, &password, &nickname, &avatar, &age, &sex, &fans, &blog, &school, &qq, &wechat, &weibo, &area, &description, &overt, &banner, &status, &email, &lv, &expr, &openmail)
		user = append(user, User{uid,
			account,
			password,
			nickname,
			avatar,
			age,
			sex,
			fans,
			blog,
			school,
			qq,
			wechat,
			weibo,
			area,
			description,
			overt,
			banner,
			status,
			email,
			lv,
			expr,
			openmail})
	}
	return
}

func UpdateAvatar(avatar string, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set avatar=? where uid=?", avatar, uid)
}

func UpdateBanner(banner string, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set banner=? where uid=?", banner, uid)
}

func UpdateStatus(status int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set status=? where uid=?", status, uid)
}

func AddLV(lv int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set lv=? where uid=?", lv, uid)
}

func SetExpr(expr int, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set expr=? where uid=?", expr, uid)
}

func SelectUidByAid(aid int) (user User) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from T_user where uid = (select uid from T_article where aid=?)", aid).Scan(
		&user.Uid,
		&user.Account,
		&user.Password,
		&user.Nickname,
		&user.Avatar,
		&user.Age,
		&user.Sex,
		&user.Fans,
		&user.Blog,
		&user.School,
		&user.QQ,
		&user.Wechat,
		&user.Weibo,
		&user.Area,
		&user.Description,
		&user.Overt,
		&user.Banner,
		&user.Status,
		&user.Email,
		&user.LV,
		&user.Expr,
		&user.Openmail)
	utils.CheckError(err)
	return
}

func SelectUidByCid(cid int) (user User) {
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select * from T_user where uid = (select uid from T_question_comment where cid=?)", cid).Scan(&user.Uid,
		&user.Account,
		&user.Password,
		&user.Nickname,
		&user.Avatar,
		&user.Age,
		&user.Sex,
		&user.Fans,
		&user.Blog,
		&user.School,
		&user.QQ,
		&user.Wechat,
		&user.Weibo,
		&user.Area,
		&user.Description,
		&user.Overt,
		&user.Banner,
		&user.Status,
		&user.Email,
		&user.LV,
		&user.Expr,
		&user.Openmail)
	utils.CheckError(err)
	return
}

func ResetPasswordByAccount(password string, account string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_user set password=? where account=?", password, account)
}
