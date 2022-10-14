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
