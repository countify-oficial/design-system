import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export type PasswordInputProps = PolymorphicProps<
  "input",
  InputBaseOwnProps & {
    /** Senha à mostra (controlado). */
    visible?: boolean | undefined;
    defaultVisible?: boolean | undefined;
    onVisibilityChange?: ((visible: boolean) => void) | undefined;
  }
>;

/** Campo de senha com o botão de mostrar e ocultar. */
export function PasswordInput(props: PasswordInputProps) {
  const messages = useMessages();
  const { visible, defaultVisible, onVisibilityChange, disabled, ...rest } = useComponentProps("PasswordInput", {}, props);
  const [aMostra, setAMostra] = useControllableState({ value: visible, defaultValue: defaultVisible ?? false, onChange: onVisibilityChange });
  return (
    <InputBase
      autoComplete="current-password"
      {...rest}
      disabled={disabled}
      component="input"
      type={aMostra ? "text" : "password"}
      rightSection={
        <ActionIcon aria-label={aMostra ? messages.hidePassword : messages.showPassword} color="text2" disabled={disabled} onClick={() => setAMostra(!aMostra)}>
          <Icon name={aMostra ? "eye-off" : "eye"} />
        </ActionIcon>
      }
    />
  );
}
