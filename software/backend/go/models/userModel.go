package models

import "gorm.io/gorm"

type PatientData struct {
	gorm.Model
	Name         string
	Age          int
	MaxRms       float32
	MaxAmplitude float32
}
