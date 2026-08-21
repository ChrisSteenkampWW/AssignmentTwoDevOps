class GameModel {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.score = 0;
                this.lives = 3;
                
                this.basket = {
                    x: width / 2 - 40,
                    y: height - 40,
                    width: 80,
                    height: 20,
                    speed: 8,
                    dx: 0
                };

                this.star = {
                    x: Math.random() * (width - 20),
                    y: 0,
                    radius: 14,
                    speed: 3
                };
            }

            update() {
                this.basket.x += this.basket.dx;
                if (this.basket.x < 0) this.basket.x = 0;
                if (this.basket.x + this.basket.width > this.width) {
                    this.basket.x = this.width - this.basket.width;
                }

                this.star.y += this.star.speed;

                if (
                    this.star.y + this.star.radius >= this.basket.y &&
                    this.star.x >= this.basket.x &&
                    this.star.x <= this.basket.x + this.basket.width
                ) {
                    this.score += 1;
                    this.resetStar();
                    this.star.speed += 0.2; 
                }
                if (this.star.y > this.height) {
                    this.lives -= 1;
                    this.resetStar();
                }
            }

            resetStar() {
                this.star.y = 0;
                this.star.x = Math.random() * (this.width - 30) + 15;
            }
        }

        class GameView {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
            }

            render(model) {
                this.ctx.clearRect(0, 0, model.width, model.height);

                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(model.basket.x, model.basket.y, model.basket.width, model.basket.height);

                this.ctx.fillStyle = '#FFEB3B';
                this.ctx.beginPath();
                this.ctx.arc(model.star.x, model.star.y, model.star.radius, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = 'white';
                this.ctx.font = '16px Arial';
                this.ctx.fillText(`Score: ${model.score}`, 20, 30);
                this.ctx.fillText(`Lives: ${model.lives}`, model.width - 90, 30);

                if (model.lives <= 0) {
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(0, 0, model.width, model.height);
                    
                    this.ctx.fillStyle = '#FF5252';
                    this.ctx.font = '32px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('GAME OVER', model.width / 2, model.height / 2 - 15);
                    
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '16px Arial';
                    this.ctx.fillText('Refresh page to play again', model.width / 2, model.height / 2 + 25);
                    this.ctx.textAlign = 'left';
                }
            }
        }

        class GameController {
            constructor(model, view) {
                this.model = model;
                this.view = view;
                this.initListeners();
            }

            initListeners() {
                window.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.model.basket.dx = -this.model.basket.speed;
                    if (e.key === 'ArrowRight') this.model.basket.dx = this.model.basket.speed;
                });

                window.addEventListener('keyup', (e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        this.model.basket.dx = 0;
                    }
                });
            }

            run() {
                const gameLoop = () => {
                    if (this.model.lives > 0) {
                        this.model.update(); 
                    }
                    this.view.render(this.model); 
                    requestAnimationFrame(gameLoop); 
                };
                requestAnimationFrame(gameLoop);
            }
        }
        const canvas = document.getElementById('gameCanvas');
        const model = new GameModel(canvas.width, canvas.height);
        const view = new GameView(canvas);
        const controller = new GameController(model, view);

        controller.run();