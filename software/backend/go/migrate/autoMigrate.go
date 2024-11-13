package main

import (
	"github.com/ahmadzakiakmal/myosense/initializers"
	"github.com/ahmadzakiakmal/myosense/models"
)

func init() {
	initializers.LoadEnv()
}

func main() {
	initializers.ConnectDB()
	initializers.DB.AutoMigrate(&models.PatientData{})
}
