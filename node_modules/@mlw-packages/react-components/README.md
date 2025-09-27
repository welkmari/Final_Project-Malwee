
# @mlw-packages/react-components

Biblioteca de componentes React reutilizáveis, focada em acelerar o desenvolvimento de aplicações web modernas, acessíveis e com design consistente. Construída com Tailwind CSS para máxima customização, performance e escalabilidade.

---

## Instalação

Instale via npm ou yarn:

```bash
npm install @mlw-packages/react-components
# ou
yarn add @mlw-packages/react-components
```

---

##  Uso Básico

Importe os componentes que precisa e use direto no JSX:

```tsx
import { ButtonBase, CardBase } from '@mlw-packages/react-components';

export function App() {
  return (
    <CardBase>
      <ButtonBase>Meu botão</ButtonBase>
    </CardBase>
  );
}
```

---

## Componentes Disponíveis

A biblioteca oferece uma gama completa de componentes UI prontos para produção, todos estilizados com Tailwind CSS e pensados para alta acessibilidade:

- **ButtonBase** — Botões com variantes e estados customizados.
- **CardBase** — Containers card com estrutura padrão.
- **InputBase**, **SelectBase**, **ComboboxBase** — Controles de formulário modernos.
- **CheckboxBase**, **SwitchBase** — Inputs booleanos.
- **TabsBase**, **TableBase**, **TooltipBase**, **DialogBase**, **DrawerBase** — Navegação e modais.
- **SidebarBase**, **AvatarBase**, **CalendarBase**, **CarouselBase**, **ProgressBase**, **SkeletonBase** — Componentes utilitários e visuais.
- **SonnerBase** — Sistema de notificações toast com feedback visual.

> Para a lista completa, confira a pasta `src/components/ui` no código fonte.

---

## Estilos e Customização

Todos os componentes são estilizados com **Tailwind CSS**. Para que funcionem corretamente, seu projeto deve estar configurado com Tailwind.

Importe o CSS global para aplicar estilos base da biblioteca:

```tsx
import '@mlw-packages/react-components/style/global.css';
```

A arquitetura dos componentes segue as melhores práticas:

- **Código limpo e DRY** para facilitar manutenção e evolução.
- **Alta performance** com React 18 e otimizações internas.
- **Flexibilidade** para customizar via props, classes e hooks.

---

## Data-testid para Testes Automatizados

Todos os componentes aceitam **props opcionais** para customizar `data-testid` nos elementos internos, garantindo que seu time de QA consiga criar testes e2e robustos e confiáveis.

Exemplo no `ComboboxBase`:

```tsx
<ComboboxBase
  items={items}
  renderSelected={renderSelected}
  handleSelection={handleSelection}
  checkIsSelected={checkIsSelected}
  searchPlaceholder="Busque uma opção"
  testIds={{
    root: "combobox-root",
    trigger: "combobox-trigger",
    popover: "combobox-popover",
    option: (value) => `combobox-option-${value}`,
  }}
/>
```

---

## Documentação e Exemplos

Explore exemplos completos e documentação técnica na pasta `src/pages` dentro do repositório, incluindo:

- Uso avançado de componentes.
- Configurações de tema e responsividade.
- Exemplos de integração com testes e acessibilidade.

---

## Contribuição

Contribuições são super bem-vindas!

---

## Licença

MIT License — sinta-se livre para usar, modificar e distribuir.
