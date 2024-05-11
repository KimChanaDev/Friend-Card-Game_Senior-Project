import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import { useState } from 'react'
import Task from './Task'

function FirebaseInterface() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly")

    const [authorizedUser, setAuthorizedUser] = useState(false || sessionStorage.getItem("accessToken"))

    const signInwithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(result)
                if (user) {
                    user.getIdToken().then((tkn) => {
                        sessionStorage.setItem("accessToken", tkn)
                        setAuthorizedUser(true)
                    })
                }
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                const email = error.customData.email
                const credential = GoogleAuthProvider.credentialFromError(error)
                console.log(error)
            })
    }

    const logoutUser = () => {
        signOut(auth).then(() => {
            sessionStorage.clear()
            setAuthorizedUser(false)
            alert('Logged Out Successfully')
        }).catch((error) => {
            alert(error)
        })
    }

    return (
        <>
            {authorizedUser ? (
                <>
                    <button style={{ border: '1px solid black' }} onClick={logoutUser}>Logout</button>
                </>
            ) : (
                <>
                    <button style={{ border: '1px solid black' }} onClick={signInwithGoogle}>Sign In</button>

                </>
            )}
            <hr />
            <h1 style={{ fontWeight: 'bold' }}>Tasks</h1>
            <Task token={sessionStorage.getItem("accessToken")} />
            <hr />

            
        </>
    )
}

export default FirebaseInterface