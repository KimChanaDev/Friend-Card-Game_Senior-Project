import React, { useEffect, useState } from "react";
import ModalRWD from "./ModalRWD";
import "./HowToPlayModal.css";
interface HowtoPlayModalProps {
  onBackdropClick: () => void;
  isModalVisible: boolean;
}

interface ImageProps {
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} />;
};

const HowtoPlayModal: React.FC<HowtoPlayModalProps> = ({
  isModalVisible,
  onBackdropClick,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (error) {}
    };

    fetchData();
  }, [isModalVisible]);
  const images: string[] = Array.from(
    { length: 14 },
    (_, index) => `/HowToPlay/htp${index + 1}.png`
  );
  return (
    <ModalRWD
      onBackdropClick={onBackdropClick}
      isModalVisible={isModalVisible}
      header1="How To"
      header2="Play"
      message=" "
      content={
        <>
          <div className="HowtoPlay">
            {images.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={`How to Play Step ${index + 1}`}
              />
            ))}
          </div>
        </>
      }
    />
  );
};

export default HowtoPlayModal;
