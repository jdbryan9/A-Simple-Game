# A-Simple-Game (Neon Brick Breaker)

A simple browser game where you move a paddle to bounce a ball, break bricks, and earn points.

## What you need

- A computer with a terminal
- Python 3 installed
- A modern web browser (Chrome, Edge, Firefox, Safari)

## Run the game locally

1. Open a terminal.
2. Go to this project folder:

   ```bash
   cd /workspace/A-Simple-Game
   ```

3. Start a small local web server:

   ```bash
   python3 -m http.server 4173
   ```

4. Open your browser and go to:

   ```
   http://localhost:4173
   ```

5. Click **Start Game** (or press **Space**) to play.

## Controls

- **Left Arrow**: move paddle left
- **Right Arrow**: move paddle right
- **Space**: start/restart game

## Game rules

- Hit bricks with the ball to score points.
- If the ball goes below the paddle, the game is over.
- Clear all bricks to win.

## Stop the game server

In the terminal where the server is running, press:

- **Ctrl + C**

## Troubleshooting

- **`python3: command not found`**
  - Install Python 3, then try again.
- **Page does not load**
  - Make sure the terminal is still running the server command.
  - Confirm you are using `http://localhost:4173` exactly.
- **Port already in use**
  - Run with a different port, for example:

    ```bash
    python3 -m http.server 8080
    ```

  - Then open `http://localhost:8080`.
