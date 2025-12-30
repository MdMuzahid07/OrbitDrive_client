/* eslint-disable @next/next/no-img-element */
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateNodeMutation } from "../redux/features/fileSystem/fileSystem.api";
import { setOpenFile } from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const FileViewer = () => {
  const dispatch = useAppDispatch();
  const { openFile } = useAppSelector((state) => state.filesystem);
  const [updateNode] = useUpdateNodeMutation();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (openFile) setContent(openFile.content || "");
  }, [openFile]);

  if (!openFile) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNode({ id: openFile._id, content }).unwrap();
      dispatch(setOpenFile(null));
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save file");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    dispatch(setOpenFile(null));
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">{openFile.name}</h2>
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {openFile.type === "text" ? (
          <div className="px-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="rounded-0 h-96 w-full bg-slate-100 p-2 font-mono text-sm outline-none"
              placeholder="Type here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="m-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-10 flex justify-center">
            <img
              src={openFile.url || ""}
              alt={openFile.name}
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
