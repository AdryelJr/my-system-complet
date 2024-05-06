import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../services/firebase';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type User = {
    id: string;
    name: string;
    avatar: string;
    email: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    deslogar: () => Promise<void>;

}

type AuthContextProviderProps = {
    children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid, email } = user
                if (!displayName || !photoURL || !email) {
                    throw new Error('Missing information from Google Account.');
                }
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                    email: email
                })
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        if (result.user) {
            const { displayName, photoURL, uid, email } = result.user
            if (!displayName || !photoURL || !email) {
                throw new Error('Missing information from Google Account.');
            }
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
                email: email
            });
            navigate('/');
        }
    };

    const deslogar = async () => {
        signOut(auth).then(() => {
            setUser(undefined)
        }).catch((error) => {
            console.log("Failed to sign out", error);
        })
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, deslogar }}>
            {props.children}
        </AuthContext.Provider>
    );
};
