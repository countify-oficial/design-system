import { useState, type ChangeEvent, type ReactNode } from "react";

interface FileButtonBase {
  /** Tipos aceitos, como no <input type="file"> (image/*, .pdf…). */
  accept?: string | undefined;
  /** name do campo, para formulários. */
  name?: string | undefined;
  /** id do <form>, se o campo estiver fora dele. */
  form?: string | undefined;
  disabled?: boolean | undefined;
  /** Câmera do celular (user ou environment). */
  capture?: boolean | "user" | "environment" | undefined;
  /** Desenha o botão: espalhe as props recebidas nele ({ onClick, disabled }). */
  children: (props: { onClick: () => void; disabled: boolean | undefined }) => ReactNode;
}

export type FileButtonProps =
  | (FileButtonBase & { multiple?: false | undefined; onChange: (file: File | null) => void })
  | (FileButtonBase & { multiple: true; onChange: (files: File[]) => void });

/** Abre a escolha de arquivo a partir de qualquer botão. Só na web e no Electron. */
export function FileButton(props: FileButtonProps) {
  const { accept, name, form, disabled, capture, children } = props;
  const [campo, setCampo] = useState<HTMLInputElement | null>(null);
  const aoEscolher = (e: ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.currentTarget.files ?? []);
    if (props.multiple) props.onChange(arquivos);
    else props.onChange(arquivos[0] ?? null);
    // limpa para que escolher o mesmo arquivo de novo também avise
    e.currentTarget.value = "";
  };
  return (
    <>
      {children({ onClick: () => campo?.click(), disabled })}
      <input
        ref={setCampo}
        type="file"
        hidden
        accept={accept}
        name={name}
        form={form}
        disabled={disabled}
        capture={capture}
        multiple={props.multiple}
        onChange={aoEscolher}
      />
    </>
  );
}
