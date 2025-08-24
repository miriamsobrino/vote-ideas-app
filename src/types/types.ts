export interface Idea {
  id: string;
  title: string;
  author: string;
  authorId: string;
  votes: number;
  createdAt: string;
  voters?: string[];
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
}
