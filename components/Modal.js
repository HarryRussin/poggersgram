import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef, useState } from "react"
import { CameraIcon } from '@heroicons/react/outline'
import {db, storage} from '../firebase'
import {useSession} from 'next-auth/react'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { ref, getDownloadURL, uploadString } from "firebase/storage"

function Modal() {
    const [open, setopen] = useRecoilState(modalState)
    const filePickerRef = useRef(null)
    const [selectedFile, setselectedFile] = useState(null)
    const titleRef = useRef(null)
    const captionRef = useRef(null)
    const [loading, setloading] = useState(false)
    const {data:session} = useSession()

    const addImageToPost = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setselectedFile(readerEvent.target.result)
        }
    }

    const uploadPost = async ()=>{
        if(loading){
            return
        }
        setloading(true)

        //create a post and add to firestore 'posts'
        //get the post ID of the new post
        //upload the image to firebase storage with post ID
        //get a download URL from firebase storage and update original post with image

        const docRef = await addDoc(collection(db, 'posts'),{
            username: session.user.username,
            title: titleRef.current.value,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })

        console.log('new doc added with ID',docRef.id);

        const imageRef = ref(storage, `posts/${docRef.id}/image`)

        await uploadString(imageRef,selectedFile,'data_url')
        .then(async snapshot => {
            const downloadUrl = await getDownloadURL(imageRef)

            await updateDoc(doc(db,'posts',docRef.id),{
                image:downloadUrl
            })
        })

        setopen(false)
        setloading(false)
        setselectedFile(null)
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as='div'
                className='fixed z-0 inset-0 overflow-y-auto'
                onClose={setopen}>

                <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter={'ease-out duration-300'}
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave='ease-in duration-200'
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >

                        <Dialog.Overlay className={'fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity'}>

                        </Dialog.Overlay>

                    </Transition.Child>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden='true'>
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:scale-95 sm:translate-y-0"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5
                         pb-4 text-left overflow-hidden shadow-xl transform transition-all
                          sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div className="">
                                {!selectedFile ?
                                    <div className="mx-auto flex items-center h-12 justify-center w-12 rounded-full bg-red-100 cursor-pointer"
                                        onClick={() => filePickerRef.current.click()}>
                                        <CameraIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
                                    </div>
                                    : <img src={selectedFile} className="cursor-pointer object-contain w-full" alt="" onClick={()=> setselectedFile(null)}/>
                                }
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                        as="h3"
                                        className={'text-lg loading-6 font-medium text-gray-900'}>
                                        Upload a photo
                                    </Dialog.Title>
                                </div>
                                <div>
                                    <input className=""
                                        type='file'
                                        hidden
                                        ref={filePickerRef}
                                        onChange={addImageToPost}
                                    />
                                </div>
                                <div className="mt-2">
                                    <input type="text" ref={titleRef} className="border-none focus:ring-0 w-full text-center outline-none" placeholder="Please enter a title" />
                                </div>
                                <div className="mt-2">
                                    <input type="text" ref={captionRef} onChange={()=>{console.log(captionRef.current.value)}} className="border-none focus:ring-0 w-full text-center outline-none" placeholder="Please enter a caption" />
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    disabled={!selectedFile}
                                    className="inline-flex justify-center w-full rounded-md 
                                    border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base 
                                    font-medium text-white hover:bg-red-700
                                     focus:outline-none focus:ring-2 focus:ring-offset-2
                                      focus:ring-red-500 sm:text-sm disabled::bg-gray-300 
                                      disabled:cursor-not-allowed hover:disabled:bg-gray-400"

                                      onClick={uploadPost}
                                >
                                    {loading? 'Uploading...' : 'Upload Post'}
                                </button>
                            </div>
                        </div>

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Modal
