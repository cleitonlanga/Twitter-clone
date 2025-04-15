import { useState } from "react"
import { Link } from "react-router-dom"

//icons
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

import XSvg from "../../../components/svgs/X"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernme: "",
    password: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
  }

  const handleInputChage = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isError = false;
  return (
    <>
      <div className="flex h-screen max-w-screen-xl mx-auto">
        <div className="items-center justify-center flex-1 hidden lg:flex">
          <XSvg className="lg:w-2/3 fill-white" />
        </div>
        <div className="flex flex-col items-center justify-center flex-1">

          <form className="flex flex-col gap-4 mx-auto lg:w-2/3 md:mx-20" onSubmit={handleSubmit}>
            <XSvg className='w-24 lg:hidden fill-white' />
            <h1 className="text-4xl font-extrabold text-white">{"Entrar"} no X.</h1>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center flex-1 gap-2 rounded input input-bordered">
                <FaRegUser />
                <input
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
                type="password"
                className="grow"
                placeholder="palavra-passe"
                onChange={handleSubmit}
                value={formData.password} />
            </label>

            <button type="submit" className="w-full text-white rounded-full btn btn-primary " >Entrar</button>
            {isError && <p className="text-red-500">Algo deu errado</p>}

          </form>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-lg text-white">{"Não tem"} uma conta?</p>
            <Link to="/signup">
              <button className="w-full text-white rounded-full btn btn-primary">Cadastre-se</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
