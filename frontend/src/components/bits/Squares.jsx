import React, { useEffect, useRef, useState } from 'react';

const Squares = ({ 
  direction = 'diagonal',
  speed = 1,
  borderColor = '#333',
  squareSize = 40,
  hoverFillColor = '#222'
}) => {
  const canvasRef = useRef(null);
  const [numSquaresX, setNumSquaresX] = useState(0);
  const [numSquaresY, setNumSquaresY] = useState(0);
  const gridOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setNumSquaresX(Math.ceil(canvas.width / squareSize) + 1);
        setNumSquaresY(Math.ceil(canvas.height / squareSize) + 1);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [squareSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x - (gridOffset.current.x % squareSize), y - (gridOffset.current.y % squareSize), squareSize, squareSize);
        }
      }

      // Smooth movement
      if (direction === 'right') gridOffset.current.x -= speed;
      if (direction === 'left') gridOffset.current.x += speed;
      if (direction === 'down') gridOffset.current.y -= speed;
      if (direction === 'up') gridOffset.current.y += speed;
      if (direction === 'diagonal') {
        gridOffset.current.x -= speed;
        gridOffset.current.y -= speed;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [borderColor, direction, speed, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-20"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default Squares;
