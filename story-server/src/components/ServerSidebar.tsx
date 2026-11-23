import type { ReactNode } from "react";

type ServerSidebarProps = {
  name: string;
  description: string;
  children: ReactNode;
};

function ServerSidebar({
  name,
  description,
  children,
}: ServerSidebarProps) {
  return (
    <aside className="channel-sidebar" aria-label="Server navigation">
      <header className="server-heading">
        <h1>{name}</h1>
        <p>{description}</p>
      </header>

      {children}

      <div className="reader-profile">
        <div className="avatar reader-avatar" aria-hidden="true">
          Y
        </div>

        <div>
          <p className="reader-name">You</p>
          <p className="reader-status">Exploring the story</p>
        </div>
      </div>
    </aside>
  );
}

export default ServerSidebar;