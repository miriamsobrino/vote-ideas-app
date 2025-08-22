export interface Idea {
  id: string;
  title: string;
  author?: string;
  votes: number;
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
}
