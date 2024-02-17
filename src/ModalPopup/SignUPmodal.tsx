import React, { useState } from 'react';
import ModalRWD from './ModalRWD';
import InputWithIcon from './InputWithIcon';
import { Button, ButtonContainer, InputTitle, InputContainer} from './ModalPopup.styled';


interface SignUpArgs {
    password : string;
    email: string;
    username: string;
    con_password: string;
    image: string;
}

export type SignUpFunction = (args: SignUpArgs) => Promise<void>

interface SignUpModalProps{
    onBackdropClick:() => void;
    isModalVisible: boolean;
    SignUpError? : string;
    onSignUpRequested: SignUpFunction;
    switchToSignInModal:() => void;
}
// const element = <img src={SignUpIcon} alt="User Profile" width = "24px"/>

const SignUpModal: React.FC<SignUpModalProps> =({isModalVisible,onBackdropClick,switchToSignInModal,onSignUpRequested}) => {
    const [email, setEmail] =useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [con_password, setConPassword] = useState('');
    const SignInRequest = () =>{
        onSignUpRequested({username: username, password: password,con_password:con_password,email:email,image:"https://cdn.discordapp.com/attachments/406860361086795776/1200152089842696252/Version1.gif?ex=65c523bb&is=65b2aebb&hm=1cb911f347cd4e608d7077e1ff9ccc3f60a54d265872533728ca667850621082&"})
        setEmail('');
        setUsername('');
        setPassword('');
        setConPassword('');
    }
    return (<ModalRWD
        onBackdropClick={onBackdropClick}
        isModalVisible={isModalVisible}
        header1='Sign'
        header2='Up'
        message=' '
        content = {
            <>  
                <InputContainer>
                    <InputTitle>Username</InputTitle>
                    <InputWithIcon type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={
                        <img src="/user.svg" alt="SignUpIcon" width = "24px"/>
                    }/>
                </InputContainer>
                <InputContainer>
                    <InputTitle>Email</InputTitle>
                    <InputWithIcon type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    icon={
                        <img src="/email.svg" alt="SignUpIcon" width = "24px"/>
                    }/>
                </InputContainer>
                <InputContainer>
                    <InputTitle>Password</InputTitle>
                    <InputWithIcon type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    icon={
                        <img src="/padlock.svg" alt="PasswordIcon" width = "24px"/>
                    }/>
                </InputContainer>
                <InputContainer>
                    <InputTitle>Confirm Password</InputTitle>
                    <InputWithIcon type="password" 
                    value={con_password}
                    onChange={(e) => setConPassword(e.target.value)} 
                    icon={
                        <img src="/padlock.svg" alt="PasswordIcon" width = "24px"/>
                    }/>
                </InputContainer>
                <ButtonContainer>
                <Button onClick={SignInRequest}>Sign Up</Button>
                    <div>Already have an account ?</div>
                    <a onClick={switchToSignInModal}>Sign In </a>
                </ButtonContainer>
            </>
        }
    />)
}

export default SignUpModal