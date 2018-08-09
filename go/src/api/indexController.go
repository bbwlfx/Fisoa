package api

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	//var user = models.SelectUser("root")
	//w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	//if user == nil {
	//	w.WriteHeader(http.StatusNotFound)
	//	response := utils.JSON(models.Response{404, struct{}{}, "not found"})
	//	err := json.NewEncoder(w).Encode(response)
	//	utils.CheckError(err)
	//}
	//response := utils.JSON(user)
	fmt.Fprint(w, "Hello World!")
}
