export type Layout = 'polaroid' | 'frame' | 'full' | 'collage'
export type Photo = { id: string; src: string; caption: string; date: string; layout: Layout }
export type Detail = { title: string; text: string }
export type Letter = { title: string; text: string }
export type Event = { date: string; title: string; text: string }
export type Reason = { reason: string; extra: string }
export type Album = {
  nameA: string; nameB: string; title: string; startDate: string
  introQuote: string; introSub: string; storyText: string; monthsPhrase: string
  details: Detail[]; letters: Letter[]; timeline: Event[]; reasons: Reason[]
  futureText: string; dreams: string[]; finalText: string; finalNote: string
  photos: Photo[]; music: string; accent: string; hidden: string[]
}
