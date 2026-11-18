import type { Album } from '../types'
/* CONTEÚDO DEMONSTRATIVO — tudo é editável em /#/editar. A data é um exemplo (11 meses atrás). */
const demoDate = () => { const d = new Date(); d.setMonth(d.getMonth() - 11); return d.toISOString().slice(0, 10) }
export const defaultAlbum = (): Album => ({
  nameA: 'Guilherme', nameB: 'Julya', title: 'Nosso Pequeno Infinito', startDate: demoDate(),
  introQuote: 'Para a pessoa que faz meus dias mais especiais...',
  introSub: 'Uma pequena coleção de momentos, sentimentos e histórias.',
  storyText: 'Existem histórias que começam sem grandes planos, mas que acabam se tornando algumas das partes mais bonitas da nossa vida. A nossa é uma delas.',
  monthsPhrase: 'Cada mês ao seu lado é uma página que eu releio com carinho.',
  details: ['Seu sorriso', 'Seu carinho', 'Seu jeito de falar', 'Sua companhia', 'Seu abraço', 'Seu jeito de tornar os dias melhores'].map(title => ({ title, text: 'Texto de exemplo: escreva aqui o que você sente sobre isso.' })),
  letters: [
    { title: 'O quanto você é especial', text: 'Texto de exemplo. Escreva aqui, com suas palavras, o quanto Julya é especial para você. Conte o que mudou nos seus dias desde que ela chegou.' },
    { title: 'O que sinto por você', text: 'Texto de exemplo. Escreva aqui o que você sente, do jeito simples e sincero que só você sabe dizer.' },
    { title: 'O que desejo viver ao seu lado', text: 'Texto de exemplo. Escreva aqui o que você deseja viver ao lado dela, dos pequenos momentos aos grandes sonhos.' }],
  timeline: [
    { date: 'Data 1', title: 'O início da nossa história', text: 'Exemplo: conte como tudo começou.' },
    { date: 'Data 2', title: 'Nossos primeiros momentos', text: 'Exemplo: as primeiras memórias juntos.' },
    { date: 'Data 3', title: 'Uma lembrança inesquecível', text: 'Exemplo: aquele dia que ficou marcado.' },
    { date: 'Data 4', title: 'Mais um mês juntos', text: 'Exemplo: mais um capítulo vivido.' }],
  reasons: ['Motivo 1', 'Motivo 2', 'Motivo 3', 'Motivo 4'].map(reason => ({ reason, extra: 'Exemplo: escreva o motivo e uma frase que o complete.' })),
  futureText: 'O futuro ainda está em branco, e eu quero escrevê-lo ao seu lado.',
  dreams: ['Sonho compartilhado 1 (exemplo)', 'Sonho compartilhado 2 (exemplo)', 'Pequeno objetivo (exemplo)'],
  finalText: 'Se eu pudesse escolher novamente, entre tantos caminhos e tantas possibilidades, ainda escolheria conhecer você, viver essa história e construir cada capítulo ao seu lado.',
  finalNote: 'Obrigado por ser meu lugar favorito.',
  photos: (['polaroid', 'frame', 'full', 'collage'] as const).map((layout, i) => ({ id: 'd' + i, src: '', caption: 'Um momento simples que se tornou inesquecível.', date: '', layout })),
  music: '', accent: '#C98F9C', hidden: []
})
