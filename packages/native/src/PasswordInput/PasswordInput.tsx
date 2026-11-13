import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseProps } from "../Input/Input";

export type PasswordInputProps = Omit<InputBaseProps, "rows" | "secureTextEntry" | "rightSection"> & {
  visible?: boolean | undefined;
  defaultVisible?: boolean | undefined;
  onVisibilityChange?: ((visible: boolean) => void) | undefined;
};

/** Campo de senha com o botão de mostrar e ocultar. */
export function PasswordInput(props: PasswordInputProps) {
  const messages = useMessages();
  const { visible, defaultVisible, onVisibilityChange, disabled, ...rest } = useComponentProps("PasswordInput", {}, props);
  const [aMostra, setAMostra] = useControllableState({ value: visible, defaultValue: defaultVisible ?? false, onChange: onVisibilityChange });
  return (
    <InputBase
      autoComplete="current-password"
      autoCapitalize="none"
      {...rest}
      disabled={disabled}
      secureTextEntry={!aMostra}
      rightSection={
        <ActionIcon accessibilityLabel={aMostra ? messages.hidePassword : messages.showPassword} color="text2" disabled={disabled} onPress={() => setAMostra(!aMostra)}>
          <Icon name={aMostra ? "eye-off" : "eye"} />
        </ActionIcon>
      }
    />
  );
}
