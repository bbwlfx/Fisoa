package utils

import (
	"config"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func GetConnect() *sql.DB {
	db, err := sql.Open("mysql", config.DataSourceName)
	if err != nil {
		log.Fatal("mysql connect error")
	}
	return db
}
