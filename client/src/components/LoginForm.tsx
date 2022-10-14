import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { RequestError } from "../types/types";
import { toasti } from "../ultis/_visual";

const LoginForm: React.FC = () => {
  const { setLogged } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
      data: {
        username,
        password,
      },
    })
      .then(({ data }) => {
        window.localStorage.setItem("accessToken", data.data.accessToken);
        window.localStorage.setItem("refreshToken", data.data.refreshToken);
        toasti("Log in success");
        setLogged(true);
        navigate("/");
      })
      .catch((e: RequestError) => {
        if (e.response) {
          console.log(e.response.data.error.message);
          toasti(e.response.data.error.message, "error");
        }
      });
  };

  return (
    <>
      <form onSubmit={loginHandler}>
        <div>
          <input
            type="text"
            value={username}
            placeholder="email"
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default LoginForm;
