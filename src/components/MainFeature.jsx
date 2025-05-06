import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  const TrophyIcon = getIcon('Trophy');
  const RefreshCwIcon = getIcon('RefreshCw');
  const SettingsIcon = getIcon('Settings');
  const CloseIcon = getIcon('X');
  
  // Game settings
  const [gameSettings, setGameSettings] = useState({
    gridSize: 5,
    player1Name: 'Player 1',
    player2Name: 'Player 2',
  });
  
  // Game state
  const [gameState, setGameState] = useState({
    currentPlayer: 1,
    player1Score: 0,
    player2Score: 0,
    lines: new Set(),
    boxes: {},
    gameOver: false
  });
  
  // Drag state
  const [startDot, setStartDot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Generate grid
  const generateDots = useCallback(() => {
    const dots = [];
    for (let i = 0; i < gameSettings.gridSize; i++) {
      for (let j = 0; j < gameSettings.gridSize; j++) {
        dots.push({ x: j, y: i });
      }
    }
    return dots;
  }, [gameSettings.gridSize]);
  
  const [dots] = useState(generateDots);
  
  useEffect(() => {
    setGameState({
      currentPlayer: 1,
      player1Score: 0,
      player2Score: 0,
      lines: new Set(),
      boxes: {},
      gameOver: false
    });
  }, [gameSettings.gridSize]);
  
  // Handle line click
  const handleLineClick = (startDot, endDot) => {
    // Create line key
    const lineKey = `${startDot.x},${startDot.y}-${endDot.x},${endDot.y}`;
    const reverseLineKey = `${endDot.x},${endDot.y}-${startDot.x},${startDot.y}`;
    
    // Check if line already exists
    if (gameState.lines.has(lineKey) || gameState.lines.has(reverseLineKey)) {
      return;
    }
    
    // Add line
    const newLines = new Set(gameState.lines);
    newLines.add(lineKey);
    
    // Check if box completed
    let boxCompleted = false;
    const newBoxes = { ...gameState.boxes };
    let newPlayer1Score = gameState.player1Score;
    let newPlayer2Score = gameState.player2Score;
    
    // Check if horizontal line
    if (startDot.y === endDot.y) {
      // Check box above
      if (startDot.y > 0) {
        const topLeft = { x: Math.min(startDot.x, endDot.x), y: startDot.y - 1 };
        const topRight = { x: Math.max(startDot.x, endDot.x), y: startDot.y - 1 };
        
        const line1 = `${topLeft.x},${topLeft.y}-${topRight.x},${topRight.y}`;
        const line2 = `${topLeft.x},${topLeft.y}-${startDot.x},${startDot.y}`;
        const line3 = `${topRight.x},${topRight.y}-${endDot.x},${endDot.y}`;
        
        if ((newLines.has(line1) || newLines.has(`${topRight.x},${topRight.y}-${topLeft.x},${topLeft.y}`)) &&
            (newLines.has(line2) || newLines.has(`${startDot.x},${startDot.y}-${topLeft.x},${topLeft.y}`)) &&
            (newLines.has(line3) || newLines.has(`${endDot.x},${endDot.y}-${topRight.x},${topRight.y}`))) {
          const boxKey = `${topLeft.x},${topLeft.y}`;
          if (!newBoxes[boxKey]) {
            newBoxes[boxKey] = gameState.currentPlayer;
            boxCompleted = true;
            if (gameState.currentPlayer === 1) {
              newPlayer1Score++;
            } else {
              newPlayer2Score++;
            }
          }
        }
      }
      
      // Check box below
      if (startDot.y < gameSettings.gridSize - 1) {
        const bottomLeft = { x: Math.min(startDot.x, endDot.x), y: startDot.y + 1 };
        const bottomRight = { x: Math.max(startDot.x, endDot.x), y: startDot.y + 1 };
        
        const line1 = `${bottomLeft.x},${bottomLeft.y}-${bottomRight.x},${bottomRight.y}`;
        const line2 = `${startDot.x},${startDot.y}-${bottomLeft.x},${bottomLeft.y}`;
        const line3 = `${endDot.x},${endDot.y}-${bottomRight.x},${bottomRight.y}`;
        
        if ((newLines.has(line1) || newLines.has(`${bottomRight.x},${bottomRight.y}-${bottomLeft.x},${bottomLeft.y}`)) &&
            (newLines.has(line2) || newLines.has(`${bottomLeft.x},${bottomLeft.y}-${startDot.x},${startDot.y}`)) &&
            (newLines.has(line3) || newLines.has(`${bottomRight.x},${bottomRight.y}-${endDot.x},${endDot.y}`))) {
          const boxKey = `${startDot.x},${startDot.y}`;
          if (!newBoxes[boxKey]) {
            newBoxes[boxKey] = gameState.currentPlayer;
            boxCompleted = true;
            if (gameState.currentPlayer === 1) {
              newPlayer1Score++;
            } else {
              newPlayer2Score++;
            }
          }
        }
      }
    }
    
    // Check if vertical line
    if (startDot.x === endDot.x) {
      // Check box to the left
      if (startDot.x > 0) {
        const topLeft = { x: startDot.x - 1, y: Math.min(startDot.y, endDot.y) };
        const bottomLeft = { x: startDot.x - 1, y: Math.max(startDot.y, endDot.y) };
        
        const line1 = `${topLeft.x},${topLeft.y}-${bottomLeft.x},${bottomLeft.y}`;
        const line2 = `${topLeft.x},${topLeft.y}-${startDot.x},${startDot.y}`;
        const line3 = `${bottomLeft.x},${bottomLeft.y}-${endDot.x},${endDot.y}`;
        
        if ((newLines.has(line1) || newLines.has(`${bottomLeft.x},${bottomLeft.y}-${topLeft.x},${topLeft.y}`)) &&
            (newLines.has(line2) || newLines.has(`${startDot.x},${startDot.y}-${topLeft.x},${topLeft.y}`)) &&
            (newLines.has(line3) || newLines.has(`${endDot.x},${endDot.y}-${bottomLeft.x},${bottomLeft.y}`))) {
          const boxKey = `${topLeft.x},${topLeft.y}`;
          if (!newBoxes[boxKey]) {
            newBoxes[boxKey] = gameState.currentPlayer;
            boxCompleted = true;
            if (gameState.currentPlayer === 1) {
              newPlayer1Score++;
            } else {
              newPlayer2Score++;
            }
          }
        }
      }
      
      // Check box to the right
      if (startDot.x < gameSettings.gridSize - 1) {
        const topRight = { x: startDot.x + 1, y: Math.min(startDot.y, endDot.y) };
        const bottomRight = { x: startDot.x + 1, y: Math.max(startDot.y, endDot.y) };
        
        const line1 = `${topRight.x},${topRight.y}-${bottomRight.x},${bottomRight.y}`;
        const line2 = `${startDot.x},${startDot.y}-${topRight.x},${topRight.y}`;
        const line3 = `${endDot.x},${endDot.y}-${bottomRight.x},${bottomRight.y}`;
        
        if ((newLines.has(line1) || newLines.has(`${bottomRight.x},${bottomRight.y}-${topRight.x},${topRight.y}`)) &&
            (newLines.has(line2) || newLines.has(`${topRight.x},${topRight.y}-${startDot.x},${startDot.y}`)) &&
            (newLines.has(line3) || newLines.has(`${bottomRight.x},${bottomRight.y}-${endDot.x},${endDot.y}`))) {
          const boxKey = `${startDot.x},${startDot.y}`;
          if (!newBoxes[boxKey]) {
            newBoxes[boxKey] = gameState.currentPlayer;
            boxCompleted = true;
            if (gameState.currentPlayer === 1) {
              newPlayer1Score++;
            } else {
              newPlayer2Score++;
            }
          }
        }
      }
    }
    
    // Check if game over
    const totalBoxes = (gameSettings.gridSize - 1) * (gameSettings.gridSize - 1);
    const gameOver = newPlayer1Score + newPlayer2Score === totalBoxes;
    
    if (gameOver) {
      if (newPlayer1Score > newPlayer2Score) {
        toast.success(`${gameSettings.player1Name} wins!`);
      } else if (newPlayer2Score > newPlayer1Score) {
        toast.success(`${gameSettings.player2Name} wins!`);
      } else {
        toast.info("It's a tie!");
      }
    } else if (boxCompleted) {
      toast.info(`${gameState.currentPlayer === 1 ? gameSettings.player1Name : gameSettings.player2Name} completed a box!`);
    }
    
    // Update game state
    setGameState({
      currentPlayer: boxCompleted ? gameState.currentPlayer : gameState.currentPlayer === 1 ? 2 : 1,
      player1Score: newPlayer1Score,
      player2Score: newPlayer2Score,
      lines: newLines,
      boxes: newBoxes,
      gameOver
    });
  };
  
  // Check if line exists
  const lineExists = (dot1, dot2) => {
    const lineKey = `${dot1.x},${dot1.y}-${dot2.x},${dot2.y}`;
    const reverseLineKey = `${dot2.x},${dot2.y}-${dot1.x},${dot1.y}`;
    return gameState.lines.has(lineKey) || gameState.lines.has(reverseLineKey);
  };
  
  // Reset game
  const resetGame = () => {
    setGameState({
      currentPlayer: 1,
      player1Score: 0,
      player2Score: 0,
      lines: new Set(),
      boxes: {},
      gameOver: false
    });
    toast.info("Game reset! Starting a new game.");
  };
  // Drag and drop functionality
  const handleDotMouseDown = (dot) => {
    if (gameState.gameOver) return;
    setStartDot(dot);
    setIsDragging(true);
  };
  
  const handleDotMouseEnter = (dot) => {
    if (!isDragging || !startDot || gameState.gameOver) return;
    
    // Check if this is a valid move (adjacent dots)
    const isHorizontalAdjacent = startDot.y === dot.y && Math.abs(startDot.x - dot.x) === 1;
    const isVerticalAdjacent = startDot.x === dot.x && Math.abs(startDot.y - dot.y) === 1;
    
    if (isHorizontalAdjacent || isVerticalAdjacent) {
      // Check if line already exists
      const lineExists = gameState.lines.has(`${startDot.x},${startDot.y}-${dot.x},${dot.y}`) ||
                        gameState.lines.has(`${dot.x},${dot.y}-${startDot.x},${startDot.y}`);
      
      if (!lineExists) {
        handleLineClick(startDot, dot);
      }
      
      // Reset drag state
      setStartDot(null);
      setIsDragging(false);
    }
  };
  
  const handleDotMouseUp = (dot) => {
    if (!isDragging || !startDot || gameState.gameOver) return;
    
    // Check if this is a valid move (adjacent dots)
    const isHorizontalAdjacent = startDot.y === dot.y && Math.abs(startDot.x - dot.x) === 1;
    const isVerticalAdjacent = startDot.x === dot.x && Math.abs(startDot.y - dot.y) === 1;
    
    if (isHorizontalAdjacent || isVerticalAdjacent && startDot !== dot) {
      handleDotMouseEnter(dot);
    }
    
    // Reset drag state
    setStartDot(null);
    setIsDragging(false);
  };
  
  const handleBoardMouseUp = () => {
    setIsDragging(false);
    setStartDot(null);
  };
  
  
  // Handle settings form submission
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setShowSettings(false);
    resetGame();
    toast.success("Game settings updated!");
  };
  
  // Render dot with interactive capabilities
  const renderDot = (dot) => (
    <div 
      key={`dot-${dot.x}-${dot.y}`}
      className={`game-dot absolute rounded-full bg-surface-700 dark:bg-surface-300 shadow-md transition-transform z-20
                 ${isDragging && startDot && startDot.x === dot.x && startDot.y === dot.y ? 'scale-125 bg-primary dark:bg-primary' : ''}
                 ${isDragging ? 'cursor-pointer hover:scale-110' : 'hover:scale-110'}`}
      style={{
        gridColumn: dot.x + 1,
        gridRow: dot.y + 1,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleDotMouseDown(dot);
      }}
      onMouseEnter={() => handleDotMouseEnter(dot)} 
      onMouseUp={() => handleDotMouseUp(dot)} 
      onTouchStart={() => handleDotMouseDown(dot)} 
      onTouchEnd={() => handleDotMouseUp(dot)}
    />
  );

  
  // Render box
  const renderBox = (x, y) => {
    const boxKey = `${x},${y}`;
    const owner = gameState.boxes[boxKey];
    
    if (!owner) return null;
    
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`absolute inset-0 m-2 game-box ${
          owner === 1 ? 'bg-primary/30' : 'bg-secondary/30'
        }`}
      />
    );
  };
  
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-2"
      >
        <h2 className="text-3xl font-bold mb-2">Dots and Boxes</h2>
        <p className="text-surface-600 dark:text-surface-400">
          Connect dots to form boxes and claim territory
        </p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card flex-1 flex flex-col items-center"
        >
          {/* Player Turn Indicator */}
          <div className="w-full flex justify-between items-center mb-6">
            <div className={`px-4 py-2 rounded-lg transition-colors ${
              gameState.currentPlayer === 1 && !gameState.gameOver
                ? 'bg-primary/20 text-primary-dark dark:text-primary-light font-medium'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-500'
            }`}>
              {gameSettings.player1Name}: {gameState.player1Score}
            </div>
            
            <div className={`px-4 py-2 rounded-lg transition-colors ${
              gameState.currentPlayer === 2 && !gameState.gameOver
                ? 'bg-secondary/20 text-secondary-dark dark:text-secondary-light font-medium'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-500'
            }`}>
              {gameSettings.player2Name}: {gameState.player2Score}
            </div>
          </div>
          
          {/* Game Grid */}
          <div 
            className="relative grid gap-6 mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gameSettings.gridSize}, minmax(40px, 1fr))`,
              gridTemplateRows: `repeat(${gameSettings.gridSize}, minmax(40px, 1fr))`,
              gap: '1.5rem',
              width: `min(100%, ${gameSettings.gridSize * 4}rem)`,
              height: `min(100%, ${gameSettings.gridSize * 4}rem)`,
              position: 'relative'
            }}
          >
            {/* Render dots */}
            {dots.map(dot => renderDot(dot))}
            
            {/* Render horizontal lines */}
            {dots.map(dot => {
              if (dot.x < gameSettings.gridSize - 1) {
                const rightDot = { x: dot.x + 1, y: dot.y };
                const lineExists = gameState.lines.has(`${dot.x},${dot.y}-${rightDot.x},${rightDot.y}`) || 
                                 gameState.lines.has(`${rightDot.x},${rightDot.y}-${dot.x},${dot.y}`);
                
                return (
                  <div
                    key={`h-line-${dot.x}-${dot.y}`}
                    className={`absolute game-line-horizontal h-1.5 cursor-pointer ${
                      lineExists ? 'bg-primary dark:bg-primary' : 'bg-transparent hover:bg-surface-300 dark:hover:bg-surface-600'
                    }`}
                    style={{
                      left: `calc(${dot.x + 1} * (100% / ${gameSettings.gridSize}) + 0.6rem)`,
                      top: `calc(${dot.y + 1} * (100% / ${gameSettings.gridSize}))`,
                      width: `calc((100% / ${gameSettings.gridSize}) - 1.2rem)`,
                      zIndex: 10
                    }}
                    onClick={() => {
                      if (!lineExists && !gameState.gameOver) {
                        handleLineClick(dot, rightDot);
                      }
                    }}
                  ></div>
                );
              }
              return null;
            })}
            
            {/* Render vertical lines */}
            {dots.map(dot => {
              if (dot.y < gameSettings.gridSize - 1) {
                const bottomDot = { x: dot.x, y: dot.y + 1 };
                const lineExists = gameState.lines.has(`${dot.x},${dot.y}-${bottomDot.x},${bottomDot.y}`) || 
                                 gameState.lines.has(`${bottomDot.x},${bottomDot.y}-${dot.x},${dot.y}`);
                
                return (
                  <div
                    key={`v-line-${dot.x}-${dot.y}`}
                    className={`absolute game-line-vertical cursor-pointer ${
                      lineExists ? 'bg-primary dark:bg-primary' : 'bg-transparent hover:bg-surface-300 dark:hover:bg-surface-600'
                    }`}
                    style={{
                      left: `calc(${dot.x + 1} * (100% / ${gameSettings.gridSize}))`,
                      top: `calc(${dot.y + 1} * (100% / ${gameSettings.gridSize}) + 0.6rem)`,
                      height: `calc((100% / ${gameSettings.gridSize}) - 1.2rem)`,
                      zIndex: 10
                    }}
                  ></div>
                      if (!lineExists && !gameState.gameOver) {
              return null;
            })}
            
            {/* Render boxes */}
            {dots.map(dot => {
              if (dot.x < gameSettings.gridSize - 1 && dot.y < gameSettings.gridSize - 1) {
                return (
                  <div
                    key={`box-${dot.x}-${dot.y}`}
                    className="absolute"
                    style={{
                      left: `calc(${dot.x + 1} * (100% / ${gameSettings.gridSize}) + 0.6rem)`,
                      top: `calc(${dot.y + 1} * (100% / ${gameSettings.gridSize}) + 0.6rem)`,
                      width: `calc((100% / ${gameSettings.gridSize}) - 1.2rem)`,
                      height: `calc((100% / ${gameSettings.gridSize}) - 1.2rem)`
                    }}
                  >
                    {renderBox(dot.x, dot.y)}
                  </div>
                );
              }
              return null;
            })}
          </div>
          
          {/* Touch/Mouse event catchers - placed outside the grid for better UX */}
          <div 
            className="absolute inset-0 z-0"
            onMouseUp={handleBoardMouseUp}
            onTouchEnd={handleBoardMouseUp}
          />
          
          {/* Game Controls */}
          <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
            <button 
              onClick={resetGame}
              className="btn-outline flex-1 flex items-center justify-center"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              New Game
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </motion.div>
        
        {/* Game Info & Rules */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card w-full md:w-80 flex flex-col gap-4"
        >
          {/* Game Status */}
          <div className="text-center mb-2">
            <h3 className="text-xl font-semibold mb-1">Game Status</h3>
            {gameState.gameOver ? (
              <div className="flex items-center justify-center gap-2 font-medium text-lg">
                <TrophyIcon className="w-5 h-5 text-accent" />
                {gameState.player1Score > gameState.player2Score
                  ? `${gameSettings.player1Name} wins!`
                  : gameState.player2Score > gameState.player1Score
                  ? `${gameSettings.player2Name} wins!`
                  : "It's a tie!"}
              </div>
            ) : (
              <p className="font-medium">
                <span className={gameState.currentPlayer === 1 ? 'text-primary' : 'text-secondary'}>
                  {gameState.currentPlayer === 1 ? gameSettings.player1Name : gameSettings.player2Name}
                </span>'s turn
              </p>
            )}
          </div>
          
          {/* Score Board */}
          <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-center">Score Board</h4>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold mb-1">
                  {gameState.player1Score}
                </div>
                <span className="text-sm">{gameSettings.player1Name}</span>
              </div>
              
              <div className="text-xl font-bold">vs</div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/20 text-secondary font-semibold mb-1">
                  {gameState.player2Score}
                </div>
                <span className="text-sm">{gameSettings.player2Name}</span>
              </div>
            </div>
          </div>
          
          {/* Game Rules */}
          <div>
            <h4 className="font-medium mb-2">How to Play</h4>
            <ul className="text-sm space-y-2 text-surface-700 dark:text-surface-300">
              <li>• Take turns connecting adjacent dots with lines</li>
              <li>• When you complete a box, you claim it and get another turn</li>
              <li>• Drag from dot to dot or click on lines to connect</li>
              <li>• The player with the most boxes wins</li>
              <li>• Current player's score is highlighted</li>
            </ul>
          </div>
        </motion.div>
      </div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Game Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Grid Size</label>
                  <select
                    value={gameSettings.gridSize}
                    onChange={e => setGameSettings({...gameSettings, gridSize: parseInt(e.target.value)})}
                    className="block w-full rounded-lg border border-surface-300 dark:border-surface-700 px-4 py-2 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="3">3×3 (Easy)</option>
                    <option value="4">4×4 (Medium)</option>
                    <option value="5">5×5 (Standard)</option>
                    <option value="6">6×6 (Hard)</option>
                    <option value="7">7×7 (Expert)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Player 1 Name</label>
                  <input
                    type="text"
                    value={gameSettings.player1Name}
                    onChange={e => setGameSettings({...gameSettings, player1Name: e.target.value})}
                    className="block w-full rounded-lg border border-surface-300 dark:border-surface-700 px-4 py-2 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={15}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Player 2 Name</label>
                  <input
                    type="text"
                    value={gameSettings.player2Name}
                    onChange={e => setGameSettings({...gameSettings, player2Name: e.target.value})}
                    className="block w-full rounded-lg border border-surface-300 dark:border-surface-700 px-4 py-2 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={15}
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="btn-outline mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;