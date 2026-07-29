<p align="center">
  <img src="public/icons/vitaeink.svg" width="72" height="72" alt="Logo do VitaeInk">
</p>

<h1 align="center">VitaeInk</h1>

<p align="center"><strong>Um estúdio privado e open source para currículos que pessoas e máquinas leem com clareza.</strong></p>

<p align="center"><a href="README.md">English</a> · <a href="https://vitaeink.matheus-silva-74d.workers.dev">Abrir o estúdio</a> · <a href="docs/SELF_HOSTING.md">Self-hosting</a> · <a href="CONTRIBUTING.md">Como contribuir</a></p>

VitaeInk é um criador de currículos local-first. Ele abre com um exemplo completo, atualiza uma visualização HTML semântica enquanto você escreve e exporta texto selecionável por meio da impressão nativa do navegador. Não há conta, analytics, banco de dados na nuvem ou fontes externas.

A interface do estúdio usa o preset Base Nova do shadcn/ui com primitivas Base UI. O currículo permanece isolado em HTML/CSS semântico para que a estética do painel não altere sua ordem de leitura por ATS ou a impressão.

Use a versão pública em **[vitaeink.matheus-silva-74d.workers.dev](https://vitaeink.matheus-silva-74d.workers.dev)**. Ela executa o mesmo código aberto e mantém o conteúdo do currículo apenas no seu dispositivo.

## Principais capacidades

- Dados salvos apenas no IndexedDB do dispositivo.
- Templates de uma coluna, títulos convencionais e ordem linear para leitores automáticos.
- Verificação prática do documento, sem inventar uma “nota ATS”.
- Backup e importação em JSON versionado.
- A4 e Carta, três templates, três fontes open source locais e controles de tipografia.
- Reordenação e ocultação acessíveis, inclusive pelo teclado.
- Execução no navegador, Linux, Windows, macOS, Docker, Nginx e Cloudflare Workers.
- Conteúdo do currículo em inglês ou português do Brasil.

## Desenvolvimento local

Requisitos: Node.js 22.13+ e pnpm 11.

```bash
corepack enable
pnpm install
pnpm dev
```

Acesse `http://localhost:5173`.

## Docker

```bash
docker compose up --build
```

Acesse `http://localhost:8080`. A imagem usa Nginx sem privilégios, sistema de arquivos somente leitura e nenhum backend.

## Cloudflare Workers

```bash
pnpm deploy
```

O Wrangler publica os arquivos estáticos; nenhum currículo é processado no servidor e não existem KV, D1 ou segredos.

## Limite honesto sobre ATS

O VitaeInk melhora estrutura, legibilidade e extração, mas não promete “100% de compatibilidade ATS”. Cada empresa e fornecedor usa um parser diferente. Revise o PDF final, desative cabeçalhos e rodapés do navegador e mantenha um backup JSON.

## Licença

Código sob [Apache-2.0](LICENSE). As fontes incorporadas e os ícones de interface Remix Icon mantêm suas próprias licenças; consulte os [avisos de terceiros](THIRD_PARTY_NOTICES.md).
