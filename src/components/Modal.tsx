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
    <div className="bg-cyber-bg/60 animate-in fade-in fixed inset-0 z-110 flex items-center justify-center p-4 backdrop-blur-md duration-300">
      <div className="animate-in zoom-in-95 relative w-full max-w-md duration-300">
        {/* Card Glow */}
        <div className="bg-cyber-gradient absolute inset-0 rounded-[2.5rem] opacity-10 blur-2xl" />

        <div className="glass-surface relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="border-b border-white/5 bg-white/2 px-8 py-6">
            <h3 className="text-xl font-black tracking-tighter text-white uppercase">
              {title}
            </h3>
          </div>

          <div className="px-8 py-8">
            {!isConfirmation && onChange && (
              <div className="space-y-4">
                <label className="ml-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter name..."
                  className="focus:border-cyber-purple/50 focus:ring-cyber-purple/10 w-full rounded-2xl border border-white/5 bg-white/3 px-6 py-4 text-white transition-all outline-none placeholder:text-white/20 focus:bg-white/6 focus:ring-4"
                  autoFocus
                />
              </div>
            )}
            {isConfirmation && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                  <span className="text-2xl font-bold">!</span>
                </div>
                <p className="px-4 text-sm leading-relaxed font-medium text-white/40">
                  Are you sure you want to proceed? This action cannot be undone
                  and will permanently apply the changes.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/5 bg-white/2 px-8 py-6">
            <button
              onClick={onCancel}
              className="rounded-xl px-6 py-2.5 text-xs font-bold tracking-widest text-white/40 uppercase transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmation && !value.trim()}
              className={`relative overflow-hidden rounded-xl px-8 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all active:scale-[0.98] disabled:opacity-50 ${
                isConfirmation
                  ? "bg-red-500/80 shadow-lg shadow-red-500/20 hover:bg-red-500"
                  : "bg-cyber-gradient shadow-cyber-purple/20 shadow-lg hover:scale-[1.02]"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
