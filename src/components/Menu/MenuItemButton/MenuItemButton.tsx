/* eslint-disable react/jsx-props-no-spreading */
import cx from "classnames";
import React, { FC, useRef } from "react";
import { ComponentDefaultTestId, getTestId } from "../../../tests/test-ids-utils";
import Button from "../../Button/Button";
import Tooltip from "../../Tooltip/Tooltip";
import useMergeRefs from "../../../hooks/useMergeRefs";
import useMenuItemMouseEvents from "../MenuItem/hooks/useMenuItemMouseEvents";
import useMenuItemKeyboardEvents from "../MenuItem/hooks/useMenuItemKeyboardEvents";
import { DialogPosition } from "../../../constants/positions";
import { backwardCompatibilityForProperties } from "../../../helpers/backwardCompatibilityForProperties";
import { SubIcon, VibeComponentProps, withStaticProps, ElementContent } from "../../../types";
import Text from "../../Text/Text";
import styles from "./MenuItemButton.module.scss";

interface MenuItemButtonProps extends VibeComponentProps {
  /** Backward compatibility for props naming **/
  classname?: string;
  menuId?: string;
  kind?: typeof MenuItemButton.kinds[keyof typeof MenuItemButton.kinds];
  leftIcon?: SubIcon;
  rightIcon?: SubIcon;
  index?: number;
  activeItemIndex?: number;
  disabled?: boolean;
  disableReason?: string;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  tooltipPosition?: DialogPosition;
  tooltipShowDelay?: number;
  resetOpenSubMenuIndex?: () => void;
  setSubMenuIsOpenByIndex?: (index: number, isOpen: boolean) => void;
  setActiveItemIndex?: (index: number) => void;
  menuRef?: React.RefObject<HTMLElement>;
  closeMenu?: () => void;
  useDocumentEventListeners?: boolean;
  children?: ElementContent | ElementContent[];
}

const MenuItemButton: FC<MenuItemButtonProps> & {
  kinds?: typeof Button.kinds;
  tooltipPositions?: typeof DialogPosition;
  isSelectable?: boolean;
  isMenuChild?: boolean;
} = ({
  className,
  // Backward compatibility for props naming
  classname,
  kind = MenuItemButton.kinds.PRIMARY,
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  disableReason,
  index,
  activeItemIndex = -1,
  onClick,
  menuId,
  tooltipPosition = MenuItemButton.tooltipPositions.RIGHT,
  tooltipShowDelay = 300,
  children,
  resetOpenSubMenuIndex,
  setSubMenuIsOpenByIndex,
  setActiveItemIndex,
  menuRef,
  closeMenu,
  useDocumentEventListeners,
  id,
  "data-testid": dataTestId
}) => {
  const ref = useRef(null);
  const referenceElementRef = useRef(null);
  const overrideClassName = backwardCompatibilityForProperties([className, classname]);
  const mergedRef = useMergeRefs({ refs: [ref, referenceElementRef] });

  const shouldShowTooltip = disabled && disableReason;
  const tooltipContent = disableReason;

  const isActive = activeItemIndex === index;

  const isMouseEnter = useMenuItemMouseEvents({
    ref,
    resetOpenSubMenuIndex,
    setSubMenuIsOpenByIndex,
    isActive,
    setActiveItemIndex,
    index,
    hasChildren: false
  });

  const { onClickCallback } = useMenuItemKeyboardEvents({
    onClick,
    disabled,
    isActive,
    index,
    setActiveItemIndex,
    hasChildren: false,
    shouldShowSubMenu: false,
    setSubMenuIsOpenByIndex,
    menuRef,
    isMouseEnter,
    closeMenu,
    useDocumentEventListeners
  });

  return (
    <Tooltip
      content={shouldShowTooltip ? tooltipContent : null}
      position={tooltipPosition}
      showDelay={tooltipShowDelay}
    >
      <Text
        size="small"
        element="li"
        data-testid={dataTestId || getTestId(ComponentDefaultTestId.MENU_ITEM_BUTTON, id)}
        id={id || `${menuId}-${index}`}
        className={cx(styles.itemButton, overrideClassName)}
        ref={mergedRef}
        role="menuitem"
        aria-current={isActive}
      >
        <Button
          className={styles.buttonComponent}
          active={isActive}
          disabled={disabled}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onClick={onClickCallback}
          kind={kind}
          size={Button.sizes.SMALL}
          blurOnMouseUp={false}
        >
          <div className={styles.content}>{children}</div>
        </Button>
      </Text>
    </Tooltip>
  );
};

Object.assign(MenuItemButton, {
  isSelectable: true,
  isMenuChild: true
});

export default withStaticProps(MenuItemButton, {
  kinds: Button.kinds,
  tooltipPositions: DialogPosition
});
