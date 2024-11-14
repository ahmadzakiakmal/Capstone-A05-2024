package main

import (
	"github.com/ahmadzakiakmal/myosense/controllers"
	"github.com/ahmadzakiakmal/myosense/initializers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true

	r.Use(cors.New(config))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, map[string]interface{}{
			"message": "MyoSense Backend using Go Gin",
		})
	})

	r.POST("/patient-data", controllers.RegisterPatientData)

	r.Run()
}
