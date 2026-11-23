import type { Channel, StoryMessage } from "./types";

export function getActiveChannel(
  channels: Channel[],
  activeChannelId: string,
): Channel {
  const selectedChannel = channels.find(
    (channel) => channel.id === activeChannelId,
  );

  if (selectedChannel) {
    return selectedChannel;
  }

  const firstChannel = channels[0];

  if (!firstChannel) {
    throw new Error("The story must contain at least one channel.");
  }

  return firstChannel;
}

export function getChannelMessages(
  messages: StoryMessage[],
  channelId: string,
): StoryMessage[] {
  return messages.filter(
    (message) => message.channelId === channelId,
  );
}