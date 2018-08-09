package models

import "utils"

type MessageList struct {
	Mid     int    `json:"mid"`
	Target  string `json:"target"`
	Content string `json:"content"`
	Time    string `json:"time"`
	Unread  int    `json:"unread"`
}

func PostSystemMessage(target string, content string, time string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("insert into T_message_list(target, content, time) values(?,?,?)", target, content, time)
}

func GetSystemMessage() (m []MessageList) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_message_list")
	utils.CheckError(err)

	for rows.Next() {
		var (
			mid     int
			target  string
			content string
			time    string
			unread  int
		)
		rows.Scan(&mid, &target, &content, &time, &unread)
		m = append(m, MessageList{mid, target, content, time, unread})
	}
	return
}

func GetUserSystemMessage(target string) (m []MessageList) {
	db := utils.GetConnect()
	defer db.Close()

	rows, err := db.Query("select * from T_message_list where target=? or target=? order by time desc", target, "all")
	utils.CheckError(err)

	for rows.Next() {
		var (
			mid     int
			target  string
			content string
			time    string
			unread  int
		)
		rows.Scan(&mid, &target, &content, &time, &unread)
		m = append(m, MessageList{mid, target, content, time, unread})
	}
	return
}

func DeleteSystemMessage(mid int) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("delete from T_message_list where mid=?", mid)
}

func ReadMessage(target string) {
	db := utils.GetConnect()
	defer db.Close()

	db.Exec("update T_message_list set unread=0 where target=?", target)
}

func GetUnreadMessage(target string) int {
	var unread = 0
	db := utils.GetConnect()
	defer db.Close()

	err := db.QueryRow("select unread from T_message_list where target=? order by time desc limit 0,1", target).Scan(&unread)
	utils.CheckError(err)
	return unread
}
