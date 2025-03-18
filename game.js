const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.health = 100;
        this.width = 20;
        this.height = 20;
    }

    move() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - 5, (this.health / 100) * this.width, 3);
    }
}

class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.cooldown = 0;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }

    attack(enemies, projectiles) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        for (let enemy of enemies) {
            let dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < this.range) {
                projectiles.push(new Projectile(this.x, this.y, enemy));
                this.cooldown = 30; // Cooldown before next shot
                break;
            }
        }
    }
}

class Projectile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 3;
    }

    move() {
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let dist = Math.hypot(dx, dy);
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // Check if it hit the target
        if (dist < 5) {
            this.target.health -= 20;
            return true; // Mark for removal
        }
        return false;
    }

    draw() {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

const enemies = [new Enemy(0, 180, 1)];
const towers = [new Tower(300, 200)];
const projectiles = [];

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
    });

    towers.forEach(tower => {
        tower.draw();
        tower.attack(enemies, projectiles);
    });

    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (projectiles[i].move()) {
            projectiles.splice(i, 1);
        } else {
            projectiles[i].draw();
        }
    }

    // Remove dead enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].health <= 0) {
            enemies.splice(i, 1);
        }
    }

    // Spawn new enemies
    if (Math.random() < 0.02) {
        enemies.push(new Enemy(0, 180, 1));
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
