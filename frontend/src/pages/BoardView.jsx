import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import api from "../api/axios";
import Column from "../components/Column";
import { toast } from "react-toastify";

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/kanban/boards/${id}`);
      if (res.data.columns) {
        res.data.columns.sort((a, b) => a.position - b.position);
      }
      setBoard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    try {
      await api.patch(`/kanban/tasks/${draggableId}/move`, {
        target_column_id: parseInt(destination.droppableId),
        position: destination.index,
      });
      fetchBoard();
    } catch (err) {
      console.error("Move failed", err);
      toast.error("Failed to move task");
    }
  };

  const addColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName) {
      toast.warn("Please enter a column name");
      return;
    }
    try {
      await api.post(`/kanban/boards/${id}/columns`, {
        name: newColumnName,
        position: board.columns ? board.columns.length : 0,
      });
      setNewColumnName("");
      fetchBoard();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add column");
    }
  };

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.warn("Please enter an email");
      return;
    }
    try {
      await api.post(`/kanban/boards/${id}/invite`, { email: inviteEmail });
      toast.success("User invited successfully");
      setIsInviteModalOpen(false);
      setInviteEmail("");
    } catch (err) {
      toast.error(
        "Failed to invite user: " + (err.response?.data?.error || err.message),
      );
    }
  };

  if (!board)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {}
      <div className="bg-white/80 backdrop-blur-md shadow-sm z-10 border-b border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
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
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <h1 className="text-xl font-bold text-gray-800">{board.name}</h1>
            </div>
            <div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium transform active:scale-95"
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
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3.75 15.75A7.5 7.5 0 0013.5 15.75v0.018c0 .414.336.75.75.75s.75-.336.75-.75v-0.018a9 9 0 002.304-5.302"
                  />
                </svg>
                Invite Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {isInviteModalOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 transform scale-100 transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Invite to Board
            </h2>
            <form onSubmit={handleInvite}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all font-medium"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 items-start pb-4">
            {board.columns &&
              board.columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  boardId={id}
                  refreshBoard={fetchBoard}
                />
              ))}

            <div className="w-80 flex-shrink-0">
              <div className="bg-white/50 hover:bg-white/80 transition-all p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 group cursor-pointer">
                <form onSubmit={addColumn}>
                  <input
                    type="text"
                    className="w-full bg-transparent p-2 mb-2 font-medium placeholder-gray-500 focus:outline-none"
                    placeholder="+ Add another list"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                  />
                  {newColumnName && (
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                      Add List
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
