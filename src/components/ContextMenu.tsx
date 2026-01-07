import { FileText, Folder, Upload } from "lucide-react";
import { FC } from "react";
import { useAppSelector } from "../redux/hooks";

interface Props {
  onCreateFolder: () => void;
  onCreateText: () => void;
  onUpload: () => void;
  onRename: () => void;
  onDelete: () => void;
}

const ContextMenu: FC<Props> = ({
  onCreateFolder,
  onCreateText,
  onUpload,
  onRename,
  onDelete,
}) => {
  const { contextMenu } = useAppSelector((state) => state.filesystem);

  if (!contextMenu) return null;

  return (
    <div
      className="border-border bg-popover text-popover-foreground animate-in zoom-in-95 fixed z-50 min-w-45 rounded-lg border py-2 shadow-lg duration-200"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {!contextMenu.itemId ? (
        <>
          <button
            onClick={onCreateFolder}
            className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors"
          >
            <Folder size={16} />
            New Folder
          </button>
          <button
            onClick={onCreateText}
            className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors"
          >
            <FileText size={16} />
            New Text File
          </button>
          <hr className="border-border my-1" />
          <button
            onClick={onUpload}
            className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors"
          >
            <Upload size={16} />
            Upload Files
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onRename}
            className="hover:bg-accent hover:text-accent-foreground w-full px-4 py-2 text-left text-sm transition-colors"
          >
            Rename
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
