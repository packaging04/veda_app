import React from "react";
import { LovedOne } from "../../lib/types.ts";
import { Modal } from "./Modal.tsx";
import { Spinner } from "./Spinner.tsx";

interface DeleteModalProps {
  lovedOne: LovedOne;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  lovedOne,
  loading,
  onClose,
  onDelete,
}) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 className="text-lg font-semibold text-[#1a2332] mb-2">
        Delete {lovedOne.name}?
      </h4>
      <p className="text-[#1a2332]/60 mb-6">
        This action cannot be undone. All scheduled calls and recordings
        associated with this loved one will also be deleted.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ml-2">Deleting...</span>
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </Modal>
);
