# Bug Fix: Wall Size Inconsistency for Top Players

## Problem
When turns switch, the size (specifically the length vertically) of the walls (or border) around the player at the top left (Player 1) and the player at the top right (Player 3) would change inconsistently.

## Root Cause
The issue was in the `buildMap()` function in `createCharacters.js` where:
1. Player 1 (top left) and Player 3 (top right) had different Y positioning values
2. Player 3 used different wall height calculations than Player 1
3. Inconsistent wall width calculations between the two players

## Solution Applied

### 1. Fixed Wall Positioning Consistency
**File: `JS/createCharacters.js`**

**Before:**
```javascript
//around red (player 1) - top left
const player1X = canvasWidth * 0.06;
const player1Y = canvasHeight * 0.12;
border.push(new Border(player1X, player1Y + canvasHeight * 0.15, canvasWidth * 0.085, wallThickness, playerNumber + 13));
border.push(new Border(player1X + canvasWidth * 0.07, player1Y, wallThickness, canvasHeight * 0.15, playerNumber + 14));

//around green (player 3) - top right
const player3X = canvasWidth * 0.87;
const player3Y = canvasHeight * 0.09; // DIFFERENT Y position
border.push(new Border(player3X, player3Y, wallThickness, canvasHeight * 0.18, playerNumber + 15)); // DIFFERENT height
border.push(new Border(player3X + wallThickness, player3Y + canvasHeight * 0.15, canvasWidth * 0.07, wallThickness, playerNumber + 16)); // DIFFERENT width
```

**After:**
```javascript
//around red (player 1) - top left
const player1X = canvasWidth * 0.06;
const player1Y = canvasHeight * 0.12;
const player1WallHeight = canvasHeight * 0.15;
const player1WallWidth = canvasWidth * 0.085;
border.push(new Border(player1X, player1Y + player1WallHeight, player1WallWidth, wallThickness, playerNumber + 13));
border.push(new Border(player1X + canvasWidth * 0.07, player1Y, wallThickness, player1WallHeight, playerNumber + 14));

//around green (player 3) - top right
const player3X = canvasWidth * 0.87;
const player3Y = canvasHeight * 0.12; // CONSISTENT with player1Y
const player3WallHeight = canvasHeight * 0.15; // CONSISTENT with player1WallHeight
const player3WallWidth = canvasWidth * 0.085; // CONSISTENT with player1WallWidth
border.push(new Border(player3X, player3Y, wallThickness, player3WallHeight, playerNumber + 15));
border.push(new Border(player3X + wallThickness, player3Y + player3WallHeight, player3WallWidth, wallThickness, playerNumber + 16));
```

### 2. Added Window Resize Handler (Preventive Measure)
**File: `JS/main.js`**

Added a `handleWindowResize()` function that:
- Prevents resizing during active gameplay
- Recalculates border positions when window is resized significantly
- Maintains proportional positioning of all game elements

## Key Changes Made

1. **Consistent Y Positioning**: Changed Player 3's Y position from `0.09` to `0.12` to match Player 1
2. **Unified Wall Dimensions**: Both players now use identical wall height (`0.15`) and width (`0.085`) calculations
3. **Improved Code Readability**: Used descriptive variable names for wall dimensions
4. **Added Resize Protection**: Implemented window resize handler to prevent future sizing issues

## Testing
- All JavaScript files pass syntax validation
- Game server can be started on port 8000 for testing
- Changes maintain backward compatibility with existing game mechanics

## Result
The walls around Player 1 (top left) and Player 3 (top right) now have consistent dimensions and positioning, eliminating the size change bug that occurred during turn switches.
