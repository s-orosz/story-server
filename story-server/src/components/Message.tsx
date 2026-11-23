import type { Character, StoryMessage } from "../story/types";

type MessageProps = {
  message: StoryMessage;
  author: Character;
};

function Message({ message, author }: MessageProps) {
  return (
    <li className="message">
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
}

export default Message;