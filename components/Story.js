function Story({img,name}) {
    return (
        <div>
            <img src={img} alt='' className="rounded-full w-20 p-[1.5px] h-14 border-red-500 border-2 hover:scale-110 duration-150 ease-out transition-transform"/>
            <p className="text-xs w-14 truncate text-center">{name}</p>
        </div>
    )
}

export default Story
