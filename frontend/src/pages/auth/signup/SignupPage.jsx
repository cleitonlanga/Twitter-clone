import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import XSvg from "../../../components/svgs/X";

//icons
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  const { mutate, isError, isPeding, error } = useMutation({
    mutationFn: async (email, username, fullname, password) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(email, username, fullname, password),
        });

        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();

        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventfault();
    console.log(formData);
    mutate(formData);
  };

  const handleInputChage = (e) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
  };

  return (
    <>
      <div className="flex h-screen max-w-screen-lg px-10 mx-auto">
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
              Inscreva-se hoje
            </h1>

            <label className="flex items-center gap-2 rounded input input-bordered">
              <MdOutlineMailOutline />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                onChange={handleInputChage}
                value={formData.email}
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
                <FaRegUser />
                <input
                  type="text"
                  className="grow"
                  placeholder="username"
                  onChange={handleInputChage}
                  value={formData.username}
                />
              </label>
              <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
                <MdDriveFileRenameOutline />
                <input
                  type="text"
                  className="grow"
                  placeholder="nome completo"
                  onChange={handleInputChage}
                  value={formData.fullname}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 rounded input input-bordered">
              <MdOutlinePassword />
              <input
                type="password"
                className="grow"
                placeholder="palavra-passe"
                onChange={handleSubmit}
                value={formData.password}
              />
            </label>

            <button
              type="submit"
              className="w-full text-white rounded-full btn btn-primary "
            >
              {isPeding ? "Loading..." : "Criar conta"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
          <div className="flex flex-col gap-2 mt-4 lg:w-2/3">
            <p className="text-lg font-extrabold text-white">
              Já tem uma conta?
            </p>
            <Link to="/login">
              <button
                type="button"
                className="w-full text-white rounded-full btn btn-primary btn-outline"
              >
                Entrar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
