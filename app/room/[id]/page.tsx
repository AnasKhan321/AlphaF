import Chat from "@/app/ClientComponents/Room"


export default async function Page({params}  : { params: Promise<{ id: string }>}) {
    const data = await params 


    return(
       <Chat id={data.id}/>
    )
}