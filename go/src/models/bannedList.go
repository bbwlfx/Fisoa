package models

import (
	"utils"
)

type BannedList struct {
	Uid    int    `json:"uid"`
	Time   string `json:"time"`
	Reason string `json:"reason"`
}

func BanAccount(uid int, time string, reason string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_banned_list(uid, time, reason) values(?,?,?)", uid, time, reason)
}

func GetBannedList() (list []BannedList) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_banned_list order by time desc")
	utils.CheckError(err)

	for rows.Next() {
		var (
			uid    int
			time   string
			reason string
		)
		rows.Scan(&uid, &time, &reason)
		list = append(list, BannedList{uid, time, reason})
	}
	return
}

func DeleteBannedRecord(uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_banned_list where uid=?", uid)
}
