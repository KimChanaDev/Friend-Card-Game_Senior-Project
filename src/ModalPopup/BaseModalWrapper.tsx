import React from "react";
import Modal from "./Modal";
import {Header1,Header2,Message} from "./ModalPopup.styled"

export interface BaseModalWrapperProps {
    isModalVisible: boolean;
    onBackdropClick: () => void;
    header1: string;
    header2: string;
    message?:string;
    content?:React.ReactNode;
}

interface ComponentsProps {
    ContainerComponent: React.ComponentType<object>;
    // CloseButtonComponent: React.ComponentType<{onClick?: MouseEventHandler<any>}>;
}

type Props = BaseModalWrapperProps & ComponentsProps;

const BaseModalWrapper: React.FC<Props> = ({content,onBackdropClick,isModalVisible,header1,header2, message, ContainerComponent}) =>{

    if(!isModalVisible){
        return null
    }

    return (<Modal onBackdropClick={onBackdropClick}> 
        <ContainerComponent >
            <span>
                <Header1> {header1} </Header1>
                <Header2> {header2} </Header2>
            </span>
            {message && <Message> {message} </Message>}
            {content}
        </ContainerComponent>
    </Modal>);
}

export default BaseModalWrapper