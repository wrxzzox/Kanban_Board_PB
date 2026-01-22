package handlers

import (
	"kanban-service/database"
	"kanban-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetNotifications(c *gin.Context) {
	userID := uint(c.GetFloat64("user_id"))

	notifications := []models.Notification{}
	if result := database.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&notifications); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func MarkNotificationRead(c *gin.Context) {
	id := c.Param("id")
	userID := uint(c.GetFloat64("user_id"))

	var notification models.Notification
	if result := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&notification); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
		return
	}

	notification.IsRead = true
	database.DB.Save(&notification)

	c.JSON(http.StatusOK, notification)
}

func CreateNotification(userID uint, message, notifType string) error {
	notification := models.Notification{
		UserID:  userID,
		Message: message,
		Type:    notifType,
	}
	return database.DB.Create(&notification).Error
}
