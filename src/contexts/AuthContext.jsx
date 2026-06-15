import { createContext,useContext,useState } from "react";

const AuthContext = createContext();



export function AuthProvider({children}){
    const [email,setEmail]=useState('');
    const [token,setToken]=useState('');

    const login = async (userEmail,password)=>{
        try{
            const options ={
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email:userEmail,password}),
                credentials: 'include',
            };
            const res = await fetch('/api/users/logon',options);
            const data = await res.json();

            if (res.status === 200 && userEmail && data.csrfToken){
                setEmail(userEmail);
                setToken(data.csrfToken);
                return{success:true};
            }else{
                return{
                    success: false,
                    error:`Authentication failed: ${data?.message}`,
                };
            } 

        }catch{
            return{
                success: false,
                error: 'Network error during login',
            };
        }

    };

    const logout = async ()=> {
        if(!token){
            setEmail('');
            setToken('');
            return {success: true};
        }

        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'X-CSRF-Token': token
                },
                credentials: 'include',
            };
            const res = await fetch('/api/users/logoff',options);

            setEmail('');
            setToken('');
            if (res.status ===200){
                return{success:true};
            }else{
                return{
                    success: false,
                    error: 'Logout API responded with an error.'
                };
            }
        }catch{
            setEmail('');
            setToken('');
            return{
                success: false,
                error: 'Network error during logout',
            };
        }
    };

    const value={
        email,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth=()=>{
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};