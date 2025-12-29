import {
  ChevronDown,
  ChevronRight,
  FileImage,
  FileText,
  Folder,
} from "lucide-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { useGetAllNodesQuery } from "../redux/features/fileSystem/fileSystem.api";
import {
  setContextMenu,
  setCurrentFolderId,
  setOpenFile,
  toggleFolderExpansion,
} from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FileNode } from "../types";

const Sidebar: FC = () => {
  const dispatch = useAppDispatch();
  const { currentFolderId, expandedFolders } = useAppSelector(
    (state) => state.filesystem,
  );
  const { data: nodes = [], isLoading } = useGetAllNodesQuery();

  const nodesMap = useMemo(() => {
    const map: Record<string, FileNode> = {};
    if (Array.isArray(nodes)) {
      nodes.forEach((node: FileNode) => (map[node._id] = node));
    }
    return map;
  }, [nodes]);

  const getChildren = useCallback(
    (nodeId: string): FileNode[] => {
      if (!Array.isArray(nodes)) return [];
      return nodes.filter((n: FileNode) => n.parentId === nodeId);
    },
    [nodes],
  );

  const renderTree = (nodeId: string, level = 0): ReactNode => {
    const node = nodesMap[nodeId];
    if (!node) return null;

    const isExpanded = expandedFolders.includes(nodeId);
    const isActive = currentFolderId === nodeId;
    const children = getChildren(nodeId);

    const handleClick = () => {
      if (node.type === "folder") {
        dispatch(setCurrentFolderId(nodeId));
      } else {
        dispatch(setOpenFile(node));
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(setContextMenu({ x: e.clientX, y: e.clientY, itemId: nodeId }));
    };

    const handleToggle = (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleFolderExpansion(nodeId));
    };

    return (
      <div key={nodeId}>
        <div
          className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-gray-100 ${
            isActive ? "bg-blue-100 font-medium text-blue-700" : "text-gray-700"
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          onContextMenu={handleContextMenu}
        >
          {node.type === "folder" ? (
            <button
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              onClick={handleToggle}
              className="rounded p-0.5 hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {node.type === "folder" ? (
            <Folder size={16} className="shrink-0 text-blue-500" />
          ) : node.type === "image" ? (
            <FileImage size={16} className="shrink-0 text-green-500" />
          ) : (
            <FileText size={16} className="shrink-0 text-gray-500" />
          )}

          <span className="truncate text-sm">{node.name}</span>
        </div>

        {node.type === "folder" &&
          isExpanded &&
          children.map((c) => renderTree(c._id, level + 1))}
      </div>
    );
  };

  const rootNodes = useMemo(() => {
    if (!Array.isArray(nodes)) return [];
    return nodes.filter((n: FileNode) => n.parentId === null);
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="flex h-full w-64 flex-col border-r bg-gray-50/50">
        <div className="border-b bg-white p-4">
          <h2 className="text-lg font-bold text-gray-900">Orbit Drive</h2>
        </div>
        <div className="p-4 text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/50">
      <div className="border-b bg-white p-4">
        <h2 className="text-lg font-bold text-gray-900">Orbit Drive</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rootNodes.length > 0 ? (
          rootNodes.map((n) => renderTree(n._id))
        ) : (
          <div className="p-4 text-center text-sm text-gray-400">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
