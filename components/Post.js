import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { comment } from 'postcss'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import Moment from 'react-moment'

function Post(props) {
    const [showmore, setshowmore] = useState(false)
    const { data: session } = useSession()
    const [comment, setcomment] = useState('')
    const [comments, setcomments] = useState([])
    const [likes, setlikes] = useState([])
    const [hasliked, sethasliked] = useState(false)

    useEffect(() =>
        onSnapshot(query(collection(db, 'posts', props.id, 'comments'), orderBy('timestamp', 'desc')), snapshot => {
            setcomments(snapshot.docs)
        })
        , [db,props.id])

    useEffect(() => 
        sethasliked(likes.findIndex(like=>like.id === session?.user?.uid) !== -1)
    , [likes])

    useEffect(() => 
        onSnapshot(collection(db,'posts',props.id,'likes'),snapshot=>{
            setlikes(snapshot.docs)
        })
    , [db,props.id])

    const likePost = async () =>{
        if (hasliked){
            await deleteDoc(doc(db,'posts',props.id,'likes',session.user.uid))
        }else{

        await setDoc(doc(db, 'posts',props.id,'likes',session.user.uid),{
            uersname: session.user.username,
        })}
    }

    const sendComment = async (e) => {
        e.preventDefault()

        const commentToSend = comment;
        setcomment('')

        await addDoc(collection(db, 'posts', props.id, 'comments'), {
            comment: commentToSend,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp()
        })
    }

    return (
        <div className='bg-white my-7 border rounded-sm'>
            {/* header */}

            <div className="flex items-center p-5">
                <img src={props.userImg} alt="" className='rounded-full h-12 w-12 object-contain border p-1 mr-3' />
                <p className='flex-1 font-bold'>{props.username}</p>
                <DotsHorizontalIcon className='h-5' />
            </div>

            {/* image */}
            <img src={props.img} alt="" className='object-cover w-full' />

            {/* Buttons */}
            {session &&
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex space-x-4">
                        {hasliked?
                        <HeartIconFilled onClick={likePost} className='postIcon text-red-500' />
                        :<HeartIcon onClick={likePost} className='postIcon' />
                        }
                        <ChatIcon className='postIcon' />
                        <PaperAirplaneIcon className='postIcon' />
                    </div>
                    <BookmarkIcon className='postIcon' />
                </div>
            }

            {/* desc */}
            <div className="p-5">
                {likes.length > 0 && 
                <p className='text-sm font-bold mb-1'>{likes.length} {likes.length === 1? 'like' :'likes'}</p>
                }
                <p >
                    <span className='font-bold mr-1'>{props.username} </span>
                    {props.title}
                </p>

                {props.caption.length > 100 ?
                    <p className='mt-1 break-words'>{showmore ? <span>{props.caption} <span onClick={() => setshowmore(!showmore)} className='italic ml-1 text-sm text-blue-400'>show less</span></span>
                        : <span>{props.caption.substring(0, 50)}... <span onClick={() => setshowmore(!showmore)} className='italic ml-1 text-sm text-blue-400'>show more</span></span>
                    }</p>
                    : <p className='mt-1'>{props.caption}</p>
                }
            </div>

            {/* comment */}
            {
                comments.length > 0 &&
                <div className='ml-10 h-24 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                    {comments.map(comment => (
                        <div key={comment.id} className='flex items-center space-x-2 mb-3'>
                            <img className='h-7 rounded-full' src={comment.data().userImage} alt="" />
                            <p className='text-sm flex-1'>
                                <span className='font-bold mr-2'> {comment.data().username}</span>
                                {comment.data().comment}
                            </p>
                            <Moment fromNow interval={1000} className='pr-5 text-xs'>
                                {comment.data().timestamp?.toDate()}
                            </Moment>
                        </div>
                    ))}
                </div>
            }

            {/* input */}
            {session &&
                <form className="flex items-center p-4">
                    <EmojiHappyIcon className='h-7 mr-2' />
                    <input value={comment} onChange={(e) => setcomment(e.target.value)} type="text" className='border-none flex-1 focus:ring-0 outline-none' placeholder='Add a comment..' />
                    <button type='submit' disabled={!comment.trim()} onClick={sendComment} className='font-semibold text-blue-400'>Post</button>
                </form>
            }
        </div>
    )
}

export default Post
