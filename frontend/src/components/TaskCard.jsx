import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 group hover:border-blue-300 transition-all ${
            snapshot.isDragging
              ? "shadow-lg rotate-2 ring-2 ring-blue-500/20 z-50"
              : "hover:shadow-md"
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-800 text-sm leading-snug group-hover:text-blue-700 transition-colors">
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1">
              {/* Placeholder for user avatar if assigned */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-[8px] text-white font-bold">
                U
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
              #{task.id}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
