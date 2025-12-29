import { FC } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

const Modal: FC<Props> = ({
  isOpen,
  title,
  value,
  onChange,
  onConfirm,
  onCancel,
  confirmText = "Create",
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
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter name..."
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!value.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
