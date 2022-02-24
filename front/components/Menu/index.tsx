import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  style: CSSProperties;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}
const Menu: FC<Props> = ({ closeButton, style, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    // 부모태그로 이벤트가 버블링되지 않음
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
