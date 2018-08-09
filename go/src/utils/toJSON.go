package utils

import "encoding/json"

func JSON(obj interface{}) string {
	str, _ := json.Marshal(obj)
	return string(str)
}
