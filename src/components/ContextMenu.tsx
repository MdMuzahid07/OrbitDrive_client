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
      className="fixed z-50 min-w-45 rounded-lg border bg-white py-2 shadow-lg"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {!contextMenu.itemId ? (
        <>
          <button
            onClick={onCreateFolder}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            <Folder size={16} />
            New Folder
          </button>
          <button
            onClick={onCreateText}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            <FileText size={16} />
            New Text File
          </button>
          <hr className="my-1" />
          <button
            onClick={onUpload}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            <Upload size={16} />
            Upload Files
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onRename}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
