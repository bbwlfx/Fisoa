package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"routers"
)

func main() {
	var router = httprouter.New()
	router.GET("/", routers.Index)

	var err = http.ListenAndServe(":9888", nil)
	if err != nil {
		log.Fatal("server start error")
		return
	}
	log.Println("server start on port:9888 success!")
}
