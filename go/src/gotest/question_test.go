package gotest

import (
	"models"
	"testing"
)

func Test_SelectQuestionByQid(t *testing.T) {
	var id = 0
	var q = models.SelectQuestionByQid(id)
	if q.Qid < 0 {
		t.Error("Error: select question by qid")
	}
}

func Test_SelectQuestion(t *testing.T) {
	var id, start, end = 0, 0, 10
	var ret = models.SelectQuestion(id, start, end)
	if ret != nil && len(ret) < 0 {
		t.Error("Error: select question")
	}
}
