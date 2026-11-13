import { NavLink, ScrollArea, Scroller, Tabs } from "@countify-oficial/core";
import type { Meta, StoryObj } from "@storybook/react-vite";

const lojas = ["Lume Jardins", "Lume Aldeota", "Lume Orla", "Lume Centro", "Lume Meireles", "Lume Cocó", "Lume Pinheiros", "Lume Moema"];

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  args: { "aria-label": "Lojas", style: { height: "calc(4 * var(--cf-list-row-height))", maxWidth: "var(--cf-side-panel-width)" } },
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

const Lista = () => lojas.map((l) => <NavLink key={l} href={`#${l}`} label={l} />);

export const Padrao: Story = { render: (a) => <ScrollArea {...a}><Lista /></ScrollArea> };
export const SempreComBarra: Story = { name: "Barra sempre (always)", render: (a) => <ScrollArea {...a} type="always"><Lista /></ScrollArea> };
export const SemBarra: Story = { name: "Sem barra (never)", render: (a) => <ScrollArea {...a} type="never"><Lista /></ScrollArea> };
export const Fileira: Story = {
  name: "Scroller (fileira com setas)",
  render: () => (
    <div style={{ maxWidth: "var(--cf-side-panel-width)" }}>
      <Tabs variant="chips" defaultValue="Lume Jardins">
        <Scroller>
          <Tabs.List aria-label="Lojas">{lojas.map((l) => <Tabs.Tab key={l} value={l}>{l}</Tabs.Tab>)}</Tabs.List>
        </Scroller>
      </Tabs>
    </div>
  ),
};
