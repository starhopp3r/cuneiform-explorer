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

export const playTrumpetSound = () => {
  try {
    const audio = new Audio('/sounds/trumpet.mp3');
    audio.volume = 0.7; // Set volume to 70%
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    
    audio.play().catch(error => {
      console.error('Error playing trumpet sound:', error);
    });
  } catch (error) {
    console.error('Error in playTrumpetSound function:', error);
  }
};

export const playCompletionSound = () => {
  try {
    const audio = new Audio('/sounds/completion.mp3');
    audio.volume = 0.7; // Set volume to 70%
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    
    audio.play().catch(error => {
      console.error('Error playing completion sound:', error);
    });
  } catch (error) {
    console.error('Error in playCompletionSound function:', error);
  }
};