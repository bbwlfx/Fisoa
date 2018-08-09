package models

type BannedList struct {
	Uid    int    `json:"uid"`
	Time   string `json:"time"`
	Reason string `json:"reason"`
}
