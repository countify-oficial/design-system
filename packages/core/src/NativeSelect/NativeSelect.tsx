import { useComponentProps } from "@countify-oficial/provider";
import { Icon } from "../Icon/Icon";
import { InputBase, type InputBaseOwnProps } from "../Input/Input";
import type { PolymorphicProps } from "../polymorphic";

export interface NativeSelectItem {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export type NativeSelectProps = PolymorphicProps<
  "select",
  Omit<InputBaseOwnProps, "rightSection"> & {
    /** Opções: textos ou { value, label, disabled }. */
    data: (string | NativeSelectItem)[];
    /** Primeira opção, vazia, com este texto. */
    placeholder?: string | undefined;
  }
>;

/** O <select> do navegador com a aparência de campo. No celular do app, use Select. */
export function NativeSelect(props: NativeSelectProps) {
  const { data, placeholder, ...rest } = useComponentProps("NativeSelect", {}, props);
  return (
    <InputBase {...rest} component="select" rightSection={<Icon name="chevron-down" />} rightSectionPointerEvents="none">
      {placeholder !== undefined && <option value="" disabled>{placeholder}</option>}
      {data.map((d) => {
        const item = typeof d === "string" ? { value: d, label: d } : d;
        return <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>;
      })}
    </InputBase>
  );
}
