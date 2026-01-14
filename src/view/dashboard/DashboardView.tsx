/* eslint-disable @typescript-eslint/no-explicit-any */
import Breadcrumbs from "@/components/Breadcrumbs";
import ContextMenu from "@/components/ContextMenu";
import FileGrid from "@/components/FileGrid";
import FileViewer from "@/components/FileViewer";
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";
import {
  useCreateNodeMutation,
  useDeleteNodeMutation,
  useUpdateNodeMutation,
  useUploadFilesMutation,
} from "@/redux/features/fileSystem/fileSystem.api";
import { setContextMenu } from "@/redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DashboardView: FC = () => {
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentFolderId, contextMenu } = useAppSelector(
    (state) => state.filesystem,
  );

  const [createNode, { isLoading: isCreating }] = useCreateNodeMutation();
  const [updateNode] = useUpdateNodeMutation();
  const [deleteNode, { isLoading: isDeleting }] = useDeleteNodeMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: "folder" | "text" | "" | "delete";
    itemId?: string;
  }>({
    isOpen: false,
    title: "",
    type: "",
  });
  const [itemName, setItemName] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => dispatch(setContextMenu(null));
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dispatch]);

  const openModal = (title: string, type: "folder" | "text") => {
    setModalState({ isOpen: true, title, type });
    setItemName("");
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", type: "", itemId: undefined });
    setItemName("");
    setRenameId(null);
  };

  const handleCreate = async () => {
    if (!itemName.trim()) return;

    try {
      // Ensure parentId is always "root" when at root level
      const parentId = currentFolderId || "root";

      await createNode({
        name: itemName.trim(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        type: modalState.type || "folder",
        parentId: parentId,
        content: modalState.type === "text" ? "" : undefined,
      }).unwrap();

      closeModal();
    } catch (error: any) {
      toast.error("Creation Failed", {
        description: error?.data?.message || "Failed to create item",
      });
    }
  };

  const handleRename = async () => {
    if (!itemName.trim() || !renameId) return;

    try {
      await updateNode({ id: renameId, name: itemName.trim() }).unwrap();
      closeModal();
    } catch (error: any) {
      toast.error("Rename Failed", {
        description: error?.data?.message || "Failed to rename item",
      });
    }
  };

  const handleDeleteClick = () => {
    if (!contextMenu?.itemId) return;
    setModalState({
      isOpen: true,
      title: "Delete Item",
      type: "delete",
      itemId: contextMenu.itemId,
    });
    dispatch(setContextMenu(null));
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.itemId) return;

    try {
      await deleteNode(modalState.itemId).unwrap();
      closeModal();
    } catch (error: any) {
      toast.error("Delete Failed", {
        description: error?.data?.message || "Failed to delete item",
      });
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Client-side validation
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED_EXTENSIONS = new Set([
      // Images
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "svg",
      "bmp",
      "tiff",
      // Text & Code
      "txt",
      "csv",
      "html",
      "css",
      "js",
      "json",
      "xml",
      // Documents
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "rtf",
      // Audio
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "aac",
      "webm",
      // Video
      "mp4",
      "webm",
      "mov",
      "avi",
      "mkv",
      // Archives
      "zip",
      "rar",
      "7z",
      "gz",
      "tar",
    ]);

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (file.size > MAX_SIZE) {
        invalidFiles.push(`${file.name} (Too large > 15MB)`);
      } else if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
        invalidFiles.push(`${file.name} (Invalid type)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error("Files Rejected", {
        description: invalidFiles.join("\n"),
        duration: 5000,
      });
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      if (validFiles.length === 0) return;
    }

    // Ensure parentId is "root" when at root level
    const parentId = currentFolderId || "root";

    try {
      await uploadFiles({ files: validFiles, parentId }).unwrap();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error("Upload Failed", {
        description: error?.data?.message || "Failed to upload files",
      });
    }
  };

  const handleContextMenuActions = {
    onCreateFolder: () => {
      dispatch(setContextMenu(null));
      openModal("Create New Folder", "folder");
    },
    onCreateText: () => {
      dispatch(setContextMenu(null));
      openModal("Create New Text File", "text");
    },
    onUpload: () => {
      dispatch(setContextMenu(null));
      handleUpload();
    },
    onRename: () => {
      if (contextMenu?.itemId) {
        setRenameId(contextMenu.itemId);
        openModal("Rename Item", "" as any);
      }
      dispatch(setContextMenu(null));
    },
    onDelete: () => {
      handleDeleteClick();
    },
  };

  return (
    <div className="bg-cyber-bg selection:bg-cyber-blue/30 relative flex h-screen w-full overflow-hidden font-sans selection:text-white">
      {/* Background Pattern & Glow */}
      <div className="bg-cyber-pattern absolute inset-0 opacity-50" />
      <div className="bg-cyber-radial-glow absolute inset-0 opacity-60" />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive animated */}
      <aside
        className={`fixed inset-y-0 left-0 z-70 h-full shadow-2xl transition-all duration-500 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
          sidebarOpen
            ? "w-72 translate-x-0"
            : "w-72 -translate-x-full lg:pointer-events-none lg:w-0 lg:opacity-0"
        }`}
      >
        <div className="glass-surface h-full w-full border-r border-white/5">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="relative flex flex-1 flex-col overflow-hidden"
        onContextMenu={(e) => {
          e.preventDefault();
          dispatch(
            setContextMenu({ x: e.clientX, y: e.clientY, itemId: null }),
          );
        }}
      >
        <Breadcrumbs sidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="container mx-auto h-full overflow-auto px-4 py-6 md:px-8">
          <div className="relative min-h-full">
            <FileGrid />
          </div>
        </div>
      </main>

      {/* Overlays & Modals */}
      <ContextMenu {...handleContextMenuActions} />
      <FileViewer />
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        value={itemName}
        onChange={setItemName}
        onConfirm={
          modalState.type === "delete"
            ? handleDeleteConfirm
            : renameId
              ? handleRename
              : handleCreate
        }
        onCancel={closeModal}
        confirmText={
          modalState.type === "delete"
            ? "Delete"
            : renameId
              ? "Rename"
              : "Create"
        }
        isConfirmation={modalState.type === "delete"}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Global Loading State */}
      {(isCreating || isDeleting || isUploading) && (
        <div className="bg-cyber-bg/40 animate-in fade-in fixed inset-0 z-100 flex items-center justify-center backdrop-blur-md duration-300">
          <div className="group relative">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40" />
            <div className="glass-surface relative flex flex-col items-center gap-4 rounded-3xl border border-white/10 p-8 shadow-2xl">
              <div className="relative">
                <Loader2 className="text-cyber-blue h-10 w-10 animate-spin" />
                <div className="border-cyber-blue/30 absolute inset-0 animate-ping rounded-full border" />
              </div>
              <span className="text-sm font-bold tracking-widest text-white/50 uppercase">
                {isCreating && "Creating Node..."}
                {isDeleting && "Removing Data..."}
                {isUploading && "Syncing Files..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
