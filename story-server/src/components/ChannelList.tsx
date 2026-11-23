import type { Channel } from "../story/types";
  
type ChannelListProps = {
channels: Channel[];
activeChannelId: string;
onSelectChannel: (channelId: string) => void;
};

function ChannelList({
channels,
activeChannelId,
onSelectChannel,
}: ChannelListProps) {
return (
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
            onClick={() => onSelectChannel(channel.id)}
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
);
}

export default ChannelList;