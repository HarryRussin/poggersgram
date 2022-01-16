import { useEffect, useState } from "react"

function Suggestion() {
    const [suggestions, setsuggestions] = useState([])

    useEffect(() => {
        const suggestions = [...Array(5)].map((_,i)=>{
            return {
                id:i,
                username:'harry_a_russin',
                avatar:'https://links.papareact.com/3ke'
            }
        })

        setsuggestions(suggestions)
    }, [])

    return (
        <div className="mt-4 ml-10">
            <div className="flex justify-between text-sm mb-5">
                <h3 className="text-sm font-bold text-gray-500">Suggestions for you</h3>
                <button className="text-gray-600 font-semibold">See All</button>
            </div>

            {
                suggestions.map(profile=>{
                    return(
                    <div key={profile.id} className="flex items-center justify-between mt-3">
                        <img src={profile.avatar} alt="" className="rounded-full w-10 h-10 border p-[2px]"/>

                        <div className="ml-4 flex-1">
                            <h2 className="font-semibold text-sm">{profile.username}</h2>
                            <h3 className="text-xs text-gray-400">From your contacts</h3>
                        </div>
                        <button className="font-semibold text-blue-400 text-sm">Follow</button>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default Suggestion
