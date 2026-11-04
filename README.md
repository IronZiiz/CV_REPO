# Portfólio — um site construído por context engineering

Este repositório tem duas partes:

```
context-engineering/   as especificações que dirigiram a construção
site/                  o site que saiu delas (React 19 + TypeScript + Vite)
```

O site é o artefato. O que este README explica é a **técnica**: construir software
dirigindo um agente de código por um conjunto de documentos de contexto, e não por
prompts soltos. Para rodar o site, veja [`site/README.md`](site/README.md).

---

## 1. O problema

Um agente de código recebe pedidos em linguagem natural e produz arquivos. Sem
estrutura, três coisas falham de maneira previsível:

| Falha | O que acontece |
|---|---|
| **Deriva** | A cada nova sessão o agente reinterpreta decisões antigas, e o resultado muda sem que ninguém tenha pedido. |
| **Conflito** | Duas fontes pedem coisas incompatíveis e o agente escolhe uma em silêncio. |
| **Invenção** | Faltando um dado, o agente preenche a lacuna com algo plausível. |

Context engineering é desenhar o contexto que o agente recebe para que essas três
falhas fiquem difíceis de acontecer, ou fáceis de enxergar quando acontecem.

---

## 2. Contexto dividido por área de decisão

O contexto não é um prompt longo: é um conjunto de documentos curtos, e a divisão
entre eles não segue tipo de arquivo nem componente. Segue **a pergunta que o agente
vai fazer enquanto trabalha**: que cor usar, como um botão se comporta, como traduzir
um termo, o que dizer sobre um projeto. Cada pergunta tem um único documento que a
responde.

Assim o agente não precisa carregar tudo a cada passo, e cada decisão tem um lugar
óbvio para ser consultada e corrigida.

---

## 3. Um ponto de entrada

Um único documento é lido sempre e por inteiro: as instruções do agente. Ele não
contém as respostas, e sim o que permite encontrá-las:

- a stack e as convenções do projeto;
- o mapa **área → documento**, para que o agente nunca adivinhe onde está a resposta;
- a hierarquia de autoridade;
- o fluxo de trabalho obrigatório;
- o que conta como etapa pronta e o que nunca deve ser feito.

---

## 4. Hierarquia de autoridade

Especificações escritas em momentos diferentes **vão** se contradizer. O pior
resultado possível é o agente resolver o conflito em silêncio.

Por isso as fontes têm uma ordem explícita: uma referência principal vence as
demais, e o conteúdo-fonte vence qualquer resumo dele. O agente **pode** desviar de
uma regra de nível mais baixo quando ela não cabe na de nível mais alto, mas todo
desvio precisa ser registrado com o que mudou e por quê.

O objetivo não é impedir o desvio, e sim torná-lo **visível**. Um agente que nunca pode
divergir trava no primeiro conflito; um que diverge em silêncio produz um resultado que
ninguém consegue auditar.

---

## 5. Fluxo de trabalho por etapa

```
ler → planejar → [aprovação] → executar → verificar → registrar
```

1. **Ler** os documentos relevantes antes de tocar em qualquer código.
2. **Planejar**: o que será feito, quais arquivos mudam, quais decisões estão
   previstas. Nada é alterado antes da aprovação.
3. **Executar** o plano aprovado.
4. **Verificar** o resultado rodando, e não só lendo o código.
5. **Registrar** a etapa.
6. **Parar** e esperar a próxima instrução.

A aprovação no passo 2 é o que dá valor ao resto: corrigir um plano de cinco linhas
custa muito menos que corrigir uma implementação de quinhentas.

---

## 6. Registro de decisões

Cada etapa termina com uma entrada num registro de decisões: conflitos resolvidos,
lacunas preenchidas provisoriamente, textos gerados que ainda precisam de revisão
humana e divergências entre fontes.

O registro é a saída auditável do processo. Ele mostra que um desvio foi deliberado e
fundamentado, e não um deslize, e permite que uma sessão nova comece de onde a
anterior parou, sem redescobrir nada.

---

## 7. Regras que viram mecânica

Sempre que possível, uma regra do contexto vira algo que o próprio projeto verifica.
O site é bilíngue, por exemplo: nenhum texto fica dentro dos componentes, e a
tipagem quebra o build se os dois idiomas divergirem. A regra deixa de depender da
disciplina do agente.

Na tradução, o processo também é contratual: o agente propõe os termos, a pessoa
aprova, e a partir daí o glossário aprovado é a fonte oficial.

---

## 8. Nada de invenção

A regra mais importante: **o agente não inventa informação que não está nas fontes**.
Quando falta um dado, a lacuna vira um marcador registrado, e não uma suposição.

Num portfólio isso pesa mais que em qualquer outro projeto: texto plausível sobre
experiência profissional é um currículo com conquistas que não aconteceram, e quem
responde por isso é a pessoa, não o modelo.

---

## 9. Limites do método

**Não é de graça.** Escrever a especificação custa tempo real, e a maior parte do
esforço fica antes da primeira linha de código. O retorno aparece nas sessões
seguintes, quando o contexto já existe; em projetos de vida curta ele pode não chegar.

**Especificação não substitui revisão.** A estrutura reduz a deriva e torna as decisões
auditáveis, mas não verifica se o resultado está certo. Os problemas aparecem
executando e olhando o resultado, e por isso a verificação é um passo obrigatório do
fluxo.
