package models

import (
	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	Uid         int    `sql: "uid"`
	Account     string `sql: "account"`
	Password    string `sql: "password"`
	Email       string `sql: "email"`
	Nickname    string `sql: "nickname"`
	Avatar      string `sql: "avatar"`
	Age         string `sql: "age"`
	Sex         string `sql: "sex"`
	Fans        string `sql: "fans"`
	Blog        string `sql: "blog"`
	School      string `sql: "school"`
	QQ          string `sql: "qq"`
	Wechat      string `sql: "wechat"`
	weibo       string `sql: "weibo"`
	area        string `sql: "Area"`
	Description string `sql: "description"`
	Overt       int    `sql: "overt"`
	Banner      string `sql: "banner"`
	Status      int    `sql: "status"`
	LV          int    `sql: "lv"`
	Expr        int    `sql: "expr"`
	Openmail    int    `sql: "openmail"`
}

//type User struct {
//	Id   int    `json:"id"`
//	Name string `json:"name"`
//}
//
//func SelectUser(account string) (user []User) {
//
//	db, err := sql.Open("mysql", "root:12345678@tcp(127.0.0.1:3306)/test?charset=utf8mb4")
//	utils.CheckError(err)
//	defer db.Close()
//
//	rows, _ := db.Query("select * from t_person")
//	for rows.Next() {
//		var (
//			id   int
//			name string
//		)
//		rows.Scan(&id, &name)
//		user = append(user, User{id, name})
//
//	}
//	rows.Close()
//	log.Println(user)
//
//	return
//}
