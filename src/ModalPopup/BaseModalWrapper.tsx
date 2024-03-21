import React from "react";
import Modal from "./Modal";
import {
  Header1,
  Header2,
  Message,
  DesktopCloseButton,
  CloseSign,
} from "./ModalPopup.styled";
import "./BaseModalWrapper.css"
export interface BaseModalWrapperProps {
  isModalVisible: boolean;
  onBackdropClick: () => void;
  header1: string;
  header2: string;
  message?: string;
  content?: React.ReactNode;
}

interface ComponentsProps {
  ContainerComponent: React.ComponentType<object>;
  // CloseButtonComponent: React.ComponentType<{onClick?: MouseEventHandler<any>}>;
}

type Props = BaseModalWrapperProps & ComponentsProps;

const BaseModalWrapper: React.FC<Props> = ({
  content,
  onBackdropClick,
  isModalVisible,
  header1,
  header2,
  message,
  ContainerComponent,
}) => {
  if (!isModalVisible) {
    return null;
  }

  return (
    <Modal onBackdropClick={onBackdropClick}>
      <div>
        <div className="CloseModal">
          <DesktopCloseButton onClick={onBackdropClick}>
            <CloseSign />
          </DesktopCloseButton>
        </div>
        <ContainerComponent>
          <span>
            <Header1> {header1} </Header1>
            <Header2> {header2} </Header2>
          </span>
          {message && <Message> {message} </Message>}
          {content}
        </ContainerComponent>
      </div>
    </Modal>
  );
};

export default BaseModalWrapper;
