import styled from "styled-components";
import {
    borders,
    colors,
    screen,
    shadows,
    transitions,
} from "@/common/styles/styleConstants";
import { useEffect, useState } from "react";
import close from "@/common/icons/close.svg";
import { hoverActive, resetButton } from "@/common/styles/mixins";
import { useTranslation } from "react-i18next";

export interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    closeIcon?: boolean;
    title?: string;
    children?: React.ReactNode;
    zIndex?: number;
    styleContent?: React.CSSProperties;
    styleWrapper?: React.CSSProperties;
};

const ModalSection = styled("section") <{ $zindex: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: ${(props) => props.$zindex};
    background-color: ${colors.blackTransparent};

    @media (max-width: ${screen.lMobileScreenWidthAbove}){
        align-items: end;
    }
`;

const ModalContent = styled("div") <{ $visible: boolean }>`
    position: relative;
    background: ${colors.white};
    border-radius: ${borders.defaultRadius};
    box-shadow: ${shadows.defaultShadow};
    height: fit-content;
    width: fit-content;
    transition: ${(props) => (props.$visible ? transitions.mediumTransition : transitions.fastTransition)};
    opacity: ${(props) => (props.$visible ? '1' : "0")};
    transform: ${(props) => (props.$visible ? "scale(1)" : "scale(0.5)")};
    overflow: hidden;

    @media (max-width: ${screen.lMobileScreenWidthAbove}){
        opacity: 1;
        transform: ${(props) => (props.$visible ? "translateY(0px)" : "translateY(100%)")};
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
`;

const CloseButton = styled('button')`
    ${resetButton}  
    position: absolute;
    top: 20px;
    right: 25px;
    z-index: 10;
    height: 23px;
    width: 23px;
    ${hoverActive}

    @media (max-width: ${screen.lMobileScreenWidthAbove}){
        display: none;
    }
`;

const CloseSwipe = styled('div')`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 30px;

    @media (min-width: ${screen.lMobileScreenWidthAbove}){
        display: none;
    }
`;

const SwipeLine = styled('div')`
    height: 4px;
    width: 25%;
    background-color: ${colors.lightGray};
    margin: 15px auto;
    border-radius: ${borders.defaultRadius};
`;

const Modal = ({
    isOpen,
    onClose,
    closeIcon,
    children,
    zIndex,
    styleContent,
    styleWrapper
}: ModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const { t } = useTranslation();

    const closModal = () => {
        if (!!onClose) {
            setIsVisible(false);

            setTimeout(() => {
                onClose();
                document.body.style.overflow = "auto";
            }, 300);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setIsVisible(true);
        } else {
            document.body.style.overflow = "auto";
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleTouschStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const touchEnd = e.changedTouches[0].clientY;

        if (touchEnd - touchStart > 100) {
            closModal();
        }
    };

    if (!isOpen) {
        return null;
    };

    return (
        <ModalSection
            onMouseDown={closModal}
            tabIndex={-1}
            $zindex={zIndex || 1}
            style={styleWrapper}
        >
            <ModalContent
                onMouseDown={(e) => e.stopPropagation()}
                $visible={isVisible}
                style={styleContent}
            >
                {closeIcon && (
                    <>
                        <CloseButton
                            title={t('close')}
                            onClick={closModal}
                        >
                            <img src={close} alt={t('close')} />
                        </CloseButton>

                        <CloseSwipe 
                            onTouchStart={handleTouschStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <SwipeLine/>
                        </CloseSwipe>
                    </>
                )}

                {children}
            </ModalContent>
        </ModalSection>
    );
};

export default Modal;
