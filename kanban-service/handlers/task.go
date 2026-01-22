package handlers

import (
	"kanban-service/database"
	"kanban-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := database.DB.Create(&input); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if result := database.DB.First(&task, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&task).Updates(input)
	c.JSON(http.StatusOK, task)
}

func MoveTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if result := database.DB.First(&task, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	type MoveInput struct {
		TargetColumnID uint `json:"target_column_id"`
		Position       int  `json:"position"`
	}
	var input MoveInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.ColumnID = input.TargetColumnID
	task.Position = input.Position
	database.DB.Save(&task)
	
	c.JSON(http.StatusOK, task)
}
