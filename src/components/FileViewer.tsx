/* eslint-disable @next/next/no-img-element */
import { FileImage, FileText, Save, X } from "lucide-react";
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    dispatch(setOpenFile(null));
  };

  return (
    <div className="bg-background/80 animate-in fade-in fixed inset-0 z-120 flex items-center justify-center p-4 backdrop-blur-md duration-300">
      <div className="animate-in zoom-in-95 relative w-full max-w-5xl duration-300">
        {/* Card Glow */}
        <div className="bg-cyber-gradient absolute inset-0 rounded-[2.5rem] opacity-10 blur-3xl" />

        <div className="bg-card/90 border-border relative flex flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-border bg-muted/50 flex items-center justify-between border-b px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-cyber-gradient shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg">
                {openFile.type === "image" ? (
                  <FileImage size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div>
                <h2 className="font-orbitron text-foreground text-xl font-black tracking-tighter uppercase">
                  {openFile.name}
                </h2>
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  Sector Access Protocol
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="group border-border bg-secondary text-foreground hover:bg-destructive/10 hover:text-destructive relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all"
              title="Close"
            >
              <X
                size={20}
                className="transition-transform group-hover:rotate-90"
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {openFile.type === "text" ? (
              <div className="space-y-6">
                <div className="group relative">
                  <div className="bg-cyber-gradient absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity group-focus-within:opacity-10" />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="focus:border-primary/50 focus:ring-primary/5 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:bg-background/80 relative min-h-[50vh] w-full rounded-2xl border p-6 font-mono text-sm transition-all outline-none focus:ring-4"
                    placeholder="Initialize data stream..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="group bg-cyber-gradient shadow-primary/20 relative flex items-center gap-3 overflow-hidden rounded-xl px-8 py-3 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Save
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5"
                    />
                    {isSaving ? "Syncing..." : "Apply Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="group border-border bg-muted/20 relative flex min-h-[50vh] items-center justify-center overflow-hidden rounded-2xl border p-4">
                <div className="bg-cyber-pattern absolute inset-0 opacity-5" />
                <img
                  src={openFile.url || ""}
                  alt={openFile.name}
                  className="relative z-10 max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="bg-cyber-radial-glow absolute inset-0 opacity-0 transition-opacity group-hover:opacity-40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
