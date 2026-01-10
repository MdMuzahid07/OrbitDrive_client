import { ChevronRight, Home, Menu } from "lucide-react";
import { Fragment } from "react";
import { useGetBreadcrumbsQuery } from "../redux/features/fileSystem/fileSystem.api";
import { setCurrentFolderId } from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Breadcrumbs = ({ sidebarToggle }: { sidebarToggle: () => void }) => {
  const dispatch = useAppDispatch();
  const { currentFolderId } = useAppSelector((state) => state.filesystem);

  const { data: breadcrumbs = [] } = useGetBreadcrumbsQuery(currentFolderId, {
    skip: currentFolderId === "root",
  });

  const handleClick = (folderId: string) => {
    dispatch(setCurrentFolderId(folderId));
  };

  return (
    <header className="bg-background/80 border-border/40 sticky top-0 z-50 flex h-20 items-center border-b px-6 backdrop-blur-xl">
      {/* Sidebar Toggle */}
      <button
        onClick={sidebarToggle}
        className="group relative mr-6"
        title="Toggle Sidebar"
      >
        <div className="bg-cyber-gradient absolute inset-0 rounded-xl opacity-0 blur transition-opacity group-hover:opacity-40" />
        <div className="text-primary border-border/40 bg-accent/40 hover:bg-accent/60 relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all">
          <Menu size={20} />
        </div>
      </button>

      {/* Breadcrumb Navigation */}
      <nav className="no-scrollbar flex flex-1 items-center gap-3 overflow-x-auto">
        <button
          onClick={() => handleClick("root")}
          className="group hover:bg-accent/40 relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all"
        >
          <div
            className={`bg-cyber-gradient absolute inset-0 rounded-xl opacity-0 blur transition-opacity ${currentFolderId === "root" ? "opacity-20" : "group-hover:opacity-10"}`}
          />
          <Home
            size={18}
            className={`transition-colors ${currentFolderId === "root" ? "text-cyber-blue" : "text-muted-foreground group-hover:text-foreground"}`}
          />
        </button>

        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-3">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb._id}>
                <ChevronRight
                  size={14}
                  className="text-muted-foreground/40 shrink-0 ring-blue-500"
                />
                <button
                  onClick={() => handleClick(crumb._id)}
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-bold tracking-tight whitespace-nowrap transition-all ${
                    index === breadcrumbs.length - 1
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  {crumb.name}
                </button>
              </Fragment>
            ))}
          </div>
        )}
      </nav>

      {/* Right side actions - Space for future features like Search/Upload */}
      <div className="ml-4 flex items-center gap-4">
        {/* Placeholder for future top-bar tools */}
      </div>
    </header>
  );
};

export default Breadcrumbs;
