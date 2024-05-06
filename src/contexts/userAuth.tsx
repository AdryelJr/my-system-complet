import { signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
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
    updateName: (displayNameInput: string) => Promise<void>;

}

type AuthContextProviderProps = {
    children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

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
            const newUser: User = {
                id: uid,
                name: displayName,
                avatar: photoURL,
                email: email
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(auth.currentUser));
            navigate('/');
        }
    };

    const deslogar = async () => {
        signOut(auth).then(() => {
            setUser(undefined)
            localStorage.removeItem('user')
        }).catch((error) => {
            console.log("Failed to sign out", error);
        })
        localStorage.removeItem('user');
    };

    const updateName = async (displayNameInput: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            updateProfile(currentUser, {
                displayName: displayNameInput
            });
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, deslogar, updateName }}>
            {props.children}
        </AuthContext.Provider>
    );
};
