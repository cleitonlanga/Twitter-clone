import { Link } from "react-router-dom";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";



const RightPanel = () => {
    const isLoading = false
    return (
        <>
            <div className="hidden mx-2 my-4 lg:block">
                <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
                    <p className="font-bold">Sugestões para sí</p>
                    <div className="flex flex-col gap-4">
                        {/* item*/}
                        {isLoading && (
                            <>
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                            </>
                        )}
                        {!isLoading && USERS_FOR_RIGHT_PANEL?.map((user) => (
                            <Link to={`/profile/${user.username}`} className="flex items-center justify-center gap-4" key={user._id}>
                                <div className="flex items-center gap-2">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img src={user.profileImg || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold tracking-tight truncate w-28">
                                        {user.fullname}
                                    </span>
                                    <span className="text-sm text-slate-500">@{user.username}</span>

                                    <button className="text-black bg-white rounded-full btn hover:bg-white hover:opacity-90 btn-sm" onClick={(e) => e.preventDefault()}>
                                        seguir
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}

export default RightPanel
