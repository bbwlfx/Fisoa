package models

type AComment struct {
	Cid          int    `json:"cid"`
	Aid          int    `json:"aid"`
	Uid          int    `json:"uid"`
	Time         string `json:"time"`
	Content      string `json:"content"`
	ReportReason int    `json:"report_reason"`
	Support      int    `json:"support"`
	Status       int    `json:"status"`
}
