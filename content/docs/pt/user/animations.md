---

title: "Cria uma biblioteca de animações"
description: "Gera animações reutilizáveis com a tua marca, como um separador do logótipo, um cartão final e um oráculo, que o agente coloca em qualquer vídeo."
---

**Animações** guarda sobreposições e transições que o agente pode reutilizar em qualquer vídeo. Cada uma tem uma pré-visualização em ciclo, uma folha de miniaturas com seis momentos e uma nota sobre quando a usar. Se criares algumas antes do teu primeiro vídeo, todos os teus vídeos terão a mesma abertura, o mesmo fecho e os mesmos oráculos.

## Gera uma animação

Abre **Animações** na barra lateral e escolhe **Gerar com o agente**. Em **O que deve mostrar?**, descreve a peça em palavras simples: o que aparece, que cores e logótipos da marca, o ritmo e onde vai ser usada. O agente desenha-a com as cores, os tipos de letra e os recursos da tua marca, e o Arrumo renderiza a pré-visualização. Pode demorar alguns minutos.

Três peças de que a maioria dos espaços precisa, com pedidos que funcionaram bem:

- **Separador do logótipo**: «Cerca de 3 segundos, para abrir ou fechar um vídeo: num degradé de Tinta para Carvão, a marca sobe com uma sombra suave e depois o logótipo de texto aparece ao lado como cartão branco arredondado. Calmo, com muito espaço e sem outro texto.»
- **Cartão final**: «Cerca de 6 segundos em fundo Papel: a marca em cima, um título no tipo de letra dos títulos, uma linha curta de texto e o logótipo com o URL como apelo à ação. Entradas escalonadas e suaves, centradas.»
- **Oráculo** (um modelo de estilo): «Cerca de 5 segundos, para identificar um tema ou quem fala: um cartão Carvão arredondado com sombra suave que entra pela esquerda na zona segura inferior esquerda, com uma linha de título branca e uma linha de texto Névoa. Sem som.»

Chama às cores os nomes que estão na tua página **Marca**, e aos logótipos os nomes dos recursos da marca. O agente coloca esses ficheiros tal como são.

## Revê-a e altera-a

Abre um elemento para reproduzir a pré-visualização e ler a nota de utilização. Se algo não estiver bem, escolhe **Alterar com o agente** e diz só o que deve mudar, como «mantém o cartão final mais um segundo» ou «torna o cartão do logótipo mais pequeno». O agente guarda o resultado como um elemento novo e deixa o original como estava, por isso podes compará-los e apagar o que não quiseres. **Duplicar elemento** copia um elemento, por exemplo para mudar a nota de utilização para outro fim.

## Quem a pode usar

**Visibilidade** filtra a biblioteca por todo o espaço ou por um perfil. Os elementos criados para o espaço estão disponíveis para todos os perfis. Para dar a outros perfis um elemento de um perfil, usa **Partilhar com perfis**.

## Nos vídeos

No passo de recursos de um vídeo, o agente coloca tal como são os elementos da biblioteca que encaixam no guião, como o separador na abertura e o cartão final no fecho. Para tudo o que tem palavras que mudam de vídeo para vídeo, como os oráculos, desenha animações novas e segue a composição, as cores, os tipos de letra e o ritmo das peças da tua biblioteca que fazem o mesmo.

Por isso, deixa na biblioteca os elementos com texto fixo, e trata peças como um oráculo como modelos de estilo: diz na nota de utilização que as palavras são de exemplo.

## Com um agente

Os agentes podem fazer o mesmo através do MCP, da linha de comandos ou do A2A: `generate_motion_library_item` recebe o pedido (e `basedOn` para alterar um elemento existente), e `list_motion_library`, `duplicate_motion_library_item` e `set_motion_library_shares` gerem a biblioteca. A [referência de animação](../developer/reference/motion.md) descreve as camadas, formas e tipos de letra que uma animação pode usar.
