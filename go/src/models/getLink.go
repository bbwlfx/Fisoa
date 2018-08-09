package models

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

func GetLink() interface{} {
	var db, err = sql.Open("sql", "root:12345678@/mofish_DB")
	if err != nil {
		fmt.Println("Mysql connect error")
		panic(err)
	}
	return db
}
