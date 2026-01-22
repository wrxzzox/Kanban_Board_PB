package main

import (
	"kanban-service/database"
	"kanban-service/handlers"
	"kanban-service/middleware"
	"kanban-service/models"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()
	
	database.DB.AutoMigrate(&models.Board{}, &models.Column{}, &models.Task{}, &models.BoardMember{}, &models.Notification{})

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/")
	api.Use(middleware.AuthRequired())
	{
		api.GET("/boards", handlers.GetBoards)
		api.POST("/boards", handlers.CreateBoard)
		api.GET("/boards/:id", handlers.GetBoardDetails)
		api.POST("/boards/:id/invite", handlers.InviteUser)

		api.POST("/boards/:id/columns", handlers.CreateColumn)
		api.PATCH("/columns/:id", handlers.UpdateColumn)
		api.DELETE("/columns/:id", handlers.DeleteColumn)

		api.POST("/columns/:id/tasks", handlers.CreateTask)
		api.PATCH("/tasks/:id", handlers.UpdateTask)
		api.PATCH("/tasks/:id/move", handlers.MoveTask)

		api.GET("/notifications", handlers.GetNotifications)
		api.PATCH("/notifications/:id/read", handlers.MarkNotificationRead)
	}

	r.Run(":8082")
}
