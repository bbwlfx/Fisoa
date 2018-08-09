package models

type Question struct {
	Qid        int    `json:"qid"`
	Uid        int    `json:"uid"`
	Title      string `json:"title"`
	Tags       string `json:"tags"`
	Content    string `json:"content"`
	Time       string `json:"time"`
	Status     int    `json:"status"`
	UpdateTime string `json:"updateTime"`
}
