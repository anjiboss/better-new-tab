import { AxiosError } from "axios";

export interface User {
  username: string;
  firstname: string;
  lastname: string;
  createAt: Date;
  updateAt: Date;
}

export type RequestError = AxiosError<{
  error: {
    message: string;
  };
}>;

export interface IStick {
  id: string;
  title: string;
  url: string;
  updatedAt: Date;
  icon: {
    isCached: boolean;
    base64: string;
  };
  position: {
    x: number;
    y: number;
  };
}
