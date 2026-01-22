

##  Auth Service

### 1. Register 

- **Method:** `POST`
- **URL:** `/api/auth/register` 
- **Request Body:**

```json
{
  "username": "test",
  "email": "test@example.com",
  "password": "test1234"
}
```

- **Response (201 Created):**
```json
{
  "id": 1,
  "username": "test",
  "email": "test@example.com"
}
```

### 2. Login 

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Request Body:**

```json
{
  "username": "test",
  "password": "test1234"
}
```

- **Response (200 OK):**

```json
{
  "token": "sdffdgdfvfsvsdf",
  "user": {
    "id": 1,
    "username": "test"
  }
}
```

---

##  Kanban Service

**Send Header:** `Authorization: Bearer <token>`

### 1. Boards

#### 1.1 List Boards

- **Method:** `GET`
- **URL:** `/api/kanban/boards`

#### 1.2 Create Board 

- **Method:** `POST`
- **URL:** `/api/kanban/boards`
- **Request Body:** `{"name": "Test1"}`

#### 1.3 Board Details

- **Method:** `GET`
- **URL:** `/api/kanban/boards/:id`

#### 1.4 Invite Member

- **Method:** `POST`
- **URL:** `/api/kanban/boards/:id/invite`
- **Request Body:** `{"email": "friend@example.com"}`

---

### 2. Columns

#### 2.1 Create Column

- **Method:** `POST`
- **URL:** `/api/kanban/boards/:id/columns`
- **Request Body:** `{"name": "To Do", "position": 0}`

#### 2.2 Update Column

- **Method:** `PATCH`
- **URL:** `/api/kanban/columns/:id`
- **Request Body:** `{"name": "New Name"}`

#### 2.3 Delete Column

- **Method:** `DELETE`
- **URL:** `/api/kanban/columns/:id`

---

### 3. Tasks

#### 3.1 Create Task

- **Method:** `POST`
- **URL:** `/api/kanban/columns/:id/tasks`
- **Request Body:**

```json
{
  "title": "Task1",
  "description": "Description",
  "position": 0
}
```

#### 3.2 Update Task

- **Method:** `PATCH`
- **URL:** `/api/kanban/tasks/:id`
- **Request Body:** `{"title": "Updated Title", "description": "..."}`

#### 3.3 Move Task

- **Method:** `PATCH`
- **URL:** `/api/kanban/tasks/:id/move`
- **Request Body:**

```json
{
  "target_column_id": 2,
  "position": 1
}
```

---

### 4. Notifications

#### 4.1 List Notifications

- **Method:** `GET`
- **URL:** `/api/kanban/notifications`

#### 4.2 Mark as Read

- **Method:** `PATCH`
- **URL:** `/api/kanban/notifications/:id/read`
