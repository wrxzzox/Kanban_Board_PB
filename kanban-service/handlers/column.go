package handlers

import (
	"kanban-service/database"
	"kanban-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateColumn(c *gin.Context) {
	var input models.Column
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	boardIDStr := c.Param("id")
	boardID, err := strconv.ParseUint(boardIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid board ID"})
		return
	}
	input.BoardID = uint(boardID)
	
	if result := database.DB.Create(&input); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateColumn(c *gin.Context) {
	id := c.Param("id")
	var column models.Column
	if result := database.DB.First(&column, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Column not found"})
		return
	}

	var input models.Column
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&column).Updates(input)
	c.JSON(http.StatusOK, column)
}

func DeleteColumn(c *gin.Context) {
	id := c.Param("id")
	if result := database.DB.Delete(&models.Column{}, id); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
