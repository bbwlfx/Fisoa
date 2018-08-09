package models

type Bulletin struct {
	Bid  int    `json:"bid"`
	Aid  int    `json:"aid"`
	Time string `json:"time"`
	Uid  int    `json:"uid"`
}
