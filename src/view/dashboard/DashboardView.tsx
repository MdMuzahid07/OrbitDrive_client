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
import { FC, useEffect, useRef, useState } from "react";

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
      alert(error?.data?.message || "Failed to create item");
    }
  };

  const handleRename = async () => {
    if (!itemName.trim() || !renameId) return;

    try {
      await updateNode({ id: renameId, name: itemName.trim() }).unwrap();
      closeModal();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to rename item");
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
      alert(error?.data?.message || "Failed to delete item");
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Ensure parentId is "root" when at root level
    const parentId = currentFolderId || "root";

    try {
      await uploadFiles({ files: Array.from(files), parentId }).unwrap();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      alert(error?.data?.message || "Failed to upload files");
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
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive animated */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full border-r bg-gray-50 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:w-0 lg:border-r-0"
        } lg:overflow-hidden`}
      >
        <div className="h-full w-64">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300">
        <Breadcrumbs sidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="container mx-auto flex-1 overflow-auto pt-4 md:pt-6">
          <FileGrid />
        </div>
      </div>

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
        accept="image/*,text/plain"
        onChange={handleFileChange}
        className="hidden"
      />

      {(isCreating || isDeleting || isUploading) && (
        <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="rounded-lg bg-white px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm font-medium text-gray-700">
                {isCreating && "Creating..."}
                {isDeleting && "Deleting..."}
                {isUploading && "Uploading..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
