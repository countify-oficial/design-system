import { useComponentProps } from "@countify-oficial/provider";
import { cloneElement, type ReactElement, type ReactNode } from "react";
import type { GestureResponderEvent } from "react-native";
import { Popover, PopoverDropdown, usePopoverContext } from "../Popover/Popover";

/** No celular não há hover: o cartão abre numa folha com o toque longo no alvo. */
function HoverCardTarget({ children }: { children: ReactElement<{ onLongPress?: ((e: GestureResponderEvent) => void) | undefined }> }) {
  const { setAberto, desligado } = usePopoverContext();
  return cloneElement(children, {
    onLongPress: (e: GestureResponderEvent) => {
      children.props.onLongPress?.(e);
      if (!desligado) setAberto(true);
    },
  });
}

export interface HoverCardProps {
  title?: ReactNode;
  disabled?: boolean | undefined;
  children?: ReactNode;
}

function HoverCardRoot(props: HoverCardProps) {
  const p = useComponentProps("HoverCard", {}, props);
  return <Popover {...p} />;
}

/** HoverCard: HoverCard.Target (toque longo) e HoverCard.Dropdown (a folha). */
export const HoverCard = Object.assign(HoverCardRoot, { Target: HoverCardTarget, Dropdown: PopoverDropdown });
