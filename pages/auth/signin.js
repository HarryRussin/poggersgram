import {getProviders, signIn as SignIntoProvider} from 'next-auth/react'
import Header from '../../components/header'

//client
function signin({providers}) {
    return (
        <>
        <Header/>

        <div className="flex flex-col items-center justify-center text-center
        py-2 pt-10 px-14">
        <img src={'https://links.papareact.com/ocw'} className='w-80' alt="instagram logo" />
        <p className='italic font-xs'>Made by harry :)</p>

        <div className="mt-40">
            {Object.values(providers).map((provider)=>(
                <div className='' key={provider.name}>
                    <button className='p-3 bg-blue-500 rounded-lg text-white' onClick={()=> SignIntoProvider(provider.id,{callbackUrl:'/'})}>
                        Sign in with {provider.name}
                    </button>
                </div>
            ))}
            </div>
        </div>


        </>
    )
}


//Server
export async function getServerSideProps(){
    const providers = await getProviders()

    return {
        props:{
            providers
        }
    }
}

export default signin
