package models

type Article struct {
	Aid          int    `json:"aid"`
	Uid          int    `json:"uid"`
	Title        string `json:"title"`
	Content      string `json:"content"`
	Time         string `json:"time"`
	Tags         string `json:"tags"`
	View         int    `json:"view"`
	ReportReason int    `json:"report_reason"`
	Status       int    `json:"status"`
	Cover        string `json:"cover"`
	Banner       string `json:"banner"`
	UpdateTime   string `json:"updateTime"`
}
