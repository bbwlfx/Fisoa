package utils

import (
	"database/sql"
	"log"
)

func CheckError(err error) {
	if err != nil && err != sql.ErrNoRows {
		log.Fatal(err)
		panic(err)
	}
}
