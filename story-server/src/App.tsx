import { useState } from "react";
import "./App.css";

type Channel = {
  id: string;
  name: string;
  description: string;
};

type Character = {
  id: string;
  name: string;
  initials: string;
  role: string;
};

type Message = {
  id: string;
  channelId: string;
  authorId: string;
  time: string;
  text: string;
};

const channels: Channel[] = [
  {
    id: "welcome",
    name: "welcome",
    description: "Every story starts somewhere.",
  },
  {
    id: "general",
    name: "general",
    description: "The conversation never quite ends.",
  },
  {
    id: "archive",
    name: "archive",
    description: "Things someone thought were worth keeping.",
  },
];

const characters: Character[] = [
  {
    id: "mara",
    name: "Mara",
    initials: "MA",
    role: "Server owner",
  },
  {
    id: "eli",
    name: "Eli",
    initials: "EL",
    role: "Member",
  },
  {
    id: "jun",
    name: "Jun",
    initials: "JU",
    role: "Archivist",
  },
];

const messages: Message[] = [
  {
    id: "welcome-1",
    channelId: "welcome",
    authorId: "mara",
    time: "8:42 PM",
    text: "You found the server. I wasn't sure you would.",
  },
  {
    id: "welcome-2",
    channelId: "welcome",
    authorId: "mara",
    time: "8:43 PM",
    text: "Take a look around. The old conversations are still here.",
  },
  {
    id: "welcome-3",
    channelId: "welcome",
    authorId: "jun",
    time: "8:46 PM",
    text: "Start with general. The archive will make more sense afterward.",
  },
  {
    id: "general-1",
    channelId: "general",
    authorId: "eli",
    time: "7:12 PM",
    text: "Did anyone else hear the recording?",
  },
  {
    id: "general-2",
    channelId: "general",
    authorId: "mara",
    time: "7:14 PM",
    text: "Which recording?",
  },
  {
    id: "general-3",
    channelId: "general",
    authorId: "eli",
    time: "7:15 PM",
    text: "The one that wasn't there yesterday.",
  },
  {
    id: "archive-1",
    channelId: "archive",
    authorId: "jun",
    time: "6:03 PM",
    text: "Archive index updated. Please don't rename anything.",
  },
  {
    id: "archive-2",
    channelId: "archive",
    authorId: "jun",
    time: "6:04 PM",
    text: "Especially the file labeled November.",
  },
];

function App() {
  const [activeChannelId, setActiveChannelId] = useState("welcome");

  const activeChannel =
    channels.find((channel) => channel.id === activeChannelId) ??
    channels[0];

  const visibleMessages = messages.filter(
    (message) => message.channelId === activeChannel.id,
  );

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

      <aside className="channel-sidebar" aria-label="Server navigation">
        <header className="server-heading">
          <h1>The Quiet Room</h1>
          <p>A place for unfinished conversations.</p>
        </header>

        <nav className="channel-navigation" aria-label="Story channels">
          <h2 className="section-label">Text channels</h2>

          <ul className="channel-list">
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  type="button"
                  className={`channel-button ${
                    channel.id === activeChannelId ? "is-active" : ""
                  }`}
                  aria-current={
                    channel.id === activeChannelId ? "page" : undefined
                  }
                  onClick={() => setActiveChannelId(channel.id)}
                >
                  <span className="channel-hash" aria-hidden="true">
                    #
                  </span>
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

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

      <main className="conversation">
        <header className="conversation-header">
          <h2 id="channel-title">
            <span aria-hidden="true"># </span>
            {activeChannel.name}
          </h2>
          <p>{activeChannel.description}</p>
        </header>

        <section
          className="message-feed"
          aria-labelledby="channel-title"
          tabIndex={0}
          key={activeChannel.id}
        >
          <div className="channel-introduction">
            <div className="intro-symbol" aria-hidden="true">
              #
            </div>
            <h3>Welcome to #{activeChannel.name}</h3>
            <p>This is the beginning of this conversation.</p>
          </div>

          <div className="story-divider">
            <span>Previously in The Quiet Room</span>
          </div>

          <ol className="message-list">
            {visibleMessages.map((message) => {
              const author = characters.find(
                (character) => character.id === message.authorId,
              );

              if (!author) return null;

              return (
                <li className="message" key={message.id}>
                  <div
                    className={`avatar avatar-${author.id}`}
                    aria-hidden="true"
                  >
                    {author.initials}
                  </div>

                  <div className="message-body">
                    <div className="message-heading">
                      <span className="author-name">{author.name}</span>
                      <span className="message-time">
                        {message.time} · Story time
                      </span>
                    </div>
                    <p className="message-text">{message.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="conversation-footer">
          <p>
            You’re reading an archived conversation. Explore another channel
            to continue.
          </p>
        </footer>
      </main>

      <aside className="member-sidebar" aria-labelledby="members-title">
        <h2 id="members-title" className="section-label">
          Characters — {characters.length}
        </h2>

        <ul className="member-list">
          {characters.map((character) => (
            <li className="member" key={character.id}>
              <div
                className={`avatar avatar-${character.id}`}
                aria-hidden="true"
              >
                {character.initials}
              </div>
              <div>
                <p className="member-name">{character.name}</p>
                <p className="member-role">{character.role}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="fiction-note">
          A fictional server. All conversations are part of the story.
        </p>
      </aside>
    </div>
  );
}

export default App;