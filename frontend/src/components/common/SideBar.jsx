import { Link } from "react-router-dom"
import { MdHome } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";


import XSvg from "../svgs/X"



const SideBar = () => {
    const data = {
        fullname: "jonhMacdonald",
        username: "jonh12",
        profileImg: "/avatars/boy1.png",
    }


    return (
        <>
            <div className="md:flex-[2_2_0] w-18 max-w-52">
                <div className="sticky top-0 left-0 flex flex-col w-20 h-screen border-r border-gray-700 md:w-full">
                    <Link to="/">
                        <XSvg className="w-12 h-12 px-2 rounded-full fill-white hover:bg-stone-900" />
                    </Link>

                    <ul className="flex flex-col gap-3 mt-4">
                        <li className="flex justify-center md:justify-start">
                            <Link to="/" className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer hover:bg-stone-900 max-w-fit">
                                <MdHome className="w-8 h-8" />
                                <span className="hidden text-lg md:block">Home</span>
                            </Link>
                        </li>
                        <li className="flex justify-center md:justify-start">
                            <Link to="/notifications" className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit hover:bg-stone-900">
                                <MdNotifications className="w-6 h-6" />
                                <span className="hidden text-lg md:block">Notificações</span>
                            </Link>
                        </li>
                        <li className="flex justify-center md:justify-start">
                            <Link to={`/profile/${data.username}`} className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit hover:bg-stone-900">
                                <FaRegUser className="w-6 h-6" />
                                <span className="hidden text-lg md:block">Perfil</span>
                            </Link>
                        </li>
                    </ul>
                    {data && (<Link to={`/profile/${data.username}`} className="flex items-start gap-2 mt-auto mb-10 transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full">
                        <div className="hidden avatar md:inline-flex">
                            <div className="w-8 rounded-full">
                                <img src={data?.profileImg || "/avatar-placeholder(1).png"} alt="Imagem do usuário" />
                            </div>
                        </div>
                        <div className="flex justify-between flex-1">
                            <div className="hidden md:block">
                                <p className="w-20 text-sm font-bold text-white truncate">{data?.fullname}</p>
                                <p className="text-sm text-slate-500">@{data?.username}</p>
                            </div>
                            <CiLogout className="w-5 h-5 text-sm cursor-pointer" />
                        </div>
                    </Link>)}
                </div>
            </div>
        </>
    )
}

export default SideBar