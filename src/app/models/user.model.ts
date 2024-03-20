export interface User {
    id: string;
    username: string;
    email: string;
    token: string; 
    createdAt?:Date;
    followers?:User[];
    following?:User[];
  }
  