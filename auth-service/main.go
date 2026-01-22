package main

import (
	"auth-service/database"
	"auth-service/handlers"
	"auth-service/models"
	
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()
	
	database.DB.AutoMigrate(&models.User{})

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	r.Run(":8081")
}
