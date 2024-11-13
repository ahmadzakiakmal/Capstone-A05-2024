package main

import (
	"github.com/ahmadzakiakmal/myosense/initializers"
	"github.com/ahmadzakiakmal/myosense/models"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, map[string]interface{}{
			"message": "MyoSense Backend using Go Gin",
		})
	})

	r.POST("/patient-data", func(c *gin.Context) {
		var body models.PatientData
		err := c.ShouldBindJSON(&body)
		if err != nil {
			c.JSON(415, map[string]interface{}{
				"message": err.Error(),
			})
			return
		}
		if body.Name == "" {
			c.JSON(400, map[string]interface{}{
				"message": "Name is required",
			})
			return
		}
		if body.Age == 0 {
			c.JSON(400, map[string]interface{}{
				"message": "Age must be greater than 0",
			})
			return
		}
		initializers.DB.Create(&body)
		c.JSON(200, map[string]interface{}{
			"message": "create patient",
		})
	})

	r.Run()
}
