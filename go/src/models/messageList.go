package models

type MessageList struct {
	Mid     int    `json:"mid"`
	Target  string `json:"target"`
	Content string `json:"content"`
	Time    string `json:"time"`
	Unread  int    `json:"unread"`
}
