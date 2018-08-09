package models

type ArticleRank struct {
	Aid    int    `json:"aid"`
	Title  string `json:"title"`
	Score  int    `json:"score"`
	Author string `json:"author"`
}
