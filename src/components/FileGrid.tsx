import { FileImage, FileText, Folder } from "lucide-react";
import { FC, useMemo } from "react";
import { useGetAllNodesQuery } from "../redux/features/fileSystem/fileSystem.api";
import {
  setContextMenu,
  setCurrentFolderId,
  setOpenFile,
  toggleFolderExpansion,
} from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FileNode } from "../types";
import { Skeleton } from "./ui/skeleton";

const FileGrid: FC = () => {
  const dispatch = useAppDispatch();
  const { currentFolderId, expandedFolders } = useAppSelector(
    (state) => state.filesystem,
  );
  const { data: nodes = [], isLoading } = useGetAllNodesQuery();

  const currentChildren = useMemo(() => {
    if (!Array.isArray(nodes)) return [];

    return nodes.filter((node: FileNode) => {
      if (currentFolderId === "root") {
        return node.parentId === null;
      }
      return node.parentId === currentFolderId;
    });
  }, [nodes, currentFolderId]);

  const handleItemClick = (item: FileNode) => {
    if (item.type === "folder") {
      dispatch(setCurrentFolderId(item._id));
      if (!expandedFolders.includes(item._id)) {
        dispatch(toggleFolderExpansion(item._id));
      }
    } else {
      dispatch(setOpenFile(item));
    }
  };

  const handleContextMenu = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setContextMenu({ x: e.clientX, y: e.clientY, itemId: itemId || null }),
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full flex-wrap gap-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-12 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (currentChildren.length === 0) {
    return (
      <div
        className="flex min-h-full w-full flex-col items-center justify-center text-gray-400"
        onContextMenu={handleContextMenu}
      >
        <Folder size={64} className="mb-4 opacity-50" />
        <p className="text-lg">Empty folder</p>
        <p className="mt-2 text-sm">Right-click to create items</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-full flex-wrap gap-10"
      onContextMenu={handleContextMenu}
    >
      {currentChildren.map((item: FileNode) => (
        <div
          key={item._id}
          className="h-fit w-fit cursor-pointer"
          onClick={() => handleItemClick(item)}
          onContextMenu={(e) => handleContextMenu(e, item._id)}
        >
          <div className="flex flex-col items-center gap-2">
            {item.type === "folder" ? (
              <Folder size={48} className="text-blue-500" />
            ) : item.type === "image" ? (
              <FileImage size={48} className="text-green-600" />
            ) : (
              <FileText size={48} className="text-gray-600" />
            )}

            <span className="w-full truncate text-center text-sm font-medium">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
