import React from 'react'
import MediaQuery from 'react-responsive';
import BaseModalWrapper, { BaseModalWrapperProps } from './BaseModalWrapper'
import { DesktopModalContainer, MobileModalContainer } from './ModalPopup.styled';

type ModalRWDProps = BaseModalWrapperProps;
const ModalRWD: React.FC<ModalRWDProps> = (props) => {
    return (<MediaQuery minWidth={580}>
      {
        matches => matches ? (
          <BaseModalWrapper
            ContainerComponent={DesktopModalContainer}
            {...props}
          />
        ) : (
          <BaseModalWrapper 
          ContainerComponent={MobileModalContainer}
          {...props}
          />
        )
      }
    </MediaQuery>);
}

export default ModalRWD