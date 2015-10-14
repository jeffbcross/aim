// Application-level states of the connection with the backend.
export enum ConnectionStates {CONNECTED, CONNECTING, WAITING_TO_RETRY}

// Message within a channel, not to be confused with a WebSocket message
export interface Message {
  id?:string;
  channel: string;
  otherUser: string;
}

export interface Channel {
  id?:string;
  // List of github usernames
  partcipants: string[];
}

export interface User {
  username: string;
}

export interface SelfUser extends User {
  token: string;
}
