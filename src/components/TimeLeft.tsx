import React, { useEffect, useState } from 'react'
import '../App.css';

const TimeLeft = ({ fetchSolutions }) => {
    const [timeLeft, setTimeLeft] = useState(120);
    // Use Effect for fetching new words
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          // Fetch new words when timer hits 0
          fetchSolutions();
          return 120; // Reset the timer
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="timer">
        <span style={{ color: 'white'}}>New word in: {timeLeft}s</span>
    </div>
  )
}

export default TimeLeft;
