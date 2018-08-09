package routers

import (
	"api"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

var router = httprouter.New()

func Routes() http.Handler {
	router.GET("/", api.Index)
	return router
}
