/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDown,
  ChevronRight,
  FileImage,
  FileText,
  Folder,
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { useLogoutMutation } from "../redux/features/auth/auth.api";
import { logout as clearAuth } from "../redux/features/auth/auth.slice";
import { useGetAllNodesQuery } from "../redux/features/fileSystem/fileSystem.api";
import {
  setContextMenu,
  setCurrentFolderId,
  setOpenFile,
  toggleFolderExpansion,
} from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import SidebarSkeleton from "../skeleton/SidebarSkeleton";
import { FileNode } from "../types";

const Sidebar: FC = () => {
  const dispatch = useAppDispatch();
  const { currentFolderId, expandedFolders } = useAppSelector(
    (state) => state.filesystem,
  );
  const user = useAppSelector((state) => state.auth.user);
  const { data: nodes = [], isLoading } = useGetAllNodesQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearAuth());
    }
  };

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

    const handleContextMenu = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(setContextMenu({ x: e.clientX, y: e.clientY, itemId: nodeId }));
    };

    const handleToggle = (e: any) => {
      e.stopPropagation();
      dispatch(toggleFolderExpansion(nodeId));
    };

    return (
      <div key={nodeId} className="group/item">
        <div
          className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-200 ${
            isActive
              ? "bg-cyber-gradient text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
          style={{ marginLeft: `${level * 12}px` }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {node.type === "folder" ? (
            <button
              onClick={handleToggle}
              className={`rounded-md p-0.5 transition-colors ${isActive ? "text-white/70 hover:text-white" : "text-white/20 hover:text-white/40"}`}
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
            <Folder
              size={18}
              className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-cyber-blue"}`}
            />
          ) : node.type === "image" ? (
            <FileImage
              size={18}
              className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-emerald-400"}`}
            />
          ) : (
            <FileText
              size={18}
              className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-cyber-purple"}`}
            />
          )}

          <span className="truncate text-sm font-medium tracking-wide">
            {node.name}
          </span>
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
    return <SidebarSkeleton />;
  }

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Sidebar Header */}
      <div className="px-6 py-8">
        <div className="group flex items-center gap-3">
          <div className="relative">
            <div className="bg-cyber-gradient absolute inset-0 rounded-xl opacity-40 blur-lg transition-opacity group-hover:opacity-60" />
            <div className="bg-cyber-gradient shadow-cyber-purple/20 relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xl">
              <Image
                src="/images/OrbitDrive_logo-300x300.png"
                alt="OrbitDrive Logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
            </div>
          </div>
          <h2 className="font-orbitron text-xl font-black tracking-tighter text-white uppercase">
            Orbit<span className="text-cyber-blue">Drive</span>
          </h2>
        </div>
      </div>

      {/* Tree Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4">
        <div className="mb-4">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
            Storage Explorer
          </p>
          <div className="space-y-1">
            {rootNodes.length > 0 ? (
              rootNodes.map((n) => renderTree(n._id))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/5 bg-white/2 px-3 py-8 text-center">
                <p className="text-xs font-medium text-white/20">
                  No elements discovered
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="mt-auto p-4">
        <div className="group/user relative items-center gap-3 rounded-4xl border border-white/5 bg-white/3 p-4 backdrop-blur-xl transition-all hover:bg-white/6">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative">
              <div className="bg-cyber-gradient absolute inset-0 rounded-full opacity-0 blur transition-opacity group-hover/user:opacity-40" />
              <div className="bg-cyber-surface relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white shadow-inner">
                <UserIcon size={18} />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold tracking-tight text-white">
                {user?.name || "Guest User"}
              </p>
              <p className="truncate text-[10px] font-medium tracking-wider text-white/30 uppercase">
                User Profile
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin text-white/50" />
            ) : (
              <>
                <LogOut
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="tracking-widest uppercase">Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
