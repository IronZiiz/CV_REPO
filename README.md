# Portfólio — um site construído por context engineering

Este repositório tem duas partes:

```
context-engineering/   as especificações que dirigiram a construção
site/                  o site que saiu delas (React 19 + TypeScript + Vite)
```

O site é o artefato. O que está sendo demonstrado aqui é o **método**: construir
software dirigindo um agente de código por especificação, não por prompts soltos.

Este README descreve a estrutura de contexto em detalhe, porque é ela o objeto de
estudo. Quem quiser apenas rodar o site encontra as instruções em
[`site/README.md`](site/README.md).

---

## 1. O problema que a estrutura resolve

Um agente de código recebe pedidos em linguagem natural e produz arquivos. Sem
estrutura, três coisas falham de maneira previsível:

| Falha | Como aparece na prática |
|---|---|
| **Deriva** | O agente reinterpreta decisões antigas a cada nova sessão; a paleta muda sozinha, o espaçamento oscila. |
| **Conflito** | Duas fontes pedem coisas incompatíveis (o layout quer um cinza, a paleta quer outro) e o agente escolhe em silêncio. |
| **Invenção** | Faltando um dado, o agente preenche a lacuna com algo plausível — num portfólio, isso significa inventar sua experiência profissional. |

A estrutura abaixo foi escrita contra essas três falhas, e cada decisão de design
dela existe por causa de uma delas.

---

## 2. Mapa dos arquivos

```
context-engineering/
├── AGENT_INSTRUCTIONS.md     ponto de entrada: regras, fluxo e hierarquia
├── SITE_LAYOUT.pdf           autoridade máxima de estrutura e visual
├── PALLET.md                 cores
├── BACKGROUND.md             shader WebGL do fundo animado
├── BUTTONS_RULES.md          comportamento de cada botão
├── BUTTONS_STYLE.md          referência visual dos botões
├── CARDS CONTEXT.md          cards de stack e de projeto
├── PROJECTS CONTEXT.md       conteúdo dos projetos e links
└── TRANSLATION_RULES.md      regras de tradução + glossário aprovado
```

São 9 documentos, cerca de mil linhas. A divisão não é por tipo de arquivo nem por
componente: é **por área de decisão**. Cada arquivo responde a uma pergunta que o
agente vai fazer enquanto trabalha ("que cor uso aqui?", "como traduzo este termo?"),
e o `AGENT_INSTRUCTIONS` diz qual arquivo consultar para cada área.

### O ponto de entrada

`AGENT_INSTRUCTIONS.md` é o único arquivo que o agente lê por obrigação, sempre e
inteiro. Ele contém:

1. **A stack** — React (Vite) + TypeScript + Tailwind + estrutura shadcn.
2. **O mapa área → arquivo** — uma tabela que liga cada parte da interface ao seu
   documento de contexto. É o que evita que o agente adivinhe onde está a resposta.
3. **A hierarquia de autoridade** (seção 3).
4. **O fluxo de trabalho obrigatório** (seção 7).
5. **Os critérios de "etapa pronta"** (seção 9) e uma lista do que nunca fazer
   (seção 10).

---

## 3. Hierarquia de autoridade

A decisão mais importante da estrutura. Especificações escritas por pessoas
diferentes, em momentos diferentes, **vão** se contradizer — e o pior resultado
possível é o agente resolver o conflito em silêncio.

A regra, em ordem:

1. **`SITE_LAYOUT.pdf` manda.** Se um arquivo de estilo conflita com ele, o estilo
   cede e é adaptado para caber no layout.
2. O agente **pode** decidir sozinho esses conflitos — inclusive fugir da paleta ou
   das regras de botão quando necessário — mas **toda decisão precisa ser
   registrada** no `DECISIONS.md`, com arquivo, o que mudou e por quê.
3. Em texto de projeto, se o resumo e a nota-fonte divergirem, **vale a nota**.
4. O `AGENT_INSTRUCTIONS` prevalece sobre qualquer prompt posterior no que diz
   respeito às imagens.

O ponto não é impedir o desvio: é tornar o desvio **visível**. Um agente que nunca
pode divergir trava no primeiro conflito; um que diverge em silêncio produz um
resultado que ninguém consegue auditar depois.

---

## 4. Fluxo de trabalho

Seis passos, obrigatórios por etapa:

```
ler → planejar → [aprovação] → executar → verificar → registrar
```

1. **Ler** os arquivos de contexto relevantes antes de tocar em qualquer código.
2. **Planejar**: apresentar o que será feito, arquivos afetados, decisões previstas.
   *Nenhum arquivo é alterado antes do "ok".*
