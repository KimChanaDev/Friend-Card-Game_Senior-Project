import React, { useEffect, useState } from "react";
import ModalRWD from "./ModalRWD";

interface HowtoPlayModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
}

const HowtoPlayModal: React.FC<HowtoPlayModalProps> = ({
  isModalVisible,
  onBackdropClick,
}) => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        
      } catch (error) {
        
      }
    };

    fetchData();
  }, [isModalVisible]);

  return (
    <ModalRWD
      onBackdropClick={onBackdropClick}
      isModalVisible={isModalVisible}
      header1="How To"
      header2="Play"
      message=" "
      content={
        <>
          
        </>
      }
    />
  );
};

export default HowtoPlayModal;
