export interface Idea {
  id: string;
  title: string;
  author: string;
  votes: number;
  createdAt: string;
  voters?: string[];
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
}
