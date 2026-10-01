/* ═══════════════════════════════════════════════════════════════
   THE WEDDING EDITION — MASTER EDITORIAL SCRIPT
   - Blessing Petal & Gold Dust Physics Shower Engine
   - 3-Track Web Audio Traditional Synthesizer (Raag / Kirtan / Sangeet)
   - Interactive 3-Day Itinerary Filter Tabs
   - Interactive 4 Laavan Spiritual Carousel
   - Personalized Digital Wedding Pass Generator
   - Photo Heart Reactions & Gallery Lightbox
   - RSVP with DJ Song Request & Live Wishing Well
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CONFIGURATION ───
  // Wedding Date: Friday, February 19, 2027 10:00 AM IST
  const WEDDING_DATE = new Date('2027-02-19T10:00:00+05:30');

  // ─── DOM SELECTORS ───
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const editorialCover     = $('#editorial-cover');
  const btnEnterCover      = $('#btn-enter-cover');
  const mainNav            = $('#main-nav');
  const navToggle          = $('#nav-toggle');
  const navMenu            = $('#nav-menu');
  const audioPill          = $('#audio-pill');
  const trackBtns          = $$('.track-btn');
  const btnShowerBlessings = $('#btn-shower-blessings');
  const blessingsCanvas    = $('#blessings-canvas');
  const lbModal            = $('#lightbox-editorial');
  const lbImg              = $('#lb-stage-img');
  const lbCaption          = $('#lb-stage-caption');
  const rsvpForm           = $('#rsvp-editorial-form');
  const rsvpSuccess        = $('#rsvp-success-view');
  const successMsg         = $('#success-personal-msg');
  const wishesList         = $('#wishes-list');
  const passInputName      = $('#pass-input-name');
  const passNameDisplay    = $('#pass-name-display');
  const btnSavePass        = $('#btn-save-pass');

  // ─── STATE ───
  let isCoverOpened     = false;
  let isAudioPlaying    = false;
  let currentTrack      = 'raag';
  let currentGalleryIdx = 0;
  let galleryItemsData  = [];

  // ═══════════════════════════════════════════════════════════════
  // 1. BLESSING PETAL & GOLD DUST PARTICLE PHYSICS ENGINE
  // ═══════════════════════════════════════════════════════════════
  let canvasCtx = null;
  let particles = [];
  let animFrameId = null;

  function initCanvas() {
    if (!blessingsCanvas) return;
    canvasCtx = blessingsCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!blessingsCanvas) return;
    blessingsCanvas.width = window.innerWidth;
    blessingsCanvas.height = window.innerHeight;
  }

  class PetalParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * -window.innerHeight * 0.5; // Start above screen
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = -20;
      this.size = 8 + Math.random() * 12;
      this.speedY = 1.2 + Math.random() * 2.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 1.5;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.03 + Math.random() * 0.05;

      // Color Palette: Rose Petal (Blush), Marigold (Gold/Orange), or Gold Glitter Spark
      const types = ['rose', 'marigold', 'goldSpark'];
      this.type = types[Math.floor(Math.random() * types.length)];

      if (this.type === 'rose') {
        this.color = `rgba(${230 + Math.random() * 25}, ${160 + Math.random() * 40}, ${170 + Math.random() * 30}, ${0.75 + Math.random() * 0.25})`;
      } else if (this.type === 'marigold') {
        this.color = `rgba(${240 + Math.random() * 15}, ${170 + Math.random() * 50}, ${30 + Math.random() * 40}, ${0.8 + Math.random() * 0.2})`;
      } else {
        this.color = `rgba(212, 182, 112, ${0.7 + Math.random() * 0.3})`;
        this.size = 2.5 + Math.random() * 4;
      }
    }

    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 1.2 + this.speedX * 0.2;
      this.rotation += this.rotSpeed;

      if (this.y > window.innerHeight + 30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.fillStyle = this.color;
      ctx.beginPath();

      if (this.type === 'goldSpark') {
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.shadowColor = '#E5CD82';
        ctx.shadowBlur = 6;
      } else {
        // Organic Petal Shape
        ctx.ellipse(0, 0, this.size * 0.6, this.size, Math.PI / 4, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.restore();
    }
  }

  function startPetalShower(burst = 50) {
    initCanvas();
    if (!canvasCtx) return;

    for (let i = 0; i < burst; i++) {
      particles.push(new PetalParticle());
    }

    if (!animFrameId) {
      loopParticles();
    }
  }

  function loopParticles() {
    if (!canvasCtx || !blessingsCanvas) return;
    canvasCtx.clearRect(0, 0, blessingsCanvas.width, blessingsCanvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(canvasCtx);
    }

    animFrameId = requestAnimationFrame(loopParticles);
  }

  function initBlessingShower() {
    if (btnShowerBlessings) {
      btnShowerBlessings.addEventListener('click', () => {
        playCoverChime();
        startPetalShower(45);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. MULTI-TRACK WEB AUDIO RAGA SYNTHESIZER
  // ═══════════════════════════════════════════════════════════════
  let audioCtx = null;
  let masterGain = null;
  let melodyInterval = null;

  function initAudioEngine() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    } catch (e) {
      console.log('Web Audio not supported');
    }
  }

  function playCoverChime() {
    initAudioEngine();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const notes = [293.66, 369.99, 440.00, 587.33, 880.00];

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.3);
    });
  }

  function startAmbientMelody() {
    initAudioEngine();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = true;
    if (audioPill) audioPill.classList.add('playing');

    const trackScales = {
      raag: [146.83, 185.00, 220.00, 293.66, 369.99, 440.00, 587.33, 739.99], // Yaman
      shabad: [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25],       // Meditative Bilawal
      sangeet: [164.81, 196.00, 220.00, 246.94, 329.63, 392.00, 440.00, 493.88] // Festive Folk
    };

    function playNote(freq, dur = 2.0, vol = 0.05) {
      if (!isAudioPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = currentTrack === 'sangeet' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + dur + 0.1);
    }

    if (melodyInterval) clearInterval(melodyInterval);
    melodyInterval = setInterval(() => {
      if (!isAudioPlaying) return;
      const currentScale = trackScales[currentTrack] || trackScales.raag;
      const randNote = currentScale[Math.floor(Math.random() * currentScale.length)];
      playNote(randNote, 2.2 + Math.random() * 1.5, 0.045);

      if (Math.random() > 0.65) {
        setTimeout(() => playNote(currentScale[0], 3.2, 0.035), 300);
      }
    }, 1600);
  }

  function stopAmbientMelody() {
    isAudioPlaying = false;
    if (audioPill) audioPill.classList.remove('playing');
    if (melodyInterval) {
      clearInterval(melodyInterval);
      melodyInterval = null;
    }
  }

  function initAudio() {
    if (audioPill) {
      audioPill.addEventListener('click', () => {
        if (isAudioPlaying) {
          stopAmbientMelody();
        } else {
          startAmbientMelody();
        }
      });
    }

    trackBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        trackBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentTrack = btn.dataset.track;
        if (!isAudioPlaying) {
          startAmbientMelody();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. EDITORIAL FOLIO OPENING CONTROLLER
  // ═══════════════════════════════════════════════════════════════
  function openFolio() {
    if (isCoverOpened) return;
    isCoverOpened = true;

    playCoverChime();
    startPetalShower(35);

    if (editorialCover) {
      editorialCover.classList.add('opened');
    }

    document.body.classList.remove('editorial-invitation-mode');

    // Staggered hero entrance
    const heroAnims = $$('.anim-fade', $('#hero'));
    heroAnims.forEach((el) => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('in-view');
      }, delay);
    });

    setTimeout(startAmbientMelody, 800);
  }

  function initCoverInteraction() {
    if (btnEnterCover) {
      btnEnterCover.addEventListener('click', openFolio);
    }
    if (editorialCover) {
      editorialCover.addEventListener('click', (e) => {
        if (e.target === editorialCover) openFolio();
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. DAY-BY-DAY ITINERARY FILTER TABS
  // ═══════════════════════════════════════════════════════════════
  function initDayTabs() {
    const dayBtns = $$('.day-tab-btn');
    const cards = $$('.itinerary-card');
    if (!dayBtns.length || !cards.length) return;

    dayBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        dayBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedDay = btn.dataset.day;

        cards.forEach((card) => {
          if (selectedDay === 'all' || card.dataset.eventDay === selectedDay) {
            card.classList.remove('hidden-by-tab');
          } else {
            card.classList.add('hidden-by-tab');
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. INTERACTIVE 4 LAAVAN CAROUSEL
  // ═══════════════════════════════════════════════════════════════
  const laavanData = {
    1: {
      step: 'First Laav',
      title: 'Faith, Righteousness & Daily Duty',
      gurmukhi: 'ਹਰਿ ਪਹਿਲੜੀ ਲਾਵ ਪਰਵਿਰਤੀ ਕਰਮ ਦ੍ਰਿੜਾਇਆ ਬਲਿ ਰਾਮ ਜੀਉ ॥',
      meaning: '"In the first round of the marriage ceremony, the Lord instructs the couple to perform the righteous duties of family life. Hold firm to faith, meditate on the Divine Name, and let righteousness guide every thought."'
    },
    2: {
      step: 'Second Laav',
      title: 'Reverence & Awakening Divine Love',
      gurmukhi: 'ਹਰਿ ਦੂਜੜੀ ਲਾਵ ਸਤਿਗੁਰੁ ਪੁਰਖੁ ਮਿਲਾਇਆ ਬਲਿ ਰਾਮ ਜੀਉ ॥',
      meaning: '"In the second round, the Lord leads the souls to meet the True Guru. Shedding pride and ego, the heart fills with reverence and unconditional divine love for one another and the Creator."'
    },
    3: {
      step: 'Third Laav',
      title: 'Detachment & Spiritual Joy',
      gurmukhi: 'ਹਰਿ ਤੀਜੜੀ ਲਾਵ ਮਨਿ ਚਾਉ ਭਇਆ ਬੈਰਾਗੀਆ ਬਲਿ ਰਾਮ ਜੀਉ ॥',
      meaning: '"In the third round, yearning and contentment arise in the mind. The couple finds joy in the company of the holy, singing the praises of the Divine and filling their home with peace."'
    },
    4: {
      step: 'Fourth Laav',
      title: 'Eternal Oneness & Harmony',
      gurmukhi: 'ਹਰਿ ਚਉਥੜੀ ਲਾਵ ਮਨਿ ਸਹਜੁ ਭਇਆ ਹਰਿ ਪਾਇਆ ਬਲਿ ਰਾਮ ਜੀਉ ॥',
      meaning: '"In the fourth round, spiritual poise is attained. The two souls merge into one divine melody, blessed by Waheguru to walk as eternal partners in this life and beyond."'
    }
  };

  function initLaavanCarousel() {
    const tabs = $$('.laav-tab');
    const displayCard = $('#laav-display-card');
    const stepEl = $('#laav-step');
    const titleEl = $('#laav-title');
    const gurmukhiEl = $('#laav-gurmukhi');
    const meaningEl = $('#laav-meaning');

    if (!tabs.length || !displayCard) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const laavNum = tab.dataset.laav;
        const data = laavanData[laavNum];

        // Play gentle bell chime
        playCoverChime();

        // Smooth fade update
        displayCard.style.opacity = '0.3';
        displayCard.style.transform = 'translateY(8px)';

        setTimeout(() => {
          if (stepEl) stepEl.textContent = data.step;
          if (titleEl) titleEl.textContent = data.title;
          if (gurmukhiEl) gurmukhiEl.textContent = data.gurmukhi;
          if (meaningEl) meaningEl.textContent = data.meaning;

          displayCard.style.opacity = '1';
          displayCard.style.transform = 'translateY(0)';
        }, 200);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. PERSONALIZED DIGITAL WEDDING PASS GENERATOR
  // ═══════════════════════════════════════════════════════════════
  function initDigitalPass() {
    if (!passInputName || !passNameDisplay) return;

    passInputName.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      passNameDisplay.textContent = val.length > 0 ? val : 'Honored Guest';
    });

    if (btnSavePass) {
      btnSavePass.addEventListener('click', () => {
        startPetalShower(30);
        window.print();
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. PHOTO HEART REACTIONS & LIGHTBOX
  // ═══════════════════════════════════════════════════════════════
  function initGalleryReactions() {
    const reactBtns = $$('.btn-react-heart');
    reactBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cntEl = $('.heart-cnt', btn);
        if (cntEl) {
          let current = parseInt(cntEl.textContent) || 0;
          cntEl.textContent = current + 1;
        }
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => (btn.style.transform = 'scale(1)'), 250);
        startPetalShower(8);
      });
    });

    // Lightbox modal logic
    const photoItems = $$('.gallery-photo-item');
    if (!photoItems.length || !lbModal) return;

    galleryItemsData = photoItems.map((item) => {
      const img = $('img', item);
      const title = $('.photo-title', item);
      return {
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        title: title ? title.textContent : ''
      };
    });

    photoItems.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
    });

    const closeBtn = $('#lb-close-btn');
    const prevBtn  = $('#lb-prev-btn');
    const nextBtn  = $('#lb-next-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn)  prevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (nextBtn)  nextBtn.addEventListener('click', () => navigateLightbox(1));

    lbModal.addEventListener('click', (e) => {
      if (e.target === lbModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lbModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    if (!galleryItemsData[index]) return;
    currentGalleryIdx = index;
    const item = galleryItemsData[index];

    if (lbImg) {
      lbImg.src = item.src;
      lbImg.alt = item.alt;
    }
    if (lbCaption) {
      lbCaption.textContent = item.title || item.alt;
    }

    lbModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lbModal) return;
    lbModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (!galleryItemsData.length) return;
    currentGalleryIdx = (currentGalleryIdx + dir + galleryItemsData.length) % galleryItemsData.length;
    openLightbox(currentGalleryIdx);
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. RSVP WITH SONG REQUEST & LIVE WISHING WELL
  // ═══════════════════════════════════════════════════════════════
  function initRSVP() {
    if (!rsvpForm || !rsvpSuccess) return;

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const name = formData.get('name') || 'Beloved Guest';
      const attend = formData.get('attendance');
      const guests = formData.get('guest_count');
      const song = formData.get('song');
      const wishes = formData.get('wishes');

      if (successMsg) {
        if (attend === 'Yes') {
          successMsg.innerHTML = `Dearest <strong>${escapeHtml(name)}</strong>, we are overjoyed that you and your party of <strong>${guests}</strong> will join us in Amritsar! Waheguru Ji bless you.`;
        } else {
          successMsg.innerHTML = `Dearest <strong>${escapeHtml(name)}</strong>, thank you for sending your warm love and blessings. You will be dearly missed!`;
        }
      }

      // Add to live wishing well stream
      if ((wishes && wishes.trim().length > 0) || (song && song.trim().length > 0)) {
        if (wishesList) {
          const newCard = document.createElement('div');
          newCard.className = 'wish-card';
          let content = '';
          if (wishes && wishes.trim().length > 0) {
            content += `<p class="wish-quote">"${escapeHtml(wishes)}"</p>`;
          }
          if (song && song.trim().length > 0) {
            content += `<p style="font-size: 0.78rem; color: var(--gold-dark); margin-bottom: 0.4rem;">🎵 Requested Track: <em>${escapeHtml(song)}</em></p>`;
          }
          content += `<div class="wish-from">— ${escapeHtml(name)} (Just now)</div>`;

          newCard.innerHTML = content;
          wishesList.prepend(newCard);
        }
      }

      // Trigger celebratory petal shower
      startPetalShower(50);

      rsvpForm.hidden = true;
      rsvpSuccess.hidden = false;
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. LIVE WEDDING COUNTDOWN TIMER
  // ═══════════════════════════════════════════════════════════════
  function initCountdown() {
    const dEl = $('#cd-days');
    const hEl = $('#cd-hours');
    const mEl = $('#cd-mins');
    const sEl = $('#cd-secs');

    if (!dEl || !hEl || !mEl || !sEl) return;

    function update() {
      const now = new Date();
      const diff = WEDDING_DATE - now;

      if (diff <= 0) {
        dEl.textContent = '00';
        hEl.textContent = '00';
        mEl.textContent = '00';
        sEl.textContent = '00';
        return;
      }

      const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs  = Math.floor((diff % (1000 * 60)) / 1000);

      const dStr = String(days).padStart(2, '0');
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');

      if (dEl.textContent !== dStr) dEl.textContent = dStr;
      if (hEl.textContent !== hStr) hEl.textContent = hStr;
      if (mEl.textContent !== mStr) mEl.textContent = mStr;
      if (sEl.textContent !== sStr) sEl.textContent = sStr;
    }

    update();
    setInterval(update, 1000);
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. SCROLL REVEALS & NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  function initScrollAndNav() {
    const items = $$('.anim-up');
    if (items.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => entry.target.classList.add('in-view'), delay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      items.forEach((el) => observer.observe(el));
    }

    if (!mainNav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }, { passive: true });

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      $$('[data-nav]').forEach((link) => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('open');
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active Section Tracking
    const sections = $$('section[id], header[id]');
    const navLinks = $$('.nav-menu a');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '-60px 0px -50% 0px' });

    sections.forEach((sec) => navObserver.observe(sec));

    // Smooth Scroll
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = $(targetId);
        if (!targetEl) return;

        e.preventDefault();
        const offset = mainNav ? mainNav.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  function init() {
    initCoverInteraction();
    initBlessingShower();
    initAudio();
    initDayTabs();
    initLaavanCarousel();
    initDigitalPass();
    initGalleryReactions();
    initRSVP();
    initCountdown();
    initScrollAndNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
