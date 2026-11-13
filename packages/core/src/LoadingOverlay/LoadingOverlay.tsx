import { useComponentProps } from "@countify-oficial/provider";
import type { ComponentPropsWithRef } from "react";
import { Loader, type LoaderProps } from "../Loader/Loader";
import { Overlay, type OverlayOwnProps } from "../Overlay/Overlay";
import { Transition } from "../Transition/Transition";

export interface LoadingOverlayProps extends Omit<ComponentPropsWithRef<"div">, "className" | "style"> {
  /** Mostra o véu com o girador. */
  visible: boolean;
  /** Props do Loader. */
  loaderProps?: LoaderProps | undefined;
  /** Props do Overlay (opacidade, canto, camada). */
  overlayProps?: Omit<OverlayOwnProps, "center"> | undefined;
}

/**
 * Véu com girador sobre um elemento (o pai precisa de position: relative), para uma ação que trava a área (salvando).
 * Para carregar conteúdo, a Countify usa SkeletonLoader.
 */
export function LoadingOverlay(props: LoadingOverlayProps) {
  const { visible, loaderProps, overlayProps, ...rest } = useComponentProps("LoadingOverlay", {}, props);
  return (
    <Transition mounted={visible} transition="fade" duration="fast">
      {(style) => (
        <Overlay center {...overlayProps} {...rest} style={style} aria-busy>
          <Loader {...loaderProps} />
        </Overlay>
      )}
    </Transition>
  );
}
