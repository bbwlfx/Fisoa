package models

import "utils"

type Bulletin struct {
	Bid  int    `json:"bid"`
	Aid  int    `json:"aid"`
	Time string `json:"time"`
	Uid  int    `json:"uid"`
}

func SelectBulletin() (b []Bulletin) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_bulletin order by time desc")
	utils.CheckError(err)

	for rows.Next() {
		var (
			bid  int
			aid  int
			time string
			uid  int
		)
		rows.Scan(&bid, &aid, &time, &uid)
		b = append(b, Bulletin{bid, aid, time, uid})
	}
	return
}

func PostBulletin(aid int, time string, uid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_bulletin(aid, time, uid) values(?,?,?)", aid, time, uid)
}

func DeleteBulletin(bid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_bulletin where bid=?", bid)
}
