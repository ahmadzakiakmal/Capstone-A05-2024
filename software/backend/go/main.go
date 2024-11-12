package main

import (
	"github.com/ahmadzakiakmal/myosense/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, map[string]interface{}{
			"message": "MyoSense Backend using Go Gin",
		})
	})

	r.Run()
}
