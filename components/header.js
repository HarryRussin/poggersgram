import Image from "next/image"
import { useSession,signIn, signOut } from "next-auth/react"

import {
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    MenuIcon
} from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"

function Header() {

    const { data: session } = useSession()
    const router = useRouter()
    const [open, setopen] = useRecoilState(modalState)

    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-50">
            <div className="flex justify-between max-w-5xl mx-5 lg:mx-auto xl:max-w-6xl">
                {/* left */}
                <div onClick={()=>router.push('/')} className="relative hidden lg:inline-grid w-24 cursor-pointer">
                    <Image src='https://links.papareact.com/ocw' layout="fill" objectFit="contain" />
                </div>

                <div onClick={()=>router.push('/')} className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer">
                    <Image src='https://links.papareact.com/jjm' layout="fill" objectFit="contain" />
                </div>

                {/* middle -search input*/}
                <div className="max-w-xs">
                    <div className="relative mt-1 p-3 rounded-md">
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input type="text" placeholder="search" className="bg-gray-50 block w-full pl-10 py-2 sm:text-sm 
                    border-gray-300 focus:ring-black rounded-md focus:border-black"/>
                    </div>
                </div>

                {/* right */}
                {session?
                    <div className="flex items-center justify-end space-x-4" >
                        <MenuIcon className="w-10 h-6 md:hidden cursor-pointer" />
                        <HomeIcon onClick={()=>router.push('/')} className="navIcon" />
                        <div className="relative navIcon">
                            <PaperAirplaneIcon className="navIcon absolute rotate-45" />
                            <div className="absolute -top-1 right-1 text-xs w-4 h-4 bg-red-500 
                        text-white rounded-full flex items-center justify-center animate-pulse">3</div>
                        </div>
                        <PlusCircleIcon className="navIcon" onClick={()=>{setopen(true)}}/>
                        <UserGroupIcon className="navIcon" />
                        <HeartIcon className="navIcon" />
                        <img src={session?.user?.image} alt="profile pic" className="h-10 w-10 rounded-full cursor-pointer hover:border-2 border-blue-400 p-[1.5px] transition-all duration-150 ease-out" 
                        onClick={signOut}/>
                    </div>
                :<button onClick={signIn}>Signin</button>
                }
            </div>
        </div>
    )
}

export default Header
