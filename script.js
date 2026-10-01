/**
 * ROYAL WEDDING INVITATION — JAVASCRIPT ENGINE
 * Inspired by Artful Invites & Framer Luxury Interactive Experience
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION & GLOBAL STATE
  // ==========================================
  const WEDDING_CONFIG = {
    coupleNames: 'Kiran & Rahul',
    weddingDate: new Date('2026-12-17T10:00:00+05:30'),
    hashtag: '#Rahulkikiran',
    whatsappPhone: '919876543210',
    audioTracks: [
      { name: '🎶 Raag Yaman (Sitar)', mode: 'yaman' },
      { name: '🪈 Royal Flute & Shehnai', mode: 'shehnai' },
      { name: '✨ Sacred Vivah Harmonies', mode: 'sacred' }
    ]
  };

  let currentTrackIndex = 0;
  let isAudioPlaying = false;
  let currentEventSlide = 0;
  const totalEventSlides = 5;

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const musicToggleBtn = document.getElementById('music-toggle');
  const trackSwitchBtn = document.getElementById('track-switch');
  const trackLabel = document.getElementById('track-label');
  const touchMagicBtn = document.getElementById('btn-touch-magic');
  const pageDots = document.querySelectorAll('.page-dot');
  const cards = document.querySelectorAll('.invite-card');
  const carouselTrack = document.getElementById('events-track');
  const carouselPrevBtn = document.getElementById('carousel-prev');
  const carouselNextBtn = document.getElementById('carousel-next');
  const carouselDots = document.querySelectorAll('.c-dot');
  const toastPopup = document.getElementById('toast-popup');
  const petalToggleBtn = document.getElementById('petal-toggle');

  // ==========================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, duration = 3000) {
    if (!toastPopup) return;
    toastPopup.textContent = message;
    toastPopup.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toastPopup.classList.remove('show');
    }, duration);
  }
  window.showToast = showToast;

  // ==========================================
  // WEB AUDIO API — ZERO-DEPENDENCY INDIAN INSTRUMENTAL SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let synthInterval = null;
  let masterGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a single resonant melodic acoustic tone
  function playMelodicTone(freq, time, duration, type = 'sine') {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      // Acoustic envelope (gentle attack, shimmering decay)
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.3, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  // Chime burst for "Touch here for Magic"
  function playMagicChime() {
    initAudioContext();
    const now = audioCtx.currentTime;
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    chimeNotes.forEach((freq, i) => {
      playMelodicTone(freq, now + i * 0.09, 1.2, 'triangle');
    });
  }

  // Raag Melodic Sequencer
  function startAcousticSynthesizer(mode = 'yaman') {
    initAudioContext();
    stopAcousticSynthesizer();

    const scaleYaman = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25]; // C, D, E, F#, G, A, B, C
    const scaleShehnai = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
    const scaleSacred = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

    let currentScale = scaleYaman;
    if (mode === 'shehnai') currentScale = scaleShehnai;
    if (mode === 'sacred') currentScale = scaleSacred;

    let step = 0;
    // Ambient Tanpura Drone
    playDroneNote(130.81); // C3
    playDroneNote(196.00); // G3

    synthInterval = setInterval(() => {
      if (!isAudioPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const noteFreq = currentScale[Math.floor(Math.random() * currentScale.length)];
      const duration = 1.2 + Math.random() * 0.8;
      playMelodicTone(noteFreq, now, duration, 'sine');

      // Add soft harmony note
      if (step % 3 === 0) {
        const harmFreq = currentScale[(step + 2) % currentScale.length] * 0.5;
        playMelodicTone(harmFreq, now + 0.15, 1.8, 'triangle');
      }
      step++;
    }, 900);
  }

  function playDroneNote(freq) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      window._droneOsc = osc;
    } catch (e) {}
  }

  function stopAcousticSynthesizer() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function toggleAudio() {
    initAudioContext();
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      document.body.classList.add('playing');
      startAcousticSynthesizer(WEDDING_CONFIG.audioTracks[currentTrackIndex].mode);
      showToast(`🎵 Playing: ${WEDDING_CONFIG.audioTracks[currentTrackIndex].name}`);
    } else {
      document.body.classList.remove('playing');
      stopAcousticSynthesizer();
      showToast('🔇 Music Muted');
    }
  }

  function switchAudioTrack() {
    initAudioContext();
    currentTrackIndex = (currentTrackIndex + 1) % WEDDING_CONFIG.audioTracks.length;
    const track = WEDDING_CONFIG.audioTracks[currentTrackIndex];
    if (trackLabel) trackLabel.textContent = track.name;

    if (isAudioPlaying) {
      startAcousticSynthesizer(track.mode);
      showToast(`🎵 Switched to: ${track.name}`);
    } else {
      toggleAudio();
    }
  }

  if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleAudio);
  if (trackSwitchBtn) trackSwitchBtn.addEventListener('click', switchAudioTrack);

  // ==========================================
  // CARD NAVIGATION & SCROLL OBSERVER
  // ==========================================
  function goToCard(cardIndex) {
    const targetCard = document.getElementById(`card-${cardIndex + 1}`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth' });
    }
  }
  window.goToCard = goToCard;

  // Touch Here For Magic Action
  if (touchMagicBtn) {
    touchMagicBtn.addEventListener('click', () => {
      // Play acoustic chime
      playMagicChime();

      // Trigger sparkle confetti burst
      burstConfetti();

      // Start music if not playing
      if (!isAudioPlaying) {
        setTimeout(() => {
          toggleAudio();
        }, 500);
      }

      // Smoothly navigate to Card 2 (Family Blessings)
      setTimeout(() => {
        goToCard(1);
      }, 700);

      showToast('✨ Welcome to Kiran & Rahul\'s Wedding Festivities!');
    });
  }

  // ScrollSpy to update active top-bar page dots
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-card-index'), 10);
        pageDots.forEach((dot, dotIdx) => {
          dot.classList.toggle('active', dotIdx === index);
        });
      }
    });
  }, { threshold: 0.5 });

  cards.forEach((card) => cardObserver.observe(card));

  // Click on Page Dots
  pageDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToCard(idx);
    });
  });

  // ==========================================
  // EVENTS CAROUSEL SLIDESHOW
  // ==========================================
  function updateCarousel() {
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${currentEventSlide * 100}%)`;
    }
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentEventSlide);
    });
  }

  function nextEventSlide() {
    currentEventSlide = (currentEventSlide + 1) % totalEventSlides;
    updateCarousel();
  }

  function prevEventSlide() {
    currentEventSlide = (currentEventSlide - 1 + totalEventSlides) % totalEventSlides;
    updateCarousel();
  }

  if (carouselNextBtn) carouselNextBtn.addEventListener('click', nextEventSlide);
  if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', prevEventSlide);

  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      currentEventSlide = parseInt(dot.getAttribute('data-slide'), 10);
      updateCarousel();
    });
  });

  // Touch Swipe Support for Events Carousel
  let touchStartX = 0;
  let touchEndX = 0;
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextEventSlide();
      } else {
        prevEventSlide();
      }
    }
  }

  // ==========================================
  // ADD TO CALENDAR (.ICS GENERATOR)
  // ==========================================
  window.addToCalendar = function (title, startIso, location) {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hrs duration

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kiran & Rahul Wedding//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title} - Kiran & Rahul's Wedding`,
      `DESCRIPTION:Join us to celebrate ${title} for Kiran & Rahul's Wedding celebrations!`,
      `LOCATION:${location}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`📅 Downloaded calendar event for ${title}!`);
  };

  // ==========================================
  // LIVE COUNTDOWN TIMER
  // ==========================================
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.weddingDate.getTime() - now;

    const countDays = document.getElementById('count-days');
    const countHours = document.getElementById('count-hours');
    const countMinutes = document.getElementById('count-minutes');
    const countSeconds = document.getElementById('count-seconds');

    if (distance < 0) {
      if (countDays) countDays.textContent = '00';
      if (countHours) countHours.textContent = '00';
      if (countMinutes) countMinutes.textContent = '00';
      if (countSeconds) countSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    if (countDays) countDays.textContent = pad(days);
    if (countHours) countHours.textContent = pad(hours);
    if (countMinutes) countMinutes.textContent = pad(minutes);
    if (countSeconds) countSeconds.textContent = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // IN-APP RSVP FORM SUBMISSION & WHATSAPP
  // ==========================================
  window.handleRSVPSubmit = function (event) {
    event.preventDefault();
    const guestName = document.getElementById('guest-name').value.trim();
    const guestPhone = document.getElementById('guest-phone').value.trim();
    const guestCount = document.getElementById('guest-count').value;
    const wishes = document.getElementById('guest-wishes').value.trim();

    const selectedEvents = Array.from(document.querySelectorAll('input[name="events"]:checked'))
      .map((cb) => cb.value)
      .join(', ');

    // Burst celebration confetti
    burstConfetti();

    // Show success message
    const successBox = document.getElementById('rsvp-success');
    if (successBox) {
      successBox.style.display = 'block';
      successBox.innerHTML = `🎉 <strong>Dhanyawad, ${guestName}!</strong><br>We have recorded your RSVP for <strong>${guestCount} guest(s)</strong>. Looking forward to celebrating together!`;
    }

    // Auto-prepare WhatsApp message link
    const waText = encodeURIComponent(
      `Namaste Kiran & Rahul! 🎉\n\nI have confirmed our RSVP for your wedding celebrations!\n\n👤 Name: ${guestName}\n👥 Guests: ${guestCount}\n🎉 Events Attending: ${selectedEvents || 'All Events'}\n💬 Wishes: ${wishes || 'Best wishes for a lifetime of love!'}`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${WEDDING_CONFIG.whatsappPhone}&text=${waText}`;

    // Update WhatsApp button with personalized details
    const waBtn = document.getElementById('whatsapp-rsvp-btn');
    if (waBtn) {
      waBtn.href = waUrl;
    }

    showToast(`✨ RSVP confirmed for ${guestName}!`);
  };

  // ==========================================
  // HASHTAG COPY TO CLIPBOARD
  // ==========================================
  window.copyHashtag = function () {
    const hashtag = WEDDING_CONFIG.hashtag;
    navigator.clipboard.writeText(hashtag).then(() => {
      const copyLabel = document.getElementById('copy-btn-label');
      if (copyLabel) copyLabel.textContent = 'Copied! ✅';
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copy Hashtag';
      }, 2500);
      showToast(`📋 Copied ${hashtag} to clipboard!`);
    }).catch(() => {
      showToast(`Hashtag: ${hashtag}`);
    });
  };

  // ==========================================
  // PERSONALIZED VIP GUEST PASS
  // ==========================================
  window.generateVIPPass = function () {
    const input = document.getElementById('vip-guest-input');
    const display = document.getElementById('vip-display-name');
    if (input && display) {
      const name = input.value.trim() || 'Honored Wedding Guest';
      display.textContent = name;
      showToast(`👑 VIP Pass generated for ${name}!`);
      burstConfetti();
    }
  };

  window.saveVIPPass = function () {
    window.print();
  };

  // ==========================================
  // ROSE PETAL & GOLD DUST PARTICLE CANVAS ENGINE
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  let ctx = null;
  let particles = [];
  let isParticlesActive = true;

  function initParticles() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Seed initial particles (Rose petals + gold sparkles)
    for (let i = 0; i < 35; i++) {
      particles.push(createParticle());
    }

    requestAnimationFrame(renderParticles);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle(x, y, isBurst = false) {
    const isPetal = Math.random() > 0.4;
    return {
      x: x !== undefined ? x : Math.random() * canvas.width,
      y: y !== undefined ? y : Math.random() * canvas.height - 50,
      size: isPetal ? 8 + Math.random() * 8 : 2 + Math.random() * 3,
      speedX: isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5,
      speedY: isBurst ? (Math.random() - 0.5) * 8 : 0.8 + Math.random() * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      opacity: 0.6 + Math.random() * 0.4,
      isPetal: isPetal,
      life: isBurst ? 100 : Infinity,
      color: isPetal
        ? ['#f06292', '#e91e63', '#f48fb1', '#ffb74d'][Math.floor(Math.random() * 4)]
        : '#d1b17a'
    };
  }

  function renderParticles() {
    if (!ctx || !isParticlesActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.life !== Infinity) {
        p.life--;
        p.opacity = p.life / 100;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
      }

      // Recycle fallen particles
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      if (p.isPetal) {
        // Draw delicate rose petal curve
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw golden stardust diamond
        ctx.fillStyle = '#fce4a6';
        ctx.shadowColor = '#d1b17a';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(renderParticles);
  }

  function burstConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle(x, y, true));
    }
  }

  if (petalToggleBtn) {
    petalToggleBtn.addEventListener('click', () => {
      isParticlesActive = !isParticlesActive;
      if (isParticlesActive) {
        renderParticles();
        showToast('🌸 Petals & Gold Dust: ON');
      } else {
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        showToast('🌸 Petals: OFF');
      }
    });
  }

  // Click anywhere to trigger subtle sparkle effect
  document.addEventListener('click', (e) => {
    // Only trigger if clicked outside form inputs
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      for (let i = 0; i < 6; i++) {
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    }
  });

  // Initialize Canvas
  initParticles();

})();
