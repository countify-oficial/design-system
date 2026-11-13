import { useComponentProps } from "@countify-oficial/provider";
import { Loader, type LoaderProps } from "../Loader/Loader";
import { Overlay, type OverlayProps } from "../Overlay/Overlay";

export interface LoadingOverlayProps {
  visible: boolean;
  loaderProps?: LoaderProps | undefined;
  overlayProps?: Omit<OverlayProps, "center" | "children"> | undefined;
}

/** Véu com girador sobre o pai, para uma ação que trava a área. */
export function LoadingOverlay(props: LoadingOverlayProps) {
  const { visible, loaderProps, overlayProps } = useComponentProps("LoadingOverlay", {}, props);
  if (!visible) return null;
  return (
    <Overlay center {...overlayProps}>
      <Loader {...loaderProps} />
    </Overlay>
  );
}
