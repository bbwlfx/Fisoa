package main

import (
	"log"
	"net/http"
	"routers"
)

func main() {
	var routes = routers.Routes()
	var err = http.ListenAndServe(":9888", routes)
	if err != nil {
		log.Fatal("server start error")
		return
	}
	log.Println("server start on port:9888 success!")
}
