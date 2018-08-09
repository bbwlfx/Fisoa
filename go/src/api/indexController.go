package api

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"models"
	"net/http"
	"utils"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var question = models.SelectQuestion(6300000, 0, 10)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response := utils.JSON(models.Response{0, question, "success"})
	fmt.Fprintln(w, response)
}
