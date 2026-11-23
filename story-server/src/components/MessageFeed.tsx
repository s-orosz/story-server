import type {
    Channel,
    Character,
    StoryMessage,
} from "../story/types";
import Message from "./Message";


type MessageFeedProps = {
  channel: Channel;
  messages: StoryMessage[];
  characters: Character[];
};

function MessageFeed({
  channel,
  messages,
  characters,
}: MessageFeedProps) {
  return (
    <section
      className="message-feed"
      aria-labelledby="channel-title"
      tabIndex={0}
    >
      <div className="channel-introduction">
        <div className="intro-symbol" aria-hidden="true">
          #
        </div>

        <h3>Welcome to #{channel.name}</h3>
        <p>This is the beginning of this conversation.</p>
      </div>

      <div className="story-divider">
        <span>Previously in The Quiet Room</span>
      </div>

      <ol className="message-list">
        {messages.map((message) => {
            const author = characters.find(
            (character) => character.id === message.authorId,
            );

            if (!author) return null;

            return (
            <Message
                key={message.id}
                message={message}
                author={author}
            />
            );
        })}
      </ol>
    </section>
  );
}

export default MessageFeed;