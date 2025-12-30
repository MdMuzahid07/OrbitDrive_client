import { FC } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  value?: string;
  onChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isConfirmation?: boolean;
}

const Modal: FC<Props> = ({
  isOpen,
  title,
  value = "",
  onChange,
  onConfirm,
  onCancel,
  confirmText = "Create",
  isConfirmation = false,
}) => {
  if (!isOpen) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        {!isConfirmation && onChange && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter name..."
            className="mb-4 w-full rounded-full border px-3 py-2 outline-none"
            autoFocus
          />
        )}
        {isConfirmation && (
          <p className="mb-4 text-gray-600">
            Are you sure you want to proceed? This action cannot be undone.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmation && !value.trim()}
            className={`rounded-full px-4 py-2 text-white disabled:opacity-50 ${
              isConfirmation
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
