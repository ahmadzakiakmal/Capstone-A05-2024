package initializers

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	// connString := os.Getenv("DB_CONN_STRING")
	DB, err = gorm.Open(postgres.Open("host=127.0.0.1 user=postgres password=admin database=postgres port=5432"))
	if err != nil {
		log.Fatal("Failed to connect to DB")
	}
}
