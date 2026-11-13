import { useControllableState } from "@countify-oficial/hooks";
import { useComponentProps, useMessages } from "@countify-oficial/provider";
import { useState, type ChangeEvent } from "react";
import { CloseButton } from "../CloseButton/CloseButton";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";

interface FileInputBase extends Omit<InputBaseOwnProps, "rightSection"> {
  /** Tipos aceitos (image/*, .pdf…). */
  accept?: string | undefined;
  /** Texto com nada escolhido. */
  placeholder?: string | undefined;
  /** Botão de limpar quando há arquivo. */
  clearable?: boolean | undefined;
  name?: string | undefined;
}

export type FileInputProps =
  | (FileInputBase & { multiple?: false | undefined; value?: File | null | undefined; defaultValue?: File | null | undefined; onChange?: ((file: File | null) => void) | undefined })
  | (FileInputBase & { multiple: true; value?: File[] | undefined; defaultValue?: File[] | undefined; onChange?: ((files: File[]) => void) | undefined });

/** Campo que escolhe arquivo e mostra o nome. Só na web e no Electron. */
export function FileInput(props: FileInputProps) {
  const messages = useMessages();
  const { accept, placeholder, clearable, name, multiple, value, defaultValue, onChange, disabled, leftSection, ...rest } = useComponentProps("FileInput", {}, props);
  const [arquivos, setArquivos] = useControllableState<File[]>({
    value: value === undefined ? undefined : Array.isArray(value) ? value : value ? [value] : [],
    defaultValue: Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [],
    onChange: (lista) => (multiple ? (onChange as ((f: File[]) => void) | undefined)?.(lista) : (onChange as ((f: File | null) => void) | undefined)?.(lista[0] ?? null)),
  });
  const [seletor, setSeletor] = useState<HTMLInputElement | null>(null);
  const escolher = (e: ChangeEvent<HTMLInputElement>) => {
    setArquivos(Array.from(e.currentTarget.files ?? []));
    e.currentTarget.value = "";
  };
  return (
    <>
      <InputBase
        {...rest}
        disabled={disabled}
        component="button"
        type="button"
        onClick={() => seletor?.click()}
        data-placeholder={arquivos.length === 0 || undefined}
        leftSection={leftSection ?? <Icon name="upload" />}
        rightSection={clearable && arquivos.length > 0 ? <CloseButton aria-label={messages.clear} color="text2" onClick={() => setArquivos([])} /> : undefined}
      >
        {arquivos.length > 0 ? arquivos.map((a) => a.name).join(", ") : placeholder}
      </InputBase>
      <input ref={setSeletor} type="file" hidden accept={accept} name={name} multiple={multiple} disabled={disabled} onChange={escolher} />
    </>
  );
}
