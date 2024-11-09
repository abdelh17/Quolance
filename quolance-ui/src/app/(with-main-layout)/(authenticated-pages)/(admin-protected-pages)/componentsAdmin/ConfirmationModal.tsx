import React from "react";

interface ConfirmationModalProps {
  status: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ status, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        className="bg-white rounded-lg p-6 shadow-lg w-1/3"
        style={{
          position: "absolute",
          top: "10%",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Status Change</h2>
        <p>Are you sure you want to change the status to <strong>{status}</strong>?</p>
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="border rounded px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="border rounded px-4 py-2 bg-red-300 hover:bg-red-400 text-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
