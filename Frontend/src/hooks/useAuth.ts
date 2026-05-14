import { useNavigate } from "react-router-dom"

export function useAuth(){
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    return{
        token,
        user: user? JSON.parse(user) : null,
        isAuthenticated: !!token
    }
}

export function useLogout(){
    const navigate = useNavigate()
    return () => {
        localStorage.removeItem(`token`)
        localStorage.removeItem(`user`)
        navigate("/login")
    }
}