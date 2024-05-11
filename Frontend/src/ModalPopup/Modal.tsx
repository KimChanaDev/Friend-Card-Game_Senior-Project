import React, { MouseEventHandler } from 'react'
import ReactDOM from "react-dom";
import styled from 'styled-components'
import {Header1,Header2,Message,DesktopCloseButton,CloseSign} from "./ModalPopup.styled"

interface ModalProps {
    onBackdropClick: () => void;
    children: React.ReactElement;
    // children: React.ReactNode; 
    
}
const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const stopPropagation: MouseEventHandler<HTMLDivElement> = e => {
    e.persist();
    e.stopPropagation();
  };

const Modal: React.FC<ModalProps> = ({onBackdropClick, children}) => {
    return ReactDOM.createPortal(
      <Overlay onClick={onBackdropClick}>
        <div onClick={stopPropagation}>{children}</div>
      </Overlay>,
      document.getElementById('modal-root')!
    );
}

export default Modal