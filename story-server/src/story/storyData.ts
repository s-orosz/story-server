import type {
    Channel,
    Character,
    StoryMessage,
  } from "./types";
  
  export const channels: Channel[] = [
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
  
  export const characters: Character[] = [
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
  
  export const messages: StoryMessage[] = [
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