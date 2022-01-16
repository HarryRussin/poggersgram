import {useSession,signOut} from 'next-auth/react'

function Miniprofile() {
    const {data:session} = useSession()

    return (
        <div className="flex items-center justify-between mt-14 ml-10">
            <img src={session?.user?.image} alt="" className="rounded-full border p-[2px] w-16 h-16"/>

            <div className="mx-4 flex-1">
                <h2 className="font-bold">{session?.user?.username}</h2>
                <h3 className="text-gray-500 text-sm">Welcome to Instagram</h3>
            </div>

            <button onClick={signOut} className="font-semibold text-blue-400 text-sm">Sign Out</button>
        </div>
    )
}

export default Miniprofile
