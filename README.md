# album_romantico2
# Nosso Pequeno Infinito — Guilherme & Julya

React + TypeScript + Vite + Motion. Álbum em formato de livro com virada de página 3D, editor em `/#/editar` e persistência em IndexedDB.

## Executar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
npm run preview
```

## Personalizar
- Pelo navegador: abra `/#/editar`. Tudo é salvo automaticamente (IndexedDB) neste dispositivo: nomes, data, textos, fotos (comprimidas), cartas, linha do tempo, motivos, cor, música e capítulos visíveis. O botão "Restaurar conteúdo inicial" pede confirmação.
- Pelo código: conteúdo padrão em `src/data/albumData.ts`. Os textos e a data são **exemplos**; a data padrão é 11 meses atrás.
- O contador calcula anos, meses e dias a partir da data configurada.
- Música: envie um arquivo seu no editor (não há música incluída). Só toca após clique.

## Publicar na Vercel
`vercel` na pasta, ou importe o repositório (Framework: Vite, build `npm run build`, saída `dist`).

## Importante: salvamento local x compartilhamento
Os dados editados ficam **só no navegador de quem editou**. Publicar o site não leva suas edições para outro aparelho. Para Julya ver a sua versão:
1. Edite o álbum, ajuste `src/data/albumData.ts` com os textos finais e coloque as fotos em `public/` (referenciando por caminho em `src`), e publique; ou
2. Integre um armazenamento remoto trocando `src/services/storage.ts` (mesma interface `load/save/clear`), por exemplo Supabase ou Firebase.
