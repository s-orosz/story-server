import { useState } from "react";
import ServerSidebar from "./components/ServerSidebar";
import ChannelList from "./components/ChannelList";
import MessageFeed from "./components/MessageFeed";
import ProfilePanel from "./components/ProfilePanel";
import {
  channels,
  characters,
  messages,
} from "./story/storyData";
import {
  getActiveChannel,
  getChannelMessages,
} from "./story/storyEngine";
import AvatarEditor from "./avatar/AvatarEditor";
import { createEmptyAvatar } from "./avatar/types"
import "./App.css";

function App() {
  const [activeChannelId, setActiveChannelId] = useState("welcome");

  const activeChannel = getActiveChannel(
    channels,
    activeChannelId,
  );
  
  const visibleMessages = getChannelMessages(
    messages,
    activeChannel.id,
  );

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [avatarDocument, setAvatarDocument] = useState(createEmptyAvatar);

  if (isAvatarEditorOpen) {
    return (
      <div className="avatar-editor-screen">
        <button
          type="button"
          className="avatar-editor-toggle"
          onClick={() => setIsAvatarEditorOpen(false)}
        >
          Back to server
        </button>
  
        <AvatarEditor
          document={avatarDocument}
          onChange={setAvatarDocument}
        />
      </div>
    );
  }

  return (
    <div className="server-app">
      <nav className="server-rail" aria-label="Servers">
        <button
          className="server-icon"
          type="button"
          aria-label="The Quiet Room server"
          aria-current="true"
        >
          QR
        </button>

        <span className="rail-divider" aria-hidden="true" />
        <span className="rail-caption">A story</span>
      </nav>

      <ServerSidebar
        name="The Quiet Room"
        description="A place for unfinished conversations."
      >
        <ChannelList
          channels={channels}
          activeChannelId={activeChannel.id}
          onSelectChannel={setActiveChannelId}
        />
      </ServerSidebar>

      <main className="conversation">
        <header className="conversation-header">
          <h2 id="channel-title">
            <span aria-hidden="true"># </span>
            {activeChannel.name}
          </h2>
          <p>{activeChannel.description}</p>
        </header>

        <MessageFeed
          key={activeChannel.id}
          channel={activeChannel}
          messages={visibleMessages}
          characters={characters}
        />

        <footer className="conversation-footer">
          <p>
            You’re reading an archived conversation. Explore another channel
            to continue.
          </p>

          <button
            type="button"
            className="avatar-editor-toggle"
            onClick={() => setIsAvatarEditorOpen(true)}
          >
            Create your avatar
          </button>
        </footer>
        
      </main>

      <ProfilePanel characters={characters} />

    </div>
  );
}

export default App;