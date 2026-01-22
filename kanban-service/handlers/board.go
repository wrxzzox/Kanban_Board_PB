package handlers

import (
	"kanban-service/database"
	"kanban-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBoards(c *gin.Context) {
	userID := c.GetFloat64("user_id") 
	uid := uint(userID)

	var boards []models.Board
	if result := database.DB.Distinct("boards.*").
		Joins("LEFT JOIN board_members ON board_members.board_id = boards.id").
		Where("boards.owner_id = ? OR board_members.user_id = ?", uid, uid).
		Find(&boards); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, boards)
}

type InviteInput struct {
	Email string `json:"email" binding:"required,email"`
}

func InviteUser(c *gin.Context) {
	boardID := c.Param("id")
	var input InviteInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := uint(c.GetFloat64("user_id"))

	var board models.Board
	if result := database.DB.First(&board, boardID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Board not found"})
		return
	}

	if board.OwnerID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only owner can invite members"})
		return
	}

	var targetUser models.User
	if result := database.DB.Where("email = ?", input.Email).First(&targetUser); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if targetUser.ID == board.OwnerID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is already the owner"})
		return
	}

	var existingMember models.BoardMember
	if result := database.DB.Where("board_id = ? AND user_id = ?", board.ID, targetUser.ID).First(&existingMember); result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is already a member"})
		return
	}

	member := models.BoardMember{
		BoardID: board.ID,
		UserID:  targetUser.ID,
		Role:    "member",
	}

	if result := database.DB.Create(&member); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to invite user"})
		return
	}

	CreateNotification(targetUser.ID, "You have been invited to board: "+board.Name, "invite")

	c.JSON(http.StatusOK, gin.H{"message": "User invited successfully"})
}

func CreateBoard(c *gin.Context) {
	var input models.Board
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := uint(c.GetFloat64("user_id"))
	input.OwnerID = userID

	if result := database.DB.Create(&input); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

func GetBoardDetails(c *gin.Context) {
	id := c.Param("id")
	var board models.Board

	if result := database.DB.Preload("Columns.Tasks").First(&board, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Board not found"})
		return
	}
	
	userID := uint(c.GetFloat64("user_id"))
	
	isMember := false
	if board.OwnerID == userID {
		isMember = true
	} else {
		var member models.BoardMember
		if result := database.DB.Where("board_id = ? AND user_id = ?", board.ID, userID).First(&member); result.Error == nil {
			isMember = true
		}
	}

	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, board)
}
