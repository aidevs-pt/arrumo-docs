---

title: "Compila e executa o editor"
description: "Compila a aplicação para computador, escolhe que plugins inclui e abre-a a partir de ligações."
---

## Desenvolvimento para computador

Instala os [pré-requisitos do Tauri](https://v2.tauri.app/start/prerequisites/), o Node e a versão do pnpm indicada em `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm tauri dev
```

Enquanto a aplicação arranca, um ecrã cobalto anima o logótipo da cara; desvanece quando o idioma e os espaços de trabalho carregam, e fica parado quando o movimento reduzido está ativo. Define `ARRUMO_NO_SPLASH=1` (por exemplo, `ARRUMO_NO_SPLASH=1 pnpm tauri dev`) para o saltar ao depurar.

O primeiro ecrã cria e lista espaços de trabalho. Usa o idioma do sistema quando é inglês, espanhol ou português, com o inglês como alternativa. A aplicação guarda `workspaces.sqlite` na pasta local de dados de aplicação de cada plataforma. O mesmo armazenamento de espaços de trabalho serve a CLI.

`pnpm tauri build --debug --no-bundle` compila um executável nativo a partir da interface estática. Os instaladores e a assinatura são tratados à parte.

## Plugins incluídos

Na estrutura do espaço de trabalho do Arrumo, a compilação lê o ficheiro vizinho `plugin-registry/catalog.json` e carrega as entradas marcadas como `default` a partir dos checkouts vizinhos `plugins/<id>`. Os checkouts podem ser ligações simbólicas. Define `ARRUMO_PLUGIN_REGISTRY` e `ARRUMO_PLUGIN_SOURCE_ROOT` para usar outro ficheiro de registo ou outra localização de checkouts. A compilação incorpora os artefactos selecionados dessas fontes sem guardar cópias no repositório do editor.

Em compilações locais de depuração, coloca um `plugin.zip` gerado com o SDK no checkout vizinho do plugin selecionado. O host valida o ZIP e exige que o manifesto corresponda ao checkout antes de expor as ações ou superfícies de interface. O contexto do espaço de trabalho continua a exigir uma autorização para esse digest de pacote.

Em compilações de publicação a partir do registo, define `ARRUMO_PLUGIN_RELEASE_ROOT` com uma pasta que contenha os ficheiros `<id>.zip` preparados. Cada ZIP preparado tem de corresponder exatamente a um SHA-256 de publicação do registo selecionado, e o manifesto tem de corresponder ao checkout respetivo. O catálogo incluído guarda a versão publicada, o repositório de origem e o URL do pacote. As compilações de publicação só incorporam ZIP executáveis e descritores de adaptadores de fornecedores a partir deste caminho de preparação verificado. As compilações de depuração sem preparação podem usar os descritores dos checkouts vizinhos. Um plugin predefinido sem ZIP preparado não tem adaptador de fornecedor incluído nas compilações de publicação.

Usa `export-plugin-package <plugin-id> <sha256> <new-zip>` para copiar um pacote incluído ou instalado a partir do catálogo local. O editor volta a calcular o digest e recusa-se a substituir um ficheiro existente. Obtém o digest esperado na entrada do pacote que reviste em `plugin-catalog`.

Usa `ARRUMO_CORE_ONLY=1` para verificar o host de forma isolada, sem acesso aos checkouts privados. Essa compilação começa com um catálogo predefinido vazio.

## Linha de comandos

A partir deste repositório, usa o Cargo para criar e listar espaços de trabalho numa base de dados SQLite local.

```sh
cargo run --locked -- ./workspaces.sqlite create "My studio"
cargo run --locked -- ./workspaces.sqlite list
```

Os comandos imprimem JSON. A base de dados mantém-se entre execuções. Executa os testes do backend com `cargo test --locked`.

## Traduções da interface

Copia `locales/en.json` para um ficheiro novo, como `locales/fr.json`, e traduz os valores. Mantém as mesmas chaves e preserva as substituições como `{name}`. A compilação para computador descobre os catálogos novos automaticamente, exige inglês, espanhol e português, e indica diferenças de chaves ou marcadores. A aplicação segue as preferências de idioma do sistema, tenta o idioma base quando não há tradução regional e recorre ao inglês.

## Páginas e ligações diretas

A interface para computador exporta páginas separadas do App Router para Perfis, Contexto, Marca, Recursos, Saídas, Rascunhos, Gerações e Vídeos concluídos. Os identificadores dos espaços de trabalho são criados na base de dados local depois de a aplicação ser compilada, por isso uma página exportada recebe o identificador como parâmetro de consulta, por exemplo `/brand?workspace=2`. A navegação de um perfil para um rascunho também leva o identificador do perfil no URL. O layout do estúdio resolve esses identificadores através do Tauri.

As execuções concluídas abrem em `/completed-video?workspace=<workspace-id>&run=<run-id>`. A aplicação resolve o vídeo a partir do espaço de trabalho local selecionado, por isso a ligação funciona com a base de dados do Arrumo correspondente.

As ligações diretas usam `arrumo://open/<section>?workspace=<id>`. As páginas de perfis e de execuções também aceitam `profile=<id>` ou `run=<id>`, respetivamente. Por exemplo, `arrumo://open/generation-run?workspace=2&run=8` abre a execução correspondente na base de dados local. `arrumo://open/settings?workspace=2&section=plugins` abre as Definições em `general`, `agent`, `services`, `plugins`, `quality` ou `backup`; acrescenta `scope=workspace` para o âmbito do espaço de trabalho, ou `plugin=<id>` com `section=plugins` para abrir a página de um plugin. `arrumo://open/appearance?workspace=2` abre Definições do espaço de trabalho › Aparência, que só muda o aspeto do espaço de trabalho no Arrumo. `arrumo://open/drafts?workspace=2&compose=1` começa um vídeo novo a partir de gravações, e `compose=scratch` começa um do zero. O Linux regista o esquema no arranque, e as compilações de depuração do Windows registam-no para testes. O registo em pacotes instalados segue a configuração de esquemas do Tauri para computador.

## Contagens de utilização e relatórios de falhas

As contagens de utilização anónimas e os relatórios de falhas não dependem de nenhum fornecedor ([`telemetry.rs`](https://github.com/aidevs-pt/arrumo-video-editor/blob/main/crates/workspaces/src/telemetry.rs)) e estão ativos por predefinição, com interruptores em **Definições › Geral › Dados e privacidade** (`get_privacy_settings`/`set_privacy_settings` por MCP e A2A). As compilações só enviam alguma coisa quando são compiladas com `ARRUMO_USAGE_KEY` (e opcionalmente `ARRUMO_USAGE_ENDPOINT`, por predefinição a API de eventos do Aptabase) ou `ARRUMO_CRASH_DSN` (um DSN ao estilo Sentry `https://<key>@<host>/<project>`); as compilações de contribuidores não têm nenhum dos dois e não enviam nada. Os eventos levam o nome do evento, um identificador de instalação aleatório, um identificador de sessão por arranque, a versão da aplicação e o sistema operativo; as mensagens de falha guardam só a primeira linha, sem caminhos nem endereços.
