import { colors } from "@countify-oficial/tokens";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Fieldset, JsonInput, MaskInput, NumberInput, PasswordInput, PhoneInput, PinInput, Textarea, TextInput } from "../src";

const l = colors.light;

describe("campos de texto (React Native)", () => {
  it("TextInput: rótulo vira o nome; foco acende a borda de destaque sem mexer no texto", async () => {
    await render(<TextInput label="E-mail" description="O de acesso" placeholder="ana@loja.com.br" />);
    const campo = screen.getByLabelText("E-mail");
    const caixa = campo.parent;
    if (!caixa) throw new Error("sem caixa");
    expect(caixa).toHaveStyle({ minHeight: 48, borderRadius: 12, backgroundColor: l.field, borderWidth: 0, paddingHorizontal: 16 });
    await fireEvent(campo, "focus");
    expect(caixa).toHaveStyle({ borderWidth: 2, borderColor: l.accent, paddingHorizontal: 14 });
    expect(screen.getByText("O de acesso")).toHaveStyle({ color: l.text2, fontSize: 15 });
  });

  it("erro: borda vermelha e mensagem anunciada", async () => {
    await render(<TextInput label="E-mail" error="E-mail inválido" />);
    expect(screen.getByRole("alert")).toHaveTextContent("E-mail inválido");
    expect(screen.getByLabelText("E-mail").parent).toHaveStyle({ borderColor: l.down });
  });

  it("Textarea tem várias linhas; disabled não deixa editar", async () => {
    await render(<><Textarea label="Observação" /><TextInput label="Nome" disabled /></>);
    expect(screen.getByLabelText("Observação").props).toMatchObject({ multiline: true, numberOfLines: 3 });
    expect(screen.getByLabelText("Nome").props).toMatchObject({ editable: false });
  });

  it("PasswordInput mostra e oculta", async () => {
    await render(<PasswordInput label="Senha" />);
    expect(screen.getByLabelText("Senha").props).toMatchObject({ secureTextEntry: true });
    await fireEvent.press(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(screen.getByLabelText("Senha").props).toMatchObject({ secureTextEntry: false });
  });

  it("NumberInput lê pt-BR e os botões respeitam o mínimo", async () => {
    const aoMudar = jest.fn();
    await render(<NumberInput label="Área" onChange={aoMudar} suffix="m²" />);
    await fireEvent.changeText(screen.getByLabelText("Área"), "1284,5");
    expect(aoMudar).toHaveBeenLastCalledWith(1284.5);
    await render(<NumberInput label="Câmeras" defaultValue={1} min={1} withControls />);
    expect(screen.getByRole("button", { name: "Diminuir" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("button", { name: "Aumentar" }));
    expect(screen.getByLabelText("Câmeras").props.value).toBe("2");
  });

  it("NumberInput: ao sair, arredonda a decimalScale (o valor é o que o campo mostra)", async () => {
    const aoMudar = jest.fn();
    await render(<NumberInput label="Preço" decimalScale={2} onChange={aoMudar} />);
    await fireEvent.changeText(screen.getByLabelText("Preço"), "10,555");
    await fireEvent(screen.getByLabelText("Preço"), "blur");
    expect(aoMudar).toHaveBeenLastCalledWith(10.56);
  });

  it("JsonInput avisa JSON inválido ao sair", async () => {
    await render(<JsonInput label="Config" />);
    await fireEvent.changeText(screen.getByLabelText("Config"), "{ruim");
    await fireEvent(screen.getByLabelText("Config"), "blur");
    expect(screen.getByRole("alert")).toHaveTextContent("JSON inválido");
  });

  it("MaskInput e PhoneInput formatam ao digitar", async () => {
    const cpf = jest.fn();
    await render(<><MaskInput label="CPF" mask="999.999.999-99" onChange={cpf} /><PhoneInput label="Telefone" /></>);
    await fireEvent.changeText(screen.getByLabelText("CPF"), "12345678901");
    expect(cpf).toHaveBeenLastCalledWith("123.456.789-01", "12345678901");
    await fireEvent.changeText(screen.getByLabelText("Telefone"), "85999990000");
    expect(screen.getByLabelText("Telefone").props.value).toBe("(85) 99999-0000");
  });

  it("PinInput: caixas com nome, colar preenche e completa", async () => {
    const pronto = jest.fn();
    await render(<PinInput onComplete={pronto} />);
    expect(screen.getByLabelText("Código, 4 de 4")).toBeOnTheScreen();
    // a caixa cheia é selecionada ao focar: digitar troca o algarismo
    expect(screen.getByLabelText("Código, 2 de 4").props.selectTextOnFocus).toBe(true);
    await fireEvent.changeText(screen.getByLabelText("Código, 1 de 4"), "12a34");
    expect(pronto).toHaveBeenCalledWith("1234");
  });

  it("Fieldset: legenda como título; disabled bloqueia o toque", async () => {
    await render(<Fieldset legend="Endereço" disabled><Text>dentro</Text></Fieldset>);
    expect(screen.getByRole("header", { name: "Endereço" })).toBeOnTheScreen();
  });
});
