import styled from 'styled-components'

const ModalContainer = styled.div`
  /* background-color: #375FC7; */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 36px;
  background: linear-gradient(0deg, rgba(117, 167, 226, 0.30) 0%, rgba(117, 167, 226, 0.30) 100%), #FFF;
`

export const Error = styled.div`
  padding: 16px 0;
  font-size: 13px;
  color: red;
`;

export const DesktopModalContainer = styled(ModalContainer)`
  border-radius: 7px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
  padding: 40px;
  min-width: 450px;
  max-width: 1300px;
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  font-size: 26px;
`;

export const MobileModalContainer = styled(ModalContainer)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 15px;
  min-height: 150px;
  font-size: 26px;
`;

export const Header1 = styled.a`
  width: 50%;
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 64px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
export const Header2 = styled.a`
  width: 50%;
  color: #375FC7;
  text-align: center;
  font-family: Inter;
  font-size: 64px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

export const Message = styled.p`
  color: #aaa;
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 39px;
  text-align: center;
`;

const CLOSE_BUTTON_SIZE = 40;

export const CloseSign = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #323232;

  &:before,
  &:after {
    position: absolute;
    left: 19px;
    top: 10px;
    content: ' ';
    height: 20px;
    width: 2px;
    background-color: #333;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
`;


const CloseButton = styled.div`
  position: sticky;
  width: ${CLOSE_BUTTON_SIZE}px;
  height: ${CLOSE_BUTTON_SIZE}px;
  /* background-color: #c8c8c8; */
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  
  & > * {
    opacity: 1;
  }

  &:hover > * {
    opacity: 0.4;
  }
`;


export const DesktopCloseButton = styled(CloseButton)`
  top: 0%;
  left: 100%;
`;

export const MobileCloseButton = styled(CloseButton)`
  top: -${CLOSE_BUTTON_SIZE / 2}px;
  left: calc(100% - ${CLOSE_BUTTON_SIZE * 1.5 + 20}px);
`;

export const ButtonContainer = styled.div`
  padding-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
  /* width: 100%; */
`;


export const Button = styled.button`
  //Button
  cursor: pointer;
  border: 3px solid white;
  border-radius: 30px;
  background: #081128;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 380px;
  min-height: 80px;
  padding: 8px 16px;
  transition: 0.2s ease-in-out;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 30px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;

  &:hover {
    color: #375FC7;
    background-color: #081128;
    border-color: white;
  }
`;

export const InputTitle = styled.a`
  //position
  display: flex;
  /* width: 650px; */
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  //text
  color: #000;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const InputContainer = styled.div`
  /* padding-top: 10%; */
  margin-top:5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* color: #000; */
  /* text-align: center; */
  /* font-family: Inter; */
  /* font-size: 20px; */
  /* font-style: normal; */
  /* font-weight: 500; */
  /* line-height: normal; */
  width: 100%;
`;

export const LobbyContainer = styled.div`
  
`
export const LogoutButton = styled.button`
  //Button
  margin-top: -20px;
  cursor: pointer;
  border: 3px solid white;
  border-radius: 30px;
  background: #081128;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  min-height: 70px;
  max-height: 80px;
  padding: 8px 16px;
  transition: 0.2s ease-in-out;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  &:hover {
    color: #375FC7;
    background-color: #081128;
    border-color: white;
  }
`;

export const ChangePasswordButton = styled.button`
  //Button
  cursor: pointer;
  margin-top: -10px;
  margin-bottom: 25px;
  border: 3px solid white;
  border-radius: 30px;
  background: #162345;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10px;
  width: 270px;
  max-width: 300px;
  min-height: 70px;
  max-height: 80px;
  padding: 8px 16px;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  transition: 0.2s ease-in-out;

  &:hover:not(:disabled) {
    color: #375FC7;
    background-color: #081128;
    border-color: white;
  }
  &:disabled{
    user-select: none;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

