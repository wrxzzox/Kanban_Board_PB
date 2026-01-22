```mermaid
erDiagram
    USER ||--o{ BOARD : "owns"
    USER ||--o{ BOARD_MEMBER : "is member of"
    BOARD ||--o{ BOARD_MEMBER : "has members"
    BOARD ||--o{ COLUMN : "contains"
    COLUMN ||--o{ TASK : "contains"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ TASK : "is assigned to"

    USER {
        uint id PK
        string username
        string email
        string password
        time created_at
        time updated_at
    }

    BOARD {
        uint id PK
        string name
        uint owner_id FK
        time created_at
        time updated_at
    }

    BOARD_MEMBER {
        uint board_id PK, FK
        uint user_id PK, FK
        string role
        time joined_at
    }

    COLUMN {
        uint id PK
        uint board_id FK
        string name
        int position
        time created_at
        time updated_at
    }

    TASK {
        uint id PK
        uint column_id FK
        string title
        string description
        int position
        uint assigned_to FK
        string tags
        time created_at
        time updated_at
    }

    NOTIFICATION {
        uint id PK
        uint user_id FK
        string message
        string type
        boolean is_read
        time created_at
        time updated_at
    }
```

### Relationships:
1. **User & Board (Owner)**:1:N
2.  **User & Board (Membership)**:Many-to-Many
3.  **Board & Column**: 1:N
4.  **Column & Task**: 1:N
5.  **User & Task**:1:N
6.  **User & Notification**:1:N
