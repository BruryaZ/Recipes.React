import { createContext, ReactElement, useState } from "react"

type UserContextType = {
    id: number,
    setMyId: (id: number) => void
    name: string,
    setMyName: (name: string) => void
    email: string,
    setMyEmail: (email: string) => void
    password: string
    setMyPassword: (password: string) => void
}

export const detailsContext = createContext<UserContextType>(
    {
        id: -1,
        setMyId: (_: number) => { },
        name: "",
        setMyName: (_: string) => { },
        email: "",
        setMyEmail: (_: string) => { },
        password: "",
        setMyPassword: (_: string) => { }
    }
)

const UserProvider = ({ children }: { children: ReactElement }) => {
    const [id, setMyId] = useState<number>(-1)
    const [name, setMyName] = useState<string>("A")
    const [email, setMyEmail] = useState<string>("a@a")
    const [password, setMyPassword] = useState<string>("111111")

    return <detailsContext.Provider value={{ id, setMyId, name, setMyName, email, setMyEmail, password, setMyPassword }}>
        {children}
    </detailsContext.Provider>
}

export default UserProvider