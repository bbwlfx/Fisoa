package models

type FeedbackList struct {
	Fid     int    `json:"fid"`
	Uid     int    `json:"uid"`
	Content string `json:"content"`
}
