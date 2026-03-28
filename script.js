document.addEventListener('DOMContentLoaded', () => {

    // 1) Daktilo Efekti
    const typeWriterElement = document.getElementById('typewriter');
    const phrases = [
        "iyi ki ailem oldun...",
        "benim bitanecik zipzipim",
        "nefes alma sebebim",
        "sana fena aşığım!",
        "her şeyimsin...",
        "iyi ki benim oldun sevgilim"
    ];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;
    
    function typeEffect() {
        if (!typeWriterElement) return;
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) charIndex--; else charIndex++;
        typeWriterElement.innerText = currentPhrase.substring(0, charIndex);
        
        let typeSpeed = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex === currentPhrase.length) { typeSpeed = 2000; isDeleting = true; } 
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 500; }
        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 1000);

    // 2) Birliktelik Sayacı (21 Ocak 2026)
    const startDate = new Date("2026-01-21T00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = now - startDate;
        if (distance > 0) {
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);

    /* --- Yağan Kalpler Animasyonu --- */
    function createHeartRain() {
        const container = document.getElementById('heart-rain-container');
        for (let i = 0; i < 25; i++) {
            let heart = document.createElement('div');
            heart.classList.add('falling-heart');
            heart.innerHTML = ['💖', '💕', '🌸', '✨'][Math.floor(Math.random()*4)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 4 + 's';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.fontSize = Math.random() * 1.5 + 1 + 'rem';
            container.appendChild(heart);
        }
    }
    createHeartRain();

    /* --- Kalp Bombası Patlama Animasyonu --- */
    const polaroids = document.querySelectorAll('.polaroid');
    setTimeout(() => {
        polaroids.forEach((p, idx) => {
            setTimeout(() => {
                p.classList.add('exploded');
            }, idx * 120); // 120ms arayla şık bir şekilde arka arkaya patlayarak yayılacaklar
        });
    }, 800); // Site açıldıktan 0.8 saniye sonra bombayı başlat

    /* --- Ördek Oyunu Motoru --- */
    const board = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const duckCountText = document.getElementById('duck-count');
    const overlay = document.getElementById('secret-overlay');
    const closeBtn = document.getElementById('close-letter');
    const musicBox = document.querySelector('.music-box');
    
    let totalDucks = 10;
    let duckInterval;
    let activeDucks = []; 
    let gameActive = false;

    startBtn.addEventListener('click', startGame);

    function startGame() {
        startBtn.style.display = 'none';
        totalDucks = 10;
        duckCountText.innerText = totalDucks;
        gameActive = true;
        
        spawnDuck(); 
        
        let spawned = 1;
        duckInterval = setInterval(() => {
            if (spawned < 10) {
                spawnDuck();
                spawned++;
            } else {
                clearInterval(duckInterval);
            }
        }, 1200);
    }

    function spawnDuck() {
        if (!gameActive) return;
        
        const duck = document.createElement('div');
        duck.classList.add('duck');
        duck.innerText = ['🦆', '🐤', '🐥'][Math.floor(Math.random()*3)];
        
        const size = 60;
        const maxX = board.clientWidth - size;
        const maxY = board.clientHeight - size;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        duck.style.left = randomX + 'px';
        duck.style.top = randomY + 'px';

        board.appendChild(duck);
        activeDucks.push(duck);

        duck.addEventListener('mousedown', function() {
            catchDuck(this, parseFloat(duck.style.left), parseFloat(duck.style.top));
        });
        duck.addEventListener('touchstart', function(e) {
            e.preventDefault();
            catchDuck(this, parseFloat(duck.style.left), parseFloat(duck.style.top));
        });

        const moveInterval = setInterval(() => {
            if(!duck.parentNode || !gameActive) {
                clearInterval(moveInterval);
                return;
            }
            const newX = Math.floor(Math.random() * maxX);
            const newY = Math.floor(Math.random() * maxY);
            duck.style.left = newX + 'px';
            duck.style.top = newY + 'px';
            duck.style.transition = 'top 0.7s ease, left 0.7s ease'; 
        }, 1000 + Math.random() * 800);
    }

    function catchDuck(duckElement, x, y) {
        if (!gameActive) return;
        
        duckElement.remove();
        createParticle(x, y);

        totalDucks--;
        duckCountText.innerText = totalDucks;
        
        if (totalDucks <= 0) {
            gameActive = false;
            setTimeout(winGame, 600);
        }
    }

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle-heart');
        particle.innerText = Math.random() > 0.5 ? '❤️' : '💖'; 
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        board.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    function winGame() {
        board.innerHTML = '<h3 style="color:var(--accent-red); font-family:var(--font-header); font-size:3rem; animation: popHeart 1s forwards;">Oyun Bitti! 🎉</h3>';
        
        setTimeout(() => {
            overlay.classList.add('show');
            fireConfetti();
        }, 1500);
    }

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('show');
        board.innerHTML = '';
        board.appendChild(startBtn);
        startBtn.style.display = 'block';
        startBtn.innerText = 'Tekrar Yakala 🔁';
        duckCountText.innerText = '10';
    });
    // --- Yerel MP3 Müzik Oynatıcısı --- //
    const musicTrigger = document.getElementById('music-trigger');
    const audio = document.getElementById('bg-music');
    let playing = false;

    musicTrigger.addEventListener('click', () => {
        if (!playing) {
            audio.play().catch(e => {
                alert("Müzik dosyan (sarki.mp3) assets klasöründe bulunamadı veya bir hata oluştu! 🎵");
                console.error(e);
            });
            musicTrigger.innerText = '⏸️';
            playing = true;
        } else {
            audio.pause();
            musicTrigger.innerText = '🎵';
            playing = false;
        }
    });
    function fireConfetti() {
        for(let i=0; i<40; i++) {
            setTimeout(() => {
                const conf = document.createElement('div');
                conf.innerText = ['🎀', '✨', '💖', '💌', '🌸'][Math.floor(Math.random()*5)];
                conf.style.position = 'fixed';
                conf.style.left = Math.random() * 100 + 'vw';
                conf.style.top = '-50px';
                conf.style.fontSize = Math.random() * 1.5 + 1 + 'rem';
                conf.style.zIndex = '9999';
                conf.style.pointerEvents = 'none';
                conf.style.transition = 'top 4s linear, left 4s ease-in-out';
                document.body.appendChild(conf);

                setTimeout(() => {
                    conf.style.top = '120vh';
                    conf.style.left = (parseFloat(conf.style.left) + (Math.random() * 20 - 10)) + 'vw';
                }, 50);

                setTimeout(() => conf.remove(), 4100);
            }, i * 150);
        }
    }
});
