package models

import (
	"utils"
)

type Attention struct {
	Uid  int `json:"uid"`
	Atid int `json:"atid"`
}

func InsertAttention(uid int, atid int) {
	db := utils.GetConnect()
	defer db.Close()

	stmt, err := db.Prepare("insert into T_user_attention(uid, atid) values(?,?)")
	utils.CheckError(err)
	defer stmt.Close()

	stmt.Exec(uid, atid)
}

func deleteAttention(uid int, atid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_user_attention where uid=? and atid=?", uid, atid)
}
