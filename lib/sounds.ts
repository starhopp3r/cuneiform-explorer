export const playSound = (type: 'correct' | 'wrong') => {
  try {
    const soundPath = type === 'correct' ? '/sounds/correct.mp3' : '/sounds/wrong.mp3';
    const audio = new Audio(soundPath);
    audio.volume = 0.7; // Set volume to 70%
    
    // Add event listeners for debugging
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    });
  } catch (error) {
    console.error('Error in playSound function:', error);
  }
};