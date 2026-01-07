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
            <Skeleton className="bg-secondary/50 h-24 w-full rounded-3xl" />
            <Skeleton className="bg-secondary/50 h-4 w-2/3 rounded-full" />
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
          <div className="border-border bg-card/50 relative flex h-32 w-32 items-center justify-center rounded-3xl border shadow-2xl">
            <Folder size={64} className="text-muted-foreground/20" />
          </div>
        </div>
        <h3 className="text-muted-foreground/50 text-xl font-black tracking-tight uppercase">
          This folder is empty
        </h3>
        <p className="text-muted-foreground/40 mt-2 text-sm font-medium">
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
          className="group border-border bg-card/50 hover:bg-accent/50 hover:shadow-primary/5 relative h-full cursor-pointer rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
                  className="text-emerald-500 transition-transform group-hover:scale-110"
                />
              ) : (
                <FileText
                  size={48}
                  className="text-primary transition-transform group-hover:scale-110"
                />
              )}
            </div>

            <span className="text-muted-foreground group-hover:text-foreground w-full truncate text-center text-xs font-bold tracking-tight transition-colors">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
