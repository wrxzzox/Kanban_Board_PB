import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import api from "../api/axios";

export default function Column({ column, boardId, refreshBoard }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      await api.post(`/kanban/columns/${column.id}/tasks`, {
        title: newTaskTitle,
        position: column.tasks ? column.tasks.length : 0,
        column_id: column.id,
      });
      setNewTaskTitle("");
      setIsAdding(false);
      refreshBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteColumn = async () => {
    if (!window.confirm("Delete this column?")) return;
    try {
      await api.delete(`/kanban/columns/${column.id}`);
      refreshBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.name);

  React.useEffect(() => {
    setTitle(column.name);
  }, [column.name]);

  const updateTitle = async () => {
    if (title === column.name) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await api.patch(`/kanban/columns/${column.id}`, { name: title });
      setIsEditingTitle(false);
      refreshBoard();
    } catch (err) {
      console.error(err);
      setTitle(column.name);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateTitle();
    }
  };

  return (
    <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl w-80 flex-shrink-0 flex flex-col max-h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Column Header */}
      <div className="p-4 flex justify-between items-start group">
        <div className="flex-1 min-w-0 mr-2">
          {isEditingTitle ? (
            <input
              type="text"
              className="w-full bg-white border border-blue-500 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={updateTitle}
              onKeyDown={handleTitleKeyDown}
              autoFocus
            />
          ) : (
            <h3
              className="font-semibold text-gray-700 text-sm uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors truncate"
              onClick={() => setIsEditingTitle(true)}
              title={column.name}
            >
              {column.name}{" "}
              <span className="text-gray-400 ml-2 font-normal lowercase text-xs">
                ({column.tasks?.length})
              </span>
            </h3>
          )}
        </div>
        <button
          onClick={deleteColumn}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Task List */}
      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 pb-3 min-h-[100px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? "bg-blue-50/50" : ""}`}
          >
            <div className="flex flex-col gap-3">
              {column.tasks &&
                column.tasks
                  .sort((a, b) => a.position - b.position)
                  .map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Footer */}
      <div className="p-3 pt-0">
        {isAdding ? (
          <form
            onSubmit={addTask}
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
          >
            <input
              autoFocus
              type="text"
              className="w-full text-sm mb-3 focus:outline-none placeholder-gray-400 resize-none font-medium text-gray-700"
              placeholder="Enter a title for this card..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors px-2 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
