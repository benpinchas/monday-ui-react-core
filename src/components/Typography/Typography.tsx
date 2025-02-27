import React, { forwardRef, useRef, HTMLAttributes } from "react";
import cx from "classnames";
import { useMergeRefs } from "../../hooks";
import VibeComponentProps from "../../types/VibeComponentProps";
import VibeComponent from "../../types/VibeComponent";
import { getTestId } from "../../tests/test-ids-utils";
import { ComponentDefaultTestId } from "../../tests/constants";
import { ElementContent } from "../../types";
import { TypographyColor, TypographyAlign } from "./TypographyConstants";
import { useEllipsisClass, useTooltipProps } from "./TypographyHooks";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";
import styles from "./Typography.module.scss";

export interface TypographyProps extends VibeComponentProps, HTMLAttributes<HTMLElement> {
  /**
   * The element tag of the text component
   */
  element?: string;
  /**
   * The textual content
   */
  children: ElementContent;
  color?: TypographyColor;
  align?: TypographyAlign;
  /**
   * When the text is too long, cut the end of the text and display instead of it three dots (...)
   */
  ellipsis?: boolean;
  /**
   * Use this prop combined with the boolean ellipsis prop for truncate the text and add an ellipsis after a certain number of lines
   */
  maxLines?: number;
  /**
   * All props are passed to the tooltip displayed when hovering over the text. By default, the tooltip will display when text contains an ellipsis and will show the full text
   */
  tooltipProps?: TooltipProps;
  /**
   * Hide tooltip when hovering the text, by default the tooltip swill display when text contains an ellipsis
   */
  withoutTooltip?: boolean;
}

const Typography: VibeComponent<TypographyProps, HTMLElement> = forwardRef(
  (
    {
      className,
      id,
      children,
      tooltipProps,
      "data-testid": dataTestId = getTestId(ComponentDefaultTestId.TEXT, id),
      element = "span",
      color = "primary",
      align = "start",
      ellipsis = true,
      maxLines = 1,
      withoutTooltip = false,
      role,
      ...htmlAttributes
    },
    ref
  ) => {
    const componentRef = useRef(null);
    const mergedRef = useMergeRefs({ refs: [ref, componentRef] });
    const { ref: overrideRef, class: ellipsisClass } = useEllipsisClass(mergedRef, ellipsis, maxLines);
    const overrideTooltipProps = useTooltipProps(
      componentRef,
      withoutTooltip,
      ellipsis,
      tooltipProps,
      children
    ) as TooltipProps;

    return (
      <Tooltip {...overrideTooltipProps}>
        {React.createElement(
          element,
          {
            id,
            "data-testid": dataTestId,
            className: cx(styles.typography, styles[color], styles[align], ellipsisClass, className),
            ref: overrideRef,
            role,
            ...htmlAttributes
          },
          children
        )}
      </Tooltip>
    );
  }
);

export default Typography;
