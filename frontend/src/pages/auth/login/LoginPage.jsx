import { useState } from "react";
import { Link } from "react-router-dom";

//icons
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

import XSvg from "../../../components/svgs/X";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: login,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Algo deu errado, tente novamente");

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    login(formData);
  };

  const handleInputChage = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex h-screen max-w-screen-xl mx-auto">
        <div className="items-center justify-center flex-1 hidden lg:flex">
          <XSvg className="lg:w-2/3 fill-white" />
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <form
            className="flex flex-col gap-4 mx-auto lg:w-2/3 md:mx-20"
            onSubmit={handleSubmit}
          >
            <XSvg className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white">
              {"Entrar"} no X.
            </h1>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
                <FaRegUser />
                <input
                  name="username"
                  type="text"
                  className="grow"
                  placeholder="username"
                  onChange={handleInputChage}
                  value={formData.usernme}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 rounded input input-bordered">
              <MdOutlinePassword />
              <input
                name="password"
                type="password"
                className="grow"
                placeholder="palavra-passe"
                onChange={handleInputChage}
                value={formData.password}
              />
            </label>

            <button
              type="submit"
              className="w-full text-white rounded-full btn btn-primary "
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-lg text-white">{"Não tem"} uma conta?</p>
            <Link to="/signup">
              <button className="w-full text-white rounded-full btn btn-primary">
                Cadastre-se
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
