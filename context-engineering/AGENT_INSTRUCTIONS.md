# AGENT_INSTRUCTIONS

Você é o agente que constrói o meu site pessoal/portfólio. Este arquivo é o ponto de entrada: leia-o inteiro antes de qualquer ação e siga-o durante todo o trabalho.

## 1. Stack
- React (Vite) + TypeScript + Tailwind CSS + estrutura shadcn (componentes em `/components/ui`).
- Se o projeto ainda não tiver essa base, proponha a configuração no plano da primeira etapa.

## 2. Mapa de arquivos de contexto
Consulte cada arquivo **antes** de trabalhar na área correspondente.

| Área | Arquivo |
|---|---|
| Layout geral, seções, hierarquia | `SITE_LAYOUT.pdf` (autoridade máxima de estrutura e visual) |
| Tradução e botão de idioma | `TRANSLATION_RULES.md` |
| Botões | `BUTTONS_STYLE.md` + `BUTTONS_RULES.md` |
| Background | `BACKGROUND.md` |
| Cards de stack | `CARDS CONTEXT.md` |
| Cores e paleta | `PALLET.md` |
| Conteúdo dos projetos | `PROJECTS CONTEXT.md` (estrutura e resumo dos cards) |
| Detalhes dos projetos (fonte de verdade) | as 4 notas: API Analítica FastAPI (RCM), Dashboard Analítico Comercial (RCM), Fine-tuning de Cellpose-SAM (Neuroinformatics), I Hackathon de Dados UFPR |
| Imagens | pasta `IMGS/` |

## 3. Prioridade e conflitos
1. `SITE_LAYOUT.pdf` manda. Se um arquivo de estilo conflitar com ele, adapte o estilo para caber no layout.
2. Você pode decidir sozinho esses conflitos (incluindo, se necessário, fugir da `PALLET` ou das `BUTTONS_RULES`), mas **toda decisão deve ser registrada** no `DECISIONS.md` (arquivo, o que mudou, por quê) e informada a mim.
3. Nos textos de projetos, se `PROJECTS CONTEXT` e uma das 4 notas divergirem, vale a nota. Registre a divergência.
4. Este `AGENT_INSTRUCTIONS` prevalece sobre qualquer prompt complementar quando se trata da **imagem de perfil e das imagens dos projetos**. Nos demais casos, o prompt complementar vale como referência de estilo.

## 4. Prompts complementares (BUTTONS_STYLE, BACKGROUND, CARDS CONTEXT etc.)
- Trate o componente de exemplo como **referência visual e comportamental**, não como código para copiar cegamente.
- Leia o componente, extraia animação, estados, tamanhos e transições, e reescreva para o elemento pedido, respeitando a paleta e o layout.
- Ignore instruções de instalação ou de imagens que conflitem com este arquivo (ex.: "use Unsplash").

## 5. Imagens
- Use **somente** as imagens de `IMGS/` (`PORTRAIT`, `ALURA_ICON`, `API_SCREENSHOT`, `DASHBOARD_SCREEENSHOT`, `FINETUNNING_PROJECT_IMAGE`). Confira os nomes reais dos arquivos (há grafia irregular).
- Nunca use Unsplash ou imagens externas.
- Se faltar uma imagem, use um **placeholder neutro** e registre no `DECISIONS.md` qual faltou e onde o placeholder entrou.

## 6. Idiomas e tradução
- Idiomas: português (fonte) e inglês.
- Idioma inicial, em ordem: (1) escolha salva em `localStorage`; (2) `navigator.language` começando com `pt` → português; (3) qualquer outro → inglês.
- O botão de idioma permite troca manual, e a escolha é salva e passa a ter prioridade.
- Textos em arquivos separados (`pt.json`, `en.json`), sem texto fixo nos componentes.
- O conteúdo-fonte está em português. Você gera a versão em inglês e **lista tudo o que traduziu** no `DECISIONS.md` para eu revisar antes de publicar.
- Termos técnicos: no português, a **primeira ocorrência por página** traz o termo em inglês + tradução entre parênteses, por exemplo "fine-tuning (ajuste fino)". Nas seguintes, só o termo em inglês. No inglês, sem parênteses.
- Nomes próprios de projetos e ferramentas (Cellpose-SAM, FastAPI, Prophet etc.) nunca são traduzidos nem recebem parênteses.
- Glossário: **proponha** os termos e traduções a partir do conteúdo, mostre a lista e só grave no `TRANSLATION_RULES.md` depois do meu "ok". Depois disso, o glossário é a fonte oficial.

## 7. Fluxo de trabalho (obrigatório)
1. **Ler**: antes de cada etapa, leia os arquivos de contexto relevantes.
2. **Planejar**: apresente o plano da etapa (o que fará, arquivos afetados, decisões previstas). **Não altere nenhum arquivo antes do meu "ok".**
3. **Executar**: aplique as mudanças, narrando brevemente no terminal o que está lendo e alterando.
4. **Servidor local**: na primeira etapa, suba `npm run dev` e abra o site no navegador. Mantenha-o rodando durante todo o trabalho para eu ver a página mudando ao vivo.
5. **Verificar**: ao fim da etapa, abra o site no navegador e confira o resultado (layout, responsivo/mobile, botão de idioma, imagens, textos). Corrija o que falhar antes de avisar.
6. **Registrar**: atualize o `DECISIONS.md` com um registro da etapa.
7. **Parar**: relate o resultado e **espere meu "ok"**. Só então apresente o plano da próxima etapa. Nunca avance sozinho.

## 8. DECISIONS.md (raiz do projeto)
Um registro por etapa, com:
- Conflitos de estilo resolvidos (arquivo, o que mudou, por quê).
- Placeholders usados (qual imagem faltou, onde entrou).
- Traduções geradas para eu revisar.
- Termos do glossário propostos/aprovados.
- Divergências encontradas entre `PROJECTS CONTEXT` e as notas.

## 9. Critérios de "etapa pronta"
- Segue o `SITE_LAYOUT.pdf`.
- Usa as cores da `PALLET` (ou a exceção está registrada).
- Funciona em desktop e mobile.
- Botão de idioma funciona nos dois sentidos e persiste a escolha.
- Sem texto fixo fora de `pt.json`/`en.json`.
- Verificado no navegador, sem erros no console.
- `DECISIONS.md` atualizado.

## 10. O que nunca fazer
- Alterar arquivos sem plano aprovado.
- Avançar de etapa sem o meu "ok".
- Inventar informações sobre meus projetos ou experiência que não estejam nas notas.
- Usar imagens externas.
- Deixar decisões autônomas sem registro.