package models

type QComment struct {
	Cid          int    `json:"cid"`
	Qid          int    `json:"qid"`
	Uid          int    `json:"uid"`
	Time         string `json:"time"`
	Content      string `json:"content"`
	ReportReason int    `json:"report_reason"`
	Thanks       int    `json:"thanks"`
	Status       int    `json:"status"`
}
