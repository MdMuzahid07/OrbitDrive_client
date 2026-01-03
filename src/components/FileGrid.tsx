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
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <Skeleton className="h-24 w-full rounded-3xl bg-white/3" />
            <Skeleton className="h-4 w-2/3 rounded-full bg-white/3" />
          </div>
        ))}
      </div>
    );
  }

  if (currentChildren.length === 0) {
    return (
      <div
        className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center"
        onContextMenu={handleContextMenu}
      >
        <div className="relative mb-8">
          <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-full opacity-10 blur-3xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/5 bg-white/2 shadow-2xl">
            <Folder size={64} className="text-white/10" />
          </div>
        </div>
        <h3 className="text-xl font-black tracking-tight text-white/40 uppercase">
          This folder is empty
        </h3>
        <p className="mt-2 text-sm font-medium text-white/20">
          Right-click anywhere to create new items
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
      onContextMenu={handleContextMenu}
    >
      {currentChildren.map((item: FileNode) => (
        <div
          key={item._id}
          className="group relative h-full cursor-pointer rounded-3xl border border-white/5 bg-white/2 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/6 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]"
          onClick={() => handleItemClick(item)}
          onContextMenu={(e) => handleContextMenu(e, item._id)}
        >
          {/* Item Glow Effect */}
          <div className="bg-cyber-gradient absolute inset-0 rounded-3xl opacity-0 blur-xl transition-opacity group-hover:opacity-10" />

          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className={`absolute inset-0 opacity-0 blur-lg transition-opacity group-hover:opacity-40 ${item.type === "folder" ? "bg-cyber-blue" : item.type === "image" ? "bg-emerald-400" : "bg-cyber-purple"}`}
              />
              {item.type === "folder" ? (
                <Folder
                  size={48}
                  className="text-cyber-blue transition-transform group-hover:scale-110"
                />
              ) : item.type === "image" ? (
                <FileImage
                  size={48}
                  className="text-emerald-400 transition-transform group-hover:scale-110"
                />
              ) : (
                <FileText
                  size={48}
                  className="text-cyber-purple transition-transform group-hover:scale-110"
                />
              )}
            </div>

            <span className="w-full truncate text-center text-xs font-bold tracking-tight text-white/50 transition-colors group-hover:text-white">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
