
import { useSession } from 'next-auth/react'
import {useEffect,useState} from 'react'
import { PlusIcon } from '@heroicons/react/outline'
import Story from './Story'

function Stories() {
    const [users,setUsers] = useState([])
    const {data:session} = useSession()

    useEffect(() => {
        const suggestions = [...Array(20)].map((_,i)=>({
            name:'Harry',
            email:'example@example.com',
            avatar:'https://images.theconversation.com/files/424337/original/file-20211003-25-1b8j7p1.jpg?ixlib=rb-1.1.0&rect=50%2C26%2C2197%2C1499&q=45&auto=format&w=926&fit=clip',
            id:i
        }))
        
        setUsers(suggestions)
    }, [])

    return (
        <div className='flex space-x-2 p-6 bg-white mt-8 
        border-gray-200 border rounded-sm overflow-x-scroll
         scrollbar-thin scrollbar-thumb-black'>
            {session && 
            <div className='relative'>
                <Story img={session.user.image} name={session.user.username}/>
                <PlusIcon className='w-6 absolute top-4 left-4 text-white pointer-events-none'/>
            </div>}
            {
                users.map(profile=>{
                    return <Story key={profile.id} img={profile.avatar} name={profile.name}/>
                })
            }
        </div>
    )
}

export default Stories
