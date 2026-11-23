export type Channel = {
    id: string;
    name: string;
    description: string;
  };
  
export type Character = {
id: string;
name: string;
initials: string;
role: string;
};

export type StoryMessage = {
id: string;
channelId: string;
authorId: string;
time: string;
text: string;
};