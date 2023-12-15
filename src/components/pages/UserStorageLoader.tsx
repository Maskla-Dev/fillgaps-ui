interface UserStorageLoaderProps{
    message: string;
}

const UserStorageLoader = ({message}: UserStorageLoaderProps)=>{
    return (
        <>
            <div>
                <span>{message}</span>
            </div>
        </>
    )
}

export default UserStorageLoader;