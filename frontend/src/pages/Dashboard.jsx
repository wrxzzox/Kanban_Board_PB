import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../api/axios";
import NotificationBell from "../components/NotificationBell";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");

  const fetchBoards = async () => {
    try {
      const res = await api.get("/kanban/boards");
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName) {
      toast.warn("Please enter a board name");
      return;
    }
    try {
      await api.post("/kanban/boards", { name: newBoardName });
      setNewBoardName("");
      toast.success("Board created!");
      fetchBoards();
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to create board: " + (err.response?.data?.error || err.message),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            My Boards
          </h1>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <button
              className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl hover:bg-red-100 hover:shadow-md transition-all font-medium flex items-center gap-2"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Create New Board
          </h2>
          <form onSubmit={createBoard} className="flex gap-4">
            <input
              type="text"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              placeholder="e.g., Marketing Campaign Q4"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold">
              Create Board
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="group block p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-transparent hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors"></div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10 group-hover:text-blue-600 transition-colors">
                {board.name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 relative z-10">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0h18M5.25 11.25h15M9 17.25c.312 0 .624.031.92.09"
                  />
                </svg>
                {new Date(board.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}

          {boards.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              <div className="mb-4 bg-gray-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-lg">No boards yet. Create one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
