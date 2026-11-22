---

title: "Referência do SDK de plugins"
description: "Os contratos de manifesto, pacote e adaptador que um plugin declara ao Arrumo."
---

O [SDK de plugins](https://github.com/aidevs-pt/arrumo-plugin-sdk) contém os esquemas JSON versionados, os mundos WIT, as ferramentas de empacotamento e o conjunto de testes de conformidade. Estas páginas explicam cada contrato; os esquemas são a fonte de verdade. Começa por [Cria o teu primeiro plugin](../first-plugin.md).

- [Manifesto](manifest.md): identidade, definições, apresentação, ícone e traduções.
- [Pacotes e código](packages.md): pacotes ZIP, backends WebAssembly, painéis de interface e ficheiros revistos.
- [Ações e hooks](actions.md): ações, os seus formulários e locais, e hooks que correm com eventos.
- [Adaptadores de fornecedores](adapters.md): transcrição, voz, imagem, vídeo, utilização e tradução de legendas.
- [Fornecedores de agentes](agents.md): verificações de estado, execuções estruturadas, imagens, utilização e mensagens de seguimento.
- [Renderizadores de movimento](motion.md): entrega de movimento renderizado e a sandbox de renderização no Linux.

## Documenta o teu plugin

Escreve um guia por cada tarefa que um criador faz com o plugin, como a configuração ou criar imagens, em inglês, espanhol e português, com as mesmas páginas em cada idioma. Indica os controlos da aplicação tal como o Arrumo os mostra em cada idioma, e diz o que sai do computador do criador. Os plugins oficiais publicam os guias no [Arrumo Docs](https://github.com/aidevs-pt/arrumo-docs) em `content/docs/<lang>/plugins/<plugin-id>/`; os restantes plugins podem guardá-los no repositório como `docs/<lang>/<page>.md` e ligá-los a partir do README.