3. **Executar**, narrando o que está lendo e alterando.
4. **Verificar** no navegador — layout, mobile, troca de idioma, imagens, textos.
5. **Registrar** a etapa no `DECISIONS.md`.
6. **Parar** e esperar. Nunca avançar para a etapa seguinte sozinho.

O passo 2 é o que dá valor ao resto: é mais barato corrigir um plano de cinco linhas
do que uma implementação de quinhentas.

---

## 5. O registro de decisões

[`site/DECISIONS.md`](site/DECISIONS.md) é a saída auditável do processo, e na
prática é o documento mais útil do repositório. Cada etapa registra:

- **Conflitos de estilo resolvidos** — arquivo, o que mudou, por quê.
- **Placeholders usados** — qual imagem faltou e onde entrou o substituto.
- **Traduções geradas** para revisão humana antes de publicar.
- **Divergências** entre o resumo dos projetos e as notas-fonte.

Exemplos reais que estão lá:

| Conflito | Resolução registrada |
|---|---|
| A pílula "Baixar CV" do layout usava um cinza `#B0B0B0` | Escurecido para `#6B7280`: texto branco sobre o cinza original tinha contraste ≈2:1, ilegível. |
| A paleta, aplicada ao dark mode | Trocada por tons mais claros dos mesmos matizes — as cores originais ficavam ≈3,5:1 no fundo escuro. |
| `BUTTONS_RULES.md` referencia um `[[FIGMA_CONTEXT]]` | O arquivo não existe; usadas as duas páginas do `SITE_LAYOUT.pdf` como referência. Lacuna registrada. |

Repare no padrão: em todos os casos a especificação estava **errada**, e o valor do
registro é mostrar que o desvio foi deliberado e fundamentado, e não um deslize.

---

## 6. Tradução como contrato

`TRANSLATION_RULES.md` é o arquivo mais longo, e merece atenção por um motivo
estrutural: tradução é onde a invenção é mais difícil de detectar. Ele define
objetivo, público, tom, princípios (fidelidade semântica, naturalidade, consistência),
padrões gramaticais e um **glossário aprovado**.

A regra de processo importa mais que o conteúdo: o agente **propõe** os termos, mostra
a lista, e só grava no arquivo depois de aprovação. A partir daí o glossário é a
fonte oficial — qualquer tradução que o contrarie é um erro, não uma escolha.

O mesmo princípio aparece no código: nenhum texto fica escrito dentro de componentes.
Tudo vive em `pt.json` / `en.json`, e a tipagem **quebra o build** se as duas línguas
divergirem em chaves. A regra deixa de depender de disciplina e passa a ser mecânica.

---

## 7. O que a estrutura impede explicitamente

A seção 10 do `AGENT_INSTRUCTIONS` lista o que nunca fazer. A mais importante:

> Inventar informações sobre meus projetos ou experiência que não estejam nas notas.

Num portfólio isso não é preciosismo. Um agente que preenche lacunas com texto
plausível produz um currículo com conquistas que não aconteceram — e quem responde
por isso numa entrevista é a pessoa, não o modelo. Por isso as notas de projeto são
declaradas **fonte de verdade** e vencem qualquer resumo, e por isso a lacuna vira
placeholder registrado em vez de suposição.

---

## 8. O que não está neste repositório

Omitido de propósito:

- **As 4 notas de projeto** que servem de fonte de verdade para os textos (material
  interno sobre trabalho profissional).
- **As capturas originais** dos sistemas da empresa, em `IMGS/`.

O `PROJECTS CONTEXT.md` ainda as referencia pelo nome, no formato `[[nota]]` — as
referências foram mantidas porque fazem parte da estrutura que este README descreve:
elas mostram *onde* a fonte de verdade entra no fluxo. As capturas que aparecem no
site são de um ambiente de demonstração com **dados fictícios**.

---

## 9. Rodando o site

```bash
cd site
npm install
npm run dev      # servidor local
npm run build    # typecheck + build de produção
npm run lint
```

O `build` roda `tsc -b` antes do Vite, então divergência entre `pt.json` e `en.json`
falha aqui.

---

## 10. Honestidade sobre o método

Duas ressalvas, para quem for avaliar isto como abordagem e não como demo:

**Não é de graça.** Escrever mil linhas de especificação custa tempo real. Num
projeto desta escala, a maior parte do esforço ficou antes da primeira linha de
código. O retorno aparece na segunda sessão, quando o contexto já existe e o agente
não precisa redescobrir nada — e em projetos de vida curta esse retorno pode nunca
chegar.

**Especificação não substitui revisão.** Todo conflito na tabela da seção 5 foi
encontrado *executando* e olhando o resultado, não lendo os documentos. A estrutura
reduz a deriva e torna as decisões auditáveis; ela não verifica se o resultado está
certo. O passo 4 do fluxo existe exatamente por isso.
