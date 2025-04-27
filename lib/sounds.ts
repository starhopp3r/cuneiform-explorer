// Sound effects for the application
const playSound = (url: string) => {
  const audio = new Audio(url)
  audio.volume = 0.3 // Set volume to 30%
  audio.play()
}

export const playCorrectSound = () => {
  playSound('/sounds/correct.mp3')
}

export const playWrongSound = () => {
  playSound('/sounds/wrong.mp3')
}

export const playTrumpetSound = () => {
  playSound('/sounds/trumpet.mp3')
}

export const playCompletionSound = () => {
  playSound('/sounds/completion.mp3')
}

export const playCardFlipSound = () => {
  playSound('/sounds/card-flip.mp3')
}

export const playCardFlipAnimationSound = () => {
  playSound('/sounds/card-flip-animation.mp3')
}