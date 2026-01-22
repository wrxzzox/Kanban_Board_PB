package models

import (
	"time"

	"gorm.io/gorm"
)

type Board struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"not null" json:"name"`
	OwnerID   uint           `gorm:"not null" json:"owner_id"`
	Members   []BoardMember  `gorm:"foreignKey:BoardID;constraint:OnDelete:CASCADE;" json:"members,omitempty"`
	Columns   []Column       `gorm:"foreignKey:BoardID;constraint:OnDelete:CASCADE;" json:"columns,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type BoardMember struct {
	BoardID   uint      `gorm:"primaryKey" json:"board_id"`
	UserID    uint      `gorm:"primaryKey" json:"user_id"`
	Role      string    `gorm:"default:'member'" json:"role"`
	JoinedAt  time.Time `json:"joined_at"`
}

type Column struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	BoardID   uint           `gorm:"not null;index" json:"board_id"`
	Name      string         `gorm:"not null" json:"name"`
	Position  int            `gorm:"not null" json:"position"`
	Tasks     []Task         `gorm:"foreignKey:ColumnID;constraint:OnDelete:CASCADE;" json:"tasks,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Task struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	ColumnID    uint           `gorm:"not null;index" json:"column_id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	Position    int            `gorm:"not null" json:"position"`
	AssignedTo  uint           `json:"assigned_to"`
	Tags        string         `json:"tags"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
