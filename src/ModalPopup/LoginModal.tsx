import React,{useState} from 'react'
import ModalRWD from './ModalRWD';
import InputWithIcon from './InputWithIcon';
import { Button, ButtonContainer, InputTitle, InputContainer} from './ModalPopup.styled';


interface LoginArgs {
    password : string;
    login: string;
}

export type LoginFunction = (args: LoginArgs) => Promise<void>

interface LoginModalProps{
    onBackdropClick:() => void;
    isModalVisible: boolean;
    loginError? : string;
    onLoginRequested: LoginFunction;
    switchToSignUpModal:() => void;
}
// const element = <img src={LoginIcon} alt="User Profile" width = "24px"/>

const LoginModal: React.FC<LoginModalProps> =({isModalVisible,onBackdropClick,switchToSignUpModal,onLoginRequested}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const SignInRequest = () =>{
        onLoginRequested({login: login, password: password})
            .then(() => {
                setLogin('');
                setPassword('');
            })
    }
    return (<ModalRWD
        onBackdropClick={onBackdropClick}
        isModalVisible={isModalVisible}
        header1='Sign'
        header2='In'
        message=' '
        content = {
            <>  
                <InputContainer>
                    <InputTitle>Username / Email</InputTitle>
                    <InputWithIcon type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        icon={
                        <img src="/user.svg" alt="LoginIcon" width="24px"/>}
                    />
                </InputContainer>
                
                <InputContainer>
                    <InputTitle>Password</InputTitle>
                    <InputWithIcon type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={
                        <img src="/padlock.svg" alt="PasswordIcon" width = "24px"/>}
                        />
                </InputContainer>
                <ButtonContainer>
                    <Button onClick={SignInRequest}>Sign In</Button>
                    <div onClick={switchToSignUpModal}>Forgot your password ?</div>
                    <a onClick={switchToSignUpModal}>Create Account </a>
                </ButtonContainer>
            </>
        }
    />)
}

export default LoginModal