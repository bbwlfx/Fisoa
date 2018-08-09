package models

import (
	"config"
	"database/sql"
	"utils"
)

type BannedList struct {
	Uid    int    `json:"uid"`
	Time   string `json:"time"`
	Reason string `json:"reason"`
}

func BanAccount(uid int, time string, reason string) {
	db, err := sql.Open("mysql", config.DataSourceName)
	utils.CheckError(err)
	defer db.Close()

	db.Exec("insert into T_banned_list(uid, time, reason) values(?,?,?)", uid, time, reason)
}
