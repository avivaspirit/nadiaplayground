/* Puffystagram — raise Puffy the orange-white cat (puffy.js)
   Feed (8 foods), dress up (hats/collars/clothes), scratch head, walkies
   (6 places from SCENE_LIB), photo album, love/treats economy, day counter. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------- state ---------------- */
  var PUFFY_DEFAULT_CUTE = {
    eyes: 'manga_round',
    brows: 'ginger_dots',
    nose: 'pink_triangle',
    mouth: 'cat_smile',
    ears: 'ginger_kitty',
    blush: 'soft_pink',
    emotion: 'happy',
    hat: 'none',
    collar: 'none',
    cloth: 'none'
  };

  var DEFAULT = {
    born: Date.now(), love: 0, coins: 10,
    food: 80, happy: 80, clean: 80,
    lastTick: Date.now(), lastDay: 0, days: 0,
    outfit: JSON.parse(JSON.stringify(PUFFY_DEFAULT_CUTE)),
    savedLooks: [],
    favFood: 'salmon',
    album: []
  };
  var S;
  try { S = JSON.parse(lsGet('puffygram') || 'null') || null; } catch (e) { S = null; }
  if (!S) { S = JSON.parse(JSON.stringify(DEFAULT)); save(); }
  else {
    /* merge defaults for upgrades */
    for (var k in DEFAULT) if (S[k] === undefined) S[k] = DEFAULT[k];
    if (!S.outfit) S.outfit = JSON.parse(JSON.stringify(PUFFY_DEFAULT_CUTE));
    for (var pk in PUFFY_DEFAULT_CUTE) {
      if (S.outfit[pk] === undefined) S.outfit[pk] = PUFFY_DEFAULT_CUTE[pk];
    }
    if (!S.savedLooks) S.savedLooks = [];
    if (!S.album) S.album = [];
  }
  function save() { lsSet('puffygram', JSON.stringify(S)); }

  /* ---------------- CAT ART (SVG, kawaii ginger & white chibi) ---------------- */
  var OR = '#ffad5c', OR_D = '#e07a2a', LN = '#b55e1c', WH = '#fffaf4', LN_W = '#dfc2a8', INK = '#3b232e', PK = '#ffa3c2', PK_D = '#e85d88';
  var petting = false;

  function puffySVG(opts) {
    opts = opts || {};
    var mood = opts.mood || moodOf();
    var pose = opts.pose || 'sit';
    var stepT = opts.step || 0;
    var o = S.outfit;
    var s = '';
    /* soft ground shadow */
    if (!opts.noShadow) {
      s += '<ellipse cx="0" cy="77" rx="46" ry="8.5" fill="rgba(110,55,20,.13)"/>';
    }
    /* sleep loaf pose */
    if (pose === 'sleep') {
      s += tailSVG('sleep');
      s += '<path d="M -52 58 C -58 28, -28 14, 12 16 C 48 18, 64 36, 58 60 C 54 74, -46 74, -52 58 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.8"/>';
      s += '<path d="M 8 20 q 4 14 0 26 M 24 22 q 4 14 0 26" stroke="' + OR_D + '" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".65"/>';
      s += '<ellipse cx="-8" cy="58" rx="34" ry="15" fill="' + WH + '"/>';
      s += '<g transform="translate(-22, 16) scale(.86)">' + headSVG('sleep', opts).replace(/^<g[^>]*>/, '<g>') + '</g>';
      s += '<ellipse cx="-38" cy="64" rx="11" ry="6.5" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.4"/>';
      s += '<ellipse cx="-6" cy="66" rx="11" ry="6.5" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.4"/>';
      s += '<text x="34" y="0" font-family="Inter,sans-serif" font-weight="900" font-size="16" fill="#a8798c">z</text>';
      s += '<text x="48" y="-14" font-family="Inter,sans-serif" font-weight="900" font-size="22" fill="#d6336c">Z</text>';
      return wrap(s, opts);
    }
    /* tail behind body */
    s += tailSVG(pose);
    /* chubby pear-shaped torso */
    s += '<path d="M -32 6 C -45 26, -47 56, -35 71 C -22 79, 22 79, 35 71 C 47 56, 45 26, 32 6 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.8" stroke-linejoin="round"/>';
    /* tabby side stripes on body */
    s += '<path d="M -41 34 q 10 2 14 7 M -42 46 q 10 2 14 6 M 41 34 q -10 2 -14 7 M 42 46 q -10 2 -14 6" stroke="' + OR_D + '" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".65"/>';
    /* snowy-cream chest & belly bib */
    s += '<path d="M -21 10 C -28 28, -28 56, -16 69 C -6 74, 6 74, 16 69 C 28 56, 28 28, 21 10 Z" fill="' + WH + '"/>';
    s += '<path d="M -6 22 q 6 5 12 0" stroke="' + LN_W + '" stroke-width="2" fill="none" stroke-linecap="round"/>';
    /* back paws peeking at sides with pink toe beans */
    var walkL = pose === 'walk' ? Math.sin(stepT) * 5 : 0;
    var walkR = pose === 'walk' ? -Math.sin(stepT) * 5 : 0;
    s += '<g transform="translate(0,' + walkL.toFixed(1) + ')">' +
         '<ellipse cx="-35" cy="70" rx="13" ry="8.5" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.5"/>' +
         '<ellipse cx="-35" cy="71.5" rx="4.5" ry="2.8" fill="' + PK + '"/>' +
         '<circle cx="-40" cy="67.5" r="1.7" fill="' + PK + '"/><circle cx="-35" cy="66.5" r="1.8" fill="' + PK + '"/><circle cx="-30" cy="67.5" r="1.7" fill="' + PK + '"/>' +
         '</g>';
    s += '<g transform="translate(0,' + walkR.toFixed(1) + ')">' +
         '<ellipse cx="35" cy="70" rx="13" ry="8.5" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.5"/>' +
         '<ellipse cx="35" cy="71.5" rx="4.5" ry="2.8" fill="' + PK + '"/>' +
         '<circle cx="30" cy="67.5" r="1.7" fill="' + PK + '"/><circle cx="35" cy="66.5" r="1.8" fill="' + PK + '"/><circle cx="40" cy="67.5" r="1.7" fill="' + PK + '"/>' +
         '</g>';
    /* cloth (on body) */
    s += CLOTHES[o.cloth].draw();
    /* front paws neatly in front */
    s += '<path d="M -21 44 C -22 60, -21 75, -13 75 C -5 75, -5 60, -6 44" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.5" stroke-linecap="round"/>' +
         '<path d="M -16 74 v -4 M -11 74 v -4" stroke="' + LN_W + '" stroke-width="1.8" stroke-linecap="round"/>' +
         '<path d="M 6 44 C 5 60, 5 75, 13 75 C 21 75, 22 60, 21 44" fill="' + WH + '" stroke="' + LN_W + '" stroke-width="2.5" stroke-linecap="round"/>' +
         '<path d="M 11 74 v -4 M 16 74 v -4" stroke="' + LN_W + '" stroke-width="1.8" stroke-linecap="round"/>';
    /* collar */
    s += COLLARS[o.collar].draw();
    /* head + hat (bobs down when eating from bowl) */
    var hbY = opts.headBobY || 0;
    s += '<g transform="translate(0,' + hbY.toFixed(1) + ')">';
    s += headSVG(mood, opts);
    s += HATS[o.hat].draw();
    s += '</g>';
    /* extra foreground layer (e.g. cat bowl, animated food, crumbs, popups) */
    if (opts.extra) s += opts.extra;
    /* floating hearts when being petted */
    if (opts.petting) {
      s += '<text x="-58" y="-68" font-size="18">💕</text><text x="42" y="-74" font-size="16">✨</text>';
    }
    return wrap(s, opts);
  }
  function wrap(inner, opts) {
    opts = opts || {};
    var vb = opts.viewBox || '-90 -90 180 180';
    var w = opts.w ? ' width="' + opts.w + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + w + ' class="puffysvg">' +
      (opts.bg || '') + inner + '</svg>';
  }
  function tailSVG(pose) {
    var lift = pose === 'walk' ? -8 : 0;
    return '<g class="puffyTail">' +
      '<path d="M 32 56 C 68 ' + (54 + lift) + ', 82 ' + (22 + lift) + ', 70 ' + (2 + lift) + '" stroke="' + LN + '" stroke-width="17.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 32 56 C 68 ' + (54 + lift) + ', 82 ' + (22 + lift) + ', 70 ' + (2 + lift) + '" stroke="' + OR + '" stroke-width="12.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 56 ' + (42 + lift) + ' q 6 -4 9 2 M 66 ' + (28 + lift) + ' q 6 -3 8 3" stroke="' + OR_D + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M 73 ' + (12 + lift) + ' Q 72 ' + (5 + lift) + ' 70 ' + (2 + lift) + '" stroke="' + WH + '" stroke-width="11.5" fill="none" stroke-linecap="round"/>' +
      '</g>';
  }
  function headSVG(mood, opts) {
    opts = opts || {};
    var isPet = !!opts.petting;
    var o = S.outfit || PUFFY_DEFAULT_CUTE;
    var eyeStyle = o.eyes || 'manga_round';

    var eyes = '';
    if (mood === 'sleep' || eyeStyle === 'sleepy_cozy' || isPet) {
      /* blissful closed purr/sleep arcs */
      var arc = isPet
        ? '<path d="M -31 2 Q -21 -9 -11 2 M 11 2 Q 21 -9 31 2" stroke="' + INK + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
        : '<path d="M -30 0 Q -21 8 -12 0 M 12 0 Q 21 8 30 0" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
      eyes = '<g class="puffyBlink">' + arc + '</g>';
    } else if (eyeStyle === 'happy_arcs') {
      eyes = '<g class="puffyBlink"><path d="M -31 0 Q -21 -10 -11 0 M 11 0 Q 21 -10 31 0" stroke="' + INK + '" stroke-width="3.8" fill="none" stroke-linecap="round"/></g>';
    } else if (eyeStyle === 'heart_eyes') {
      function heartEye(cx) {
        return '<path d="M ' + cx + ' 0 C ' + (cx - 7) + ' -8, ' + (cx - 12) + ' 1, ' + cx + ' 8 C ' + (cx + 12) + ' 1, ' + (cx + 7) + ' -8, ' + cx + ' 0 Z" fill="#ff3366" stroke="' + INK + '" stroke-width="1.8"/>' +
               '<circle cx="' + (cx - 2.5) + '" cy="-2" r="1.8" fill="#fff"/>';
      }
      eyes = heartEye(-21) + heartEye(21);
    } else if (eyeStyle === 'star_twinkle') {
      function starEye(cx) {
        return catEye(cx, false, false) +
               '<polygon points="' + cx + ',4 ' + (cx+2.5) + ',1.5 ' + (cx+5) + ',4 ' + (cx+2.5) + ',6.5" fill="#ffd166"/>';
      }
      eyes = starEye(-21) + starEye(21);
    } else if (eyeStyle === 'playful_wink') {
      eyes = catEye(-21, false, false) +
             '<path d="M 11 0 Q 21 -10 31 0" stroke="' + INK + '" stroke-width="3.8" fill="none" stroke-linecap="round"/><text x="24" y="-8" font-size="11">✨</text>';
    } else if (eyeStyle === 'sparkle_anime') {
      eyes = catEye(-21, false, true) + catEye(21, false, true);
    } else {
      // Default: Big glossy kawaii manga cat eyes!
      eyes = '<g class="puffyBlink">' + catEye(-21, false, false) + catEye(21, false, false) + '</g>';
    }

    // Brows
    var browStyle = o.brows || 'ginger_dots';
    var browsSvg = '';
    if (browStyle === 'sweet_arcs') {
      browsSvg = '<path d="M -28 -14 Q -21 -19 -14 -14 M 14 -14 Q 21 -19 28 -14" stroke="' + LN + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else if (browStyle === 'slant_worried') {
      browsSvg = '<path d="M -28 -12 L -14 -16 M 28 -12 L 14 -16" stroke="' + LN + '" stroke-width="2.4" stroke-linecap="round"/>';
    } else if (browStyle === 'bold_happy') {
      browsSvg = '<path d="M -29 -16 Q -21 -22 -13 -17 M 13 -17 Q 21 -22 29 -16" stroke="' + LN + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    } else if (browStyle === 'none') {
      browsSvg = '';
    } else {
      // Default: Signature ginger brow markings
      browsSvg = '<path d="M -27 -13 q 6 -3 12 0 M 15 -13 q 6 -3 12 0" stroke="' + LN + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }

    // Mouth
    var mouthStyle = o.mouth || 'cat_smile';
    var mouth = '';
    if (opts.chomp) {
      mouth = '<path d="M -9 12 Q 0 9 9 12 C 10 24, -10 24, -9 12 Z" fill="#9e2a4b" stroke="' + INK + '" stroke-width="2.3" stroke-linejoin="round"/>' +
              '<path d="M -6 17 Q 0 23 6 17 Q 3 14 0 15 Q -3 14 -6 17 Z" fill="#ff8fab"/>' +
              '<path d="M -5 12.2 l 1.6 3.2 l 1.6 -3.2 Z M 5 12.2 l -1.6 3.2 l -1.6 -3.2 Z" fill="#fff"/>';
    } else if (mouthStyle === 'blep_tongue') {
      mouth = '<path d="M 0 9.5 V 12 M -9 12.5 q 4.5 5 9 -1.5 q 4.5 6.5 9 1.5" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M -4 13 C -4 20, 4 20, 4 13 Z" fill="#ff6b96" stroke="' + INK + '" stroke-width="1.3"/>';
    } else if (mouthStyle === 'happy_fang') {
      mouth = '<path d="M -4.8 12.5 Q 0 21.5 4.8 12.5 Z" fill="#ff85a6" stroke="#c94066" stroke-width="1.5"/>' +
              '<path d="M 0 9.5 V 12 M -9 12.5 q 4.5 5 9 -1.5 q 4.5 6.5 9 1.5" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<polygon points="-3,12.5 -1,15.5 1,12.5" fill="#fff"/>';
    } else if (mouthStyle === 'sweet_line') {
      mouth = '<path d="M -6 13 Q 0 18 6 13" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else if (mouthStyle === 'tiny_o') {
      mouth = '<ellipse cx="0" cy="14" rx="3.5" ry="4.5" fill="#9e2a4b" stroke="' + INK + '" stroke-width="1.8"/>';
    } else {
      // Default: Cat Smile (:3)
      mouth = '<path d="M 0 9.5 V 12.5 M -8.5 13 q 4.2 5 8.5 -1 q 4.2 6 8.5 1" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }

    var h = '';
    // EARS
    var earStyle = o.ears || 'ginger_kitty';
    if (earStyle === 'folded_scottish') {
      h += '<g class="puffyEarL"><path d="M -40 -12 C -48 -24, -36 -38, -24 -30 C -18 -26, -16 -18, -16 -12 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.6"/><path d="M -34 -16 C -40 -24, -32 -32, -24 -26 Z" fill="' + PK + '"/></g>';
      h += '<g class="puffyEarR"><path d="M 40 -12 C 48 -24, 36 -38, 24 -30 C 18 -26, 16 -18, 16 -12 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.6"/><path d="M 34 -16 C 40 -24, 32 -32, 24 -26 Z" fill="' + PK + '"/></g>';
    } else if (earStyle === 'bunny_ears') {
      h += '<g class="puffyEarL"><ellipse cx="-22" cy="-56" rx="9" ry="26" fill="' + WH + '" stroke="' + LN + '" stroke-width="2.6" transform="rotate(-12 -22 -56)"/><ellipse cx="-22" cy="-56" rx="5" ry="18" fill="' + PK + '" transform="rotate(-12 -22 -56)"/></g>';
      h += '<g class="puffyEarR"><ellipse cx="22" cy="-56" rx="9" ry="26" fill="' + WH + '" stroke="' + LN + '" stroke-width="2.6" transform="rotate(12 22 -56)"/><ellipse cx="22" cy="-56" rx="5" ry="18" fill="' + PK + '" transform="rotate(12 22 -56)"/></g>';
    } else if (earStyle === 'bear_round') {
      h += '<g class="puffyEarL"><circle cx="-40" cy="-38" r="16" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.6"/><circle cx="-40" cy="-38" r="9" fill="' + PK + '"/></g>';
      h += '<g class="puffyEarR"><circle cx="40" cy="-38" r="16" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.6"/><circle cx="40" cy="-38" r="9" fill="' + PK + '"/></g>';
    } else {
      // Default: Iconic Plump Rounded Ginger Cat Ears with Pink Cushions
      h += '<g class="puffyEarL">' +
           '<path d="M -45 -12 C -55 -36, -50 -62, -37 -64 C -24 -65, -12 -46, -12 -34 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.8" stroke-linejoin="round"/>' +
           '<path d="M -41 -18 C -47 -34, -44 -52, -35 -54 C -27 -55, -19 -42, -19 -32 Z" fill="' + PK + '" opacity=".88"/>' +
           '<path d="M -39 -20 q 6 -5 13 -3" stroke="' + WH + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
           '</g>';
      h += '<g class="puffyEarR">' +
           '<path d="M 45 -12 C 55 -36, 50 -62, 37 -64 C 24 -65, 12 -46, 12 -34 Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.8" stroke-linejoin="round"/>' +
           '<path d="M 41 -18 C 47 -34, 44 -52, 35 -54 C 27 -55, 19 -42, 19 -32 Z" fill="' + PK + '" opacity=".88"/>' +
           '<path d="M 39 -20 q -6 -5 -13 -3" stroke="' + WH + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
           '</g>';
    }

    /* HEAD — wide squishy mochi-cat head */
    var headPath = 'M 0 -44 C 33 -44, 49 -26, 51 -4 C 57 12, 50 28, 30 33 C 16 36, -16 36, -30 33 C -50 28, -57 12, -51 -4 C -49 -26, -33 -44, 0 -44 Z';
    h += '<path d="' + headPath + '" fill="' + WH + '"/>';
    h += '<path d="M 0 -44 C 33 -44, 49 -26, 51 -4 C 53 4, 48 9, 41 6 C 28 1, 13 -13, 0 -22 C -13 -13, -28 1, -41 6 C -48 9, -53 4, -51 -4 C -49 -26, -33 -44, 0 -44 Z" fill="' + OR + '"/>';
    h += '<path d="M 0 -42 V -29 M -12 -40 Q -10 -33 -8 -28 M 12 -40 Q 10 -33 8 -28" stroke="' + OR_D + '" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".75"/>';
    h += '<path d="M -24 -34 Q 0 -42 24 -34" stroke="rgba(255,255,255,.45)" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
    h += '<path d="' + headPath + '" fill="none" stroke="' + LN + '" stroke-width="2.8" stroke-linejoin="round"/>';
    h += '<path d="M -6 -43 Q -2 -50 2 -43 Q 6 -49 8 -42" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';

    // Cheeks
    var blushStyle = o.blush || 'soft_pink';
    if (blushStyle === 'peachy_glow') {
      h += '<ellipse cx="-35" cy="11" rx="10" ry="6" fill="#f4a261" opacity=".75"/>' +
           '<ellipse cx="35" cy="11" rx="10" ry="6" fill="#f4a261" opacity=".75"/>';
    } else if (blushStyle === 'kawaii_hearts') {
      h += '<path d="M -35 8 C -38 4, -41 8, -35 13 C -29 8, -32 4, -35 8 Z" fill="#ff70a6" opacity=".85"/>' +
           '<path d="M 35 8 C 32 4, 29 8, 35 13 C 41 8, 38 4, 35 8 Z" fill="#ff70a6" opacity=".85"/>';
    } else if (blushStyle === 'anime_lines') {
      [-38, -35, -32].forEach(function(lx) { h += '<line x1="' + lx + '" y1="8" x2="' + (lx+3) + '" y2="14" stroke="#ff4d88" stroke-width="1.8" stroke-linecap="round"/>'; });
      [32, 35, 38].forEach(function(lx) { h += '<line x1="' + lx + '" y1="8" x2="' + (lx+3) + '" y2="14" stroke="#ff4d88" stroke-width="1.8" stroke-linecap="round"/>'; });
    } else if (blushStyle === 'none') {
      // none
    } else {
      // Default: Soft Rosy Airbrush Glow
      h += '<ellipse cx="-35" cy="11" rx="9.5" ry="5.5" fill="' + PK + '" opacity=".72"/>';
      h += '<ellipse cx="35" cy="11" rx="9.5" ry="5.5" fill="' + PK + '" opacity=".72"/>';
    }

    // Brows + Eyes + Mouth
    h += browsSvg + eyes + mouth;

    // Nose
    var noseStyle = o.nose || 'pink_triangle';
    if (noseStyle === 'button_black') {
      h += '<ellipse cx="0" cy="7.5" rx="5" ry="4" fill="' + INK + '"/><circle cx="-1.5" cy="6.2" r="1.2" fill="#fff"/>';
    } else if (noseStyle === 'heart_nose') {
      h += '<path d="M -5 5 C -6 2, 6 2, 5 5 C 4 8.5, -4 8.5, -5 5 Z" fill="' + PK_D + '"/>';
    } else if (noseStyle === 'tiny_dot') {
      h += '<circle cx="0" cy="7.5" r="3" fill="' + INK + '"/>';
    } else {
      // Default: Dainty Pink Cat Nose
      h += '<path d="M -4.5 5.5 Q 0 3.8 4.5 5.5 Q 2.2 10.5 0 10.5 Q -2.2 10.5 -4.5 5.5 Z" fill="' + PK_D + '"/>';
      h += '<ellipse cx="-1.3" cy="6.6" rx="1.4" ry=".9" fill="#fff" opacity=".85"/>';
    }

    /* whiskers */
    h += '<path d="M -45 9 L -63 5 M -46 15 L -64 17 M 45 9 L 63 5 M 46 15 L 64 17" stroke="' + LN_W + '" stroke-width="2" stroke-linecap="round"/>';
    return '<g transform="translate(0,-28)">' + h + '</g>';
  }
  function catEye(cx, teary, sparkle) {
    /* big glossy kawaii cat eye — dark cocoa with warm amber glow & twin catchlights */
    var dir = cx < 0 ? -1 : 1;
    return '<ellipse cx="' + cx + '" cy="0" rx="9.8" ry="10.8" fill="' + INK + '"/>' +
      '<ellipse cx="' + cx + '" cy="4.2" rx="6.6" ry="4.2" fill="' + OR_D + '" opacity=".55"/>' +
      '<path d="M ' + (cx - 10) + ' -2.5 Q ' + cx + ' -13.5 ' + (cx + 10) + ' -2.5" stroke="#221117" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M ' + (cx + dir * 8.5) + ' -4.5 l ' + (dir * 3.5) + ' -2.5" stroke="#221117" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx - 3.2) + '" cy="-3.6" rx="3.8" ry="4.2" fill="#fff"/>' +
      '<circle cx="' + (cx + 3.4) + '" cy="3.6" r="2" fill="#fff" opacity=".95"/>' +
      (sparkle ? '<path d="M ' + (cx + 3) + ' -5 l 1.2 2.4 2.4 1.2 -2.4 1.2 -1.2 2.4 -1.2 -2.4 -2.4 -1.2 2.4 -1.2 Z" fill="#fff"/>' : '') +
      (teary ? '<circle cx="' + (cx + dir * 6) + '" cy="9" r="3" fill="#7bdff2"/>' : '');
  }
  function moodOf() {
    var avg = (S.food + S.happy) / 2;
    if (avg < 25) return 'sad';
    if (avg > 72) return 'happy';
    return 'normal';
  }

  /* ---------------- dress catalogs ---------------- */
  var EYES = {
    manga_round:   { name: 'Manga Round (ตากลมโตมังงะแท้) 🐱', draw: function() { return ''; } },
    sparkle_anime: { name: 'Sparkle Anime (ตาวิ้งวับ) ✨', draw: function() { return ''; } },
    heart_eyes:    { name: 'Sweet Hearts (ตาหัวใจ) 💖', draw: function() { return ''; } },
    star_twinkle:  { name: 'Star Twinkle (ตาดาว) ⭐', draw: function() { return ''; } },
    happy_arcs:    { name: 'Happy Arcs (ตายิ้มฟิน) ᵔᵕᵔ', draw: function() { return ''; } },
    playful_wink:  { name: 'Playful Wink (ขยิบตา) 😉', draw: function() { return ''; } },
    sleepy_cozy:   { name: 'Sleepy Cozy (ตาปรือขี้เซา) 😌', draw: function() { return ''; } }
  };
  var BROWS = {
    ginger_dots:   { name: 'Ginger Dots (คิ้วจุดส้มแท้) • •', draw: function() { return ''; } },
    sweet_arcs:    { name: 'Sweet Arcs (คิ้วโค้งละมุน)', draw: function() { return ''; } },
    slant_worried: { name: 'Innocent Slant (คิ้วอ้อน)', draw: function() { return ''; } },
    bold_happy:    { name: 'Bold Happy (คิ้วซนร่าเริง)', draw: function() { return ''; } },
    none:          { name: 'No Brows (ธรรมชาติ)', draw: function() { return ''; } }
  };
  var NOSES = {
    pink_triangle: { name: 'Pink Triangle (จมูกชมพูจิ๋วแท้) 🌸', draw: function() { return ''; } },
    button_black:  { name: 'Button Black (จมูกกระดุมดำ)', draw: function() { return ''; } },
    heart_nose:    { name: 'Heart Nose (จมูกหัวใจหวาน)', draw: function() { return ''; } },
    tiny_dot:      { name: 'Tiny Dot (จมูกจุดจิ๋ว)', draw: function() { return ''; } }
  };
  var MOUTHS = {
    cat_smile:   { name: 'Cat Smile (:3 ปากเหมียวยิ้มแท้) 🐱', draw: function() { return ''; } },
    blep_tongue: { name: 'Cute Blep (แลบลิ้นจิ๋ว) 👅', draw: function() { return ''; } },
    happy_fang:  { name: 'Happy Fang (อ้าปากเขี้ยวจิ๋ว) 😄', draw: function() { return ''; } },
    sweet_line:  { name: 'Sweet Line (อมยิ้มน้อยๆ) 😊', draw: function() { return ''; } },
    tiny_o:      { name: 'Tiny \'o\' (ปากจิ๋วตกใจ) 😮', draw: function() { return ''; } }
  };
  var EARS = {
    ginger_kitty:    { name: 'Ginger Kitty (หูแมวส้มแท้) 🐱', draw: function() { return ''; } },
    folded_scottish: { name: 'Folded Scottish (หูพับสก็อตติช)', draw: function() { return ''; } },
    bunny_ears:      { name: 'Bunny Ears (หูกระต่ายยาว) 🐰', draw: function() { return ''; } },
    bear_round:      { name: 'Round Bear (หูกลมเท็ดดี้) 🧸', draw: function() { return ''; } }
  };
  var BLUSHES = {
    soft_pink:     { name: 'Soft Rosy (ชมพูละมุนแท้) 🌸', draw: function() { return ''; } },
    peachy_glow:   { name: 'Peachy Glow (ส้มพีชระเรื่อ) 🍑', draw: function() { return ''; } },
    kawaii_hearts: { name: 'Double Hearts (ลายหัวใจคู่) 💕', draw: function() { return ''; } },
    anime_lines:   { name: 'Anime Blushing (ขีดเขิน ///)', draw: function() { return ''; } },
    none:          { name: 'Natural (ธรรมชาติ)', draw: function() { return ''; } }
  };
  var EMOTIONS = {
    happy:   { name: 'Purring Happy (อารมณ์ดีกวนๆ) ✨', draw: function() { return ''; } },
    cozy:    { name: 'Cozy Warm (อุ่นสบายเคลิ้ม) 🥰', draw: function() { return ''; } },
    playful: { name: 'Playful Wag (ขี้เล่นกระดิกหาง) 🐾', draw: function() { return ''; } },
    curious: { name: 'Curious Cat (สงสัยตาแป๋ว) 🥺', draw: function() { return ''; } }
  };
  var HATS = {
    none: { name: 'None', draw: function () { return ''; } },
    bow: { name: 'Pink Bow', draw: function () {
      return '<g transform="translate(0,-72)"><path d="M0 0 C-10 -12 -24 -8 -20 4 C-18 12 -8 10 0 2 Z" fill="#ff9fbe" stroke="#e0446e" stroke-width="2"/><path d="M0 0 C10 -12 24 -8 20 4 C18 12 8 10 0 2 Z" fill="#ff9fbe" stroke="#e0446e" stroke-width="2"/><circle r="5.2" fill="#ff6b8d" stroke="#e0446e" stroke-width="2"/></g>'; } },
    fish: { name: 'Fish Hat', draw: function () {
      return '<g transform="translate(0,-76)"><ellipse rx="16" ry="10" fill="#7bdff2" stroke="#4f9ec2" stroke-width="2.2"/><path d="M13 0 l11 -7 v14 Z" fill="#7bdff2" stroke="#4f9ec2" stroke-width="2.2" stroke-linejoin="round"/><circle cx="-6" cy="-2" r="2.2" fill="#402832"/><circle cx="-6.6" cy="-2.6" r=".8" fill="#fff"/></g>'; } },
    crown: { name: 'King Crown', draw: function () {
      return '<g transform="translate(0,-78)"><path d="M-18 6 L-18 -9 L-9 -1 L0 -12 L9 -1 L18 -9 L18 6 Z" fill="#ffd166" stroke="#c9931a" stroke-width="2.2" stroke-linejoin="round"/><circle cx="0" cy="-1" r="2.6" fill="#e0446e"/><circle cx="-10" cy="1" r="2" fill="#7bdff2"/><circle cx="10" cy="1" r="2" fill="#7bdff2"/></g>'; } },
    flower: { name: 'Flower', draw: function () {
      return '<g transform="translate(18,-72)"><circle cx="0" cy="-8" r="5" fill="#fff" stroke="#f3c9d8" stroke-width="1.5"/><circle cx="7.6" cy="-2.5" r="5" fill="#fff" stroke="#f3c9d8" stroke-width="1.5"/><circle cx="4.7" cy="6.5" r="5" fill="#fff" stroke="#f3c9d8" stroke-width="1.5"/><circle cx="-4.7" cy="6.5" r="5" fill="#fff" stroke="#f3c9d8" stroke-width="1.5"/><circle cx="-7.6" cy="-2.5" r="5" fill="#fff" stroke="#f3c9d8" stroke-width="1.5"/><circle r="4.4" fill="#ffd166"/></g>'; } },
    beanie: { name: 'Winter Beanie', draw: function () {
      return '<g transform="translate(0,-70)"><path d="M-30 4 Q0 -32 30 4 Z" fill="#7da7d9" stroke="#567bb0" stroke-width="2.4"/><rect x="-32" y="1" width="64" height="10" rx="5" fill="#eef5fc" stroke="#567bb0" stroke-width="2.2"/><circle cy="-24" r="7" fill="#eef5fc" stroke="#567bb0" stroke-width="2"/></g>'; } },
    party: { name: 'Party Hat', draw: function () {
      return '<g transform="translate(0,-74)"><path d="M-14 4 L0 -26 L14 4 Z" fill="#b28dff" stroke="#845ec2" stroke-width="2.2" stroke-linejoin="round"/><circle cy="-28" r="4.5" fill="#ffd166" stroke="#e0a92e" stroke-width="1.5"/><circle cx="-3" cy="-6" r="2" fill="#ffd166"/><circle cx="4" cy="-2" r="2" fill="#ff9fbe"/></g>'; } }
  };
  var COLLARS = {
    none: { name: 'None', draw: function () { return ''; } },
    bell: { name: 'Bell Collar', draw: function () {
      return '<path d="M-27 6 Q0 18 27 6" stroke="#e0446e" stroke-width="6.5" fill="none" stroke-linecap="round"/><circle cx="0" cy="14" r="6" fill="#ffd166" stroke="#c9931a" stroke-width="1.8"/><path d="M-2.5 15.5 h5" stroke="#9e6d0b" stroke-width="1.5"/>'; } },
    heart: { name: 'Heart Collar', draw: function () {
      return '<path d="M-27 6 Q0 18 27 6" stroke="#ff85ad" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="M0 12 C-4 7 -10 9 -9 14 C-8 17 -4 20 0 23 C4 20 8 17 9 14 C10 9 4 7 0 12 Z" fill="#e0446e" stroke="#fff" stroke-width="1.2"/>'; } },
    bandana: { name: 'Bandana', draw: function () {
      return '<path d="M-27 5 Q0 14 27 5 L15 24 Q0 30 -15 24 Z" fill="#8ce99a" stroke="#4a9e65" stroke-width="2.2" stroke-linejoin="round"/><circle cx="-5" cy="14" r="2" fill="#fff"/><circle cx="6" cy="16" r="2" fill="#fff"/><circle cx="0" cy="21" r="2" fill="#fff"/>'; } },
    pearl: { name: 'Pearls', draw: function () {
      var d = ''; for (var i = -3; i <= 3; i++) d += '<circle cx="' + (i * 7.6) + '" cy="' + (12 - Math.abs(i) * 1.3) + '" r="3.8" fill="#fff" stroke="#dfc7b0" stroke-width="1.4"/>';
      return d; } }
  };
  var CLOTHES = {
    none: { name: 'None', draw: function () { return ''; } },
    scarf: { name: 'Cozy Scarf', draw: function () {
      return '<path d="M-30 6 Q0 20 30 6 L28 19 Q0 31 -28 19 Z" fill="#ff9fbe" stroke="#d95b84" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 18 L22 42 L9 40 Z" fill="#ff85ad" stroke="#d95b84" stroke-width="2" stroke-linejoin="round"/>'; } },
    vest: { name: 'Denim Vest', draw: function () {
      return '<path d="M-32 8 Q0 20 32 8 L40 54 Q22 62 12 52 L8 18 L-8 18 L-12 52 Q-22 62 -40 54 Z" fill="#7da7d9" stroke="#5378a8" stroke-width="2.4" stroke-linejoin="round"/><circle cx="-13" cy="28" r="2.4" fill="#ffd166"/><circle cx="-14" cy="40" r="2.4" fill="#ffd166"/>'; } },
    sweater: { name: 'Tiny Sweater', draw: function () {
      return '<path d="M-32 8 Q0 20 32 8 L40 54 Q0 66 -40 54 Z" fill="#ffd166" stroke="#d99b1e" stroke-width="2.4" stroke-linejoin="round"/><path d="M-26 26 Q0 34 26 26 M-30 38 Q0 46 30 38" stroke="#fff6ee" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'; } },
    cape: { name: 'Hero Cape', draw: function () {
      return '<path d="M-28 8 L-48 58 Q-36 66 -28 56 Z M28 8 L48 58 Q36 66 28 56 Z" fill="#e03131" stroke="#a61e1e" stroke-width="2.2" stroke-linejoin="round"/><path d="M-26 6 Q0 16 26 6" stroke="#ffd166" stroke-width="5" fill="none" stroke-linecap="round"/>'; } },
    tutu: { name: 'Pink Tutu', draw: function () {
      return '<path d="M-36 46 Q0 36 36 46 C46 56 36 64 24 58 C16 66 4 64 0 58 C-4 64 -16 66 -24 58 C-36 64 -46 56 -36 46 Z" fill="#ffd7e5" stroke="#ff85ad" stroke-width="2.2" stroke-linejoin="round"/>'; } }
  };
  var DRESS_CATS = [
    { key: 'hat', name: '👑 Hat' },
    { key: 'collar', name: '📿 Collar' },
    { key: 'cloth', name: '👕 Clothes' }
  ];
  var DRESS_MAP = { hat: HATS, collar: COLLARS, cloth: CLOTHES };

  /* ---------------- foods ---------------- */
  var FOODS = [
    { id: 'salmon', e: '🐟', name: 'Salmon',   food: 26, happy: 14, tip: 'Puffy\'s favorite!' },
    { id: 'chicken',e: '🍗', name: 'Chicken',  food: 22, happy: 10 },
    { id: 'tuna',   e: '🍣', name: 'Tuna Roll',food: 20, happy: 12 },
    { id: 'shrimp', e: '🍤', name: 'Shrimp',   food: 18, happy: 10 },
    { id: 'milk',   e: '🥛', name: 'Warm Milk',food: 14, happy: 12 },
    { id: 'cookie', e: '🍪', name: 'Cookie',   food: 10, happy: 8 },
    { id: 'cake',   e: '🍰', name: 'Cake',     food: 16, happy: 16 },
    { id: 'veggie', e: '🥬', name: 'Veggies',  food: 12, happy: 4 }
  ];

  /* ---------------- walk places (SCENE_LIB) ---------------- */
  var PLACES = [
    { key: 'n_meadow2',  e: '🌼', name: 'Meadow' },
    { key: 'n_sakura',   e: '🌸', name: 'Sakura Park' },
    { key: 'n_beach_sunset', e: '🏖️', name: 'Sunset Beach' },
    { key: 'c_paris_night', e: '🗼', name: 'Paris Night' },
    { key: 'n_snowmt',   e: '🏔️', name: 'Snow Mountain' },
    { key: 'x_candy',    e: '🍬', name: 'Candy Land' }
  ];
  var walkX = 0, walkDir = 1, walkOn = false, walkRaf = 0;

  /* ---------------- tick (needs decay) ---------------- */
  function tick() {
    var now = Date.now();
    var mins = (now - (S.lastTick || now)) / 60000;
    if (mins >= 1) {
      S.food = Math.max(0, S.food - mins * 0.7);
      S.happy = Math.max(0, S.happy - mins * 0.5);
      S.clean = Math.max(0, S.clean - mins * 0.25);
      S.lastTick = now;
      /* day counter */
      var day = Math.floor((now - S.born) / 86400000);
      if (day > S.days) { S.days = day; S.coins += 5; say('🐾 It\'s a new day with Puffy! +5 treats'); }
      save();
    }
  }
  setInterval(tick, 30000);
  setInterval(function () { if (!walkOn) renderHome(); }, 5000); /* idle refresh mood */

  function say(t) { $('say').textContent = t; }
  function log(t) { $('log').textContent = t; }

  /* ---------------- HOME ---------------- */
  var scratch = 0, scratchT = null;
  var homeBg = '<rect x="-100" y="-110" width="200" height="205" fill="#fff6eb"/>' +
    '<circle cx="-55" cy="-65" r="24" fill="#ffe8cf" opacity=".6"/><circle cx="62" cy="-50" r="18" fill="#ffe8cf" opacity=".6"/>' +
    '<rect x="-100" y="42" width="200" height="55" fill="#f7dec4"/>' +
    '<ellipse cx="0" cy="68" rx="68" ry="20" fill="#ffd9e6" stroke="#ffadc7" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="68" rx="52" ry="14" fill="#ffecf2"/>';
  function renderHome() {
    tick();
    var mood = moodOf();
    if (!feedAnim) {
      $('petBox').innerHTML = puffySVG({ mood: mood, petting: petting, bg: homeBg, viewBox: '-95 -105 190 195' });
    }
    $('stAge').textContent = S.days;
    $('stLove').textContent = S.love;
    $('stCoin').textContent = S.coins;
    $('bFood').style.width = Math.round(S.food) + '%';
    if ($('bFoodFeed')) $('bFoodFeed').style.width = Math.round(S.food) + '%';
    $('bHappy').style.width = Math.round(S.happy) + '%';
    $('bClean').style.width = Math.round(S.clean) + '%';
    if (!petting && !feedAnim) {
      if (mood === 'sad') say('Meow… 🥺 (Puffy needs attention!)');
      else if (mood === 'happy') say('Purrr~ 💕 Puffy loves you!');
    }
  }

  $('actPet').addEventListener('click', doScratch);
  $('petBox').addEventListener('pointerdown', doScratch);
  function doScratch() {
    tick();
    scratch++;
    S.happy = Math.min(100, S.happy + 3);
    S.love += 1;
    petting = true;
    clearTimeout(scratchT);
    scratchT = setTimeout(function () { petting = false; renderHome(); }, 950);
    var msgs = ['Purrrr~ 🧡', '*happy tail wag*', 'Puffy closes her eyes… 😽', 'Mrrrp! 💕', '*headbutts your hand*'];
    say(msgs[scratch % msgs.length]);
    if (scratch % 10 === 0) { S.coins += 1; log('Puffy is so happy! +1 🍪 treat'); }
    save(); renderHome();
  }
  $('actGroom').addEventListener('click', function () {
    tick();
    S.clean = Math.min(100, S.clean + 30);
    S.happy = Math.min(100, S.happy + 6);
    say('🛁 Bubbles! So fluffy now~');
    save(); renderHome();
  });
  $('actSnap').addEventListener('click', function () { snapPhoto('Home'); });

  function snapPhoto(where, bgSvg) {
    var bg = bgSvg || homeBg;
    var photo = '<g>' + bg + '<g transform="translate(0,6) scale(.92)">' + puffySVG({}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g></g>';
    S.album.unshift({ svg: photo, where: where, t: Date.now() });
    if (S.album.length > 24) S.album.pop();
    save();
    say('📸 Photo saved to album!');
    renderAlbum();
  }

  /* ---------------- FEED (with 60fps animated food & chomping!) ---------------- */
  var pickFood = 'salmon';
  var feedAnim = null, feedRaf = 0;

  function foodSVG(id) {
    switch (id) {
      case 'salmon':
        return '<g>' +
          '<path d="M-22 2 C-20 -12, 10 -14, 22 -2 C24 8, 8 12, -20 10 Z" fill="#ff7b6b" stroke="#b83b2b" stroke-width="2.2" stroke-linejoin="round"/>' +
          '<path d="M-19 5 C-4 10, 12 8, 21 0 L20 6 C10 13, -6 14, -18 9 Z" fill="#ffd2c9"/>' +
          '<path d="M-10 -6 Q-4 0 -8 7 M0 -7 Q6 -1 2 7 M10 -5 Q15 0 12 6" stroke="#fff5f2" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-8" cy="-4" r="2" fill="#fff" opacity=".8"/>' +
          '</g>';
      case 'chicken':
        return '<g>' +
          '<path d="M8 -2 L22 -8 C25 -10 27 -6 24 -3 C27 -1 25 3 21 1 L8 5 Z" fill="#fffaf3" stroke="#9c6b43" stroke-width="2"/>' +
          '<path d="M-22 2 C-24 -12, -4 -16, 10 -4 C16 2, 12 12, -4 12 C-16 12, -21 8, -22 2 Z" fill="#e68a38" stroke="#8c4814" stroke-width="2.2"/>' +
          '<ellipse cx="-7" cy="-4" rx="7" ry="3.2" fill="#ffba6b" opacity=".75"/>' +
          '</g>';
      case 'tuna':
        return '<g>' +
          '<ellipse cx="0" cy="4" rx="20" ry="10" fill="#2b3330" stroke="#171c1a" stroke-width="2"/>' +
          '<ellipse cx="0" cy="-2" rx="20" ry="10" fill="#fffaf5" stroke="#2b3330" stroke-width="2"/>' +
          '<ellipse cx="0" cy="-2" rx="10" ry="5.2" fill="#e63956"/>' +
          '<ellipse cx="-3" cy="-3.5" rx="3" ry="1.4" fill="#ff9ebb" opacity=".85"/>' +
          '</g>';
      case 'shrimp':
        return '<g>' +
          '<path d="M12 -4 L23 -11 L20 -1 L25 3 L13 3 Z" fill="#ff7352" stroke="#b5381a" stroke-width="1.8" stroke-linejoin="round"/>' +
          '<path d="M-20 4 C-22 -10, 2 -14, 15 -2 C17 5, 4 12, -16 10 Z" fill="#ffc054" stroke="#b37114" stroke-width="2.2"/>' +
          '<circle cx="-8" cy="-3" r="2" fill="#ffe6b3"/><circle cx="0" cy="-2" r="2" fill="#ffe6b3"/><circle cx="6" cy="1" r="1.8" fill="#ffe6b3"/>' +
          '</g>';
      case 'milk':
        return '<g>' +
          '<ellipse cx="0" cy="3" rx="21" ry="9" fill="#bfe8f7" stroke="#5b9bd5" stroke-width="2.2"/>' +
          '<ellipse cx="0" cy="1" rx="17" ry="6.5" fill="#fffdf9"/>' +
          '<ellipse cx="-5" cy="0" rx="5" ry="2" fill="#fff"/>' +
          '</g>';
      case 'cookie':
        return '<g>' +
          '<ellipse cx="0" cy="1" rx="19" ry="12" fill="#e39d52" stroke="#8a5219" stroke-width="2.2"/>' +
          '<circle cx="-8" cy="-2" r="2.6" fill="#4a2810"/><circle cx="4" cy="-4" r="2.8" fill="#4a2810"/>' +
          '<circle cx="-1" cy="4" r="2.5" fill="#4a2810"/><circle cx="9" cy="3" r="2.3" fill="#4a2810"/>' +
          '<circle cx="-10" cy="4" r="1.8" fill="#4a2810"/>' +
          '</g>';
      case 'cake':
        return '<g>' +
          '<path d="M-18 8 L-14 -6 L16 -2 L18 10 Z" fill="#ffe4b5" stroke="#b56b38" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="M-16 2 L17 4" stroke="#ff7597" stroke-width="3"/>' +
          '<path d="M-15 -6 Q0 -14 16 -2 Q6 2 -15 -6 Z" fill="#fffdf9" stroke="#b56b38" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="M-2 -15 C-7 -15 -8 -7 0 -5 C8 -7 7 -15 2 -15 Z" fill="#ff3b6b" stroke="#9e193a" stroke-width="1.6"/>' +
          '</g>';
      default:
        return '<g>' +
          '<path d="M-8 8 C-18 4, -20 -8, -10 -12 C-4 -14, 0 -6, 0 6 Z" fill="#69db7c" stroke="#2b8a3e" stroke-width="2"/>' +
          '<path d="M8 8 C18 4, 20 -8, 10 -12 C4 -14, 0 -6, 0 6 Z" fill="#51cf66" stroke="#2b8a3e" stroke-width="2"/>' +
          '<path d="M-7 4 C-9 11, 9 11, 7 4 L4 -3 L-4 -3 Z" fill="#d8f5a2" stroke="#2b8a3e" stroke-width="2" stroke-linejoin="round"/>' +
          '</g>';
    }
  }

  function catBowlSVG(foodHtml, cleanSparkle) {
    return '<g transform="translate(0, 74)">' +
      /* bowl shadow */
      '<ellipse cx="0" cy="11" rx="38" ry="7" fill="rgba(110,55,20,.16)"/>' +
      /* bowl rim back */
      '<ellipse cx="0" cy="-2" rx="29" ry="8.5" fill="#fff0f5" stroke="#d95b84" stroke-width="2.4"/>' +
      '<ellipse cx="0" cy="-1" rx="24" ry="6" fill="#f7cad8"/>' +
      /* food inside bowl */
      (foodHtml || '') +
      /* front trapezoid wall of cat bowl */
      '<path d="M-29 -2 L-34 9 C-22 16, 22 16, 34 9 L29 -2 C16 5, -16 5, -29 -2 Z" fill="#ff8fab" stroke="#d95b84" stroke-width="2.4" stroke-linejoin="round"/>' +
      /* cute heart emblem on bowl front */
      '<path d="M0 4 C-2.5 1, -6 2.5, -5 6 C-4 8.5, 0 10.5, 0 11.5 C0 10.5, 4 8.5, 5 6 C6 2.5, 2.5 1, 0 4 Z" fill="#fff" opacity=".9"/>' +
      (cleanSparkle ? '<path d="M18 -10 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#ffd166"/>' : '') +
      '</g>';
  }

  function renderFeedStage() {
    var box = $('feedBox');
    if (!box) return;
    if (!feedAnim) {
      /* Idle preview on Feeding tab: Puffy eyeing the selected dish in her bowl! */
      var floatY = -5;
      var foodInBowl = '<g transform="translate(0,' + floatY + ') scale(0.95)">' + foodSVG(pickFood) + '</g>';
      var extra = catBowlSVG(foodInBowl, false);
      box.innerHTML = puffySVG({ mood: 'happy', bg: homeBg, extra: extra, viewBox: '-95 -105 190 198' });
      return;
    }
    var a = feedAnim;
    var t = a.t;
    var headBobY = 0, chomp = false, isPet = false, lick = false;
    var foodHtml = '', cleanSparkle = false, fx = '';

    if (t < 22) {
      /* Phase 1: Food drops in from top into bowl with landing squash */
      var p = t / 22;
      var ease = 1 - Math.pow(1 - p, 2.4);
      var dropY = -115 * (1 - ease) - 4;
      var sq = p > 0.82 ? Math.sin(((p - 0.82) / 0.18) * Math.PI) * 0.18 : 0;
      foodHtml = '<g transform="translate(0,' + dropY.toFixed(1) + ') scale(' + (1 + sq).toFixed(2) + ',' + (1 - sq * 0.8).toFixed(2) + ')">' + foodSVG(a.food.id) + '</g>';
      headBobY = p * 6;
    } else if (t < 82) {
      /* Phase 2: 3 hearty chomps! Head dips down into bowl, mouth opens, food shrinks bite-by-bite */
      var ct = t - 22; /* 0..60 (3 cycles of 20 frames) */
      var biteIdx = Math.floor(ct / 20); /* 0, 1, 2 */
      var phase = (ct % 20) / 20;        /* 0..1 within each bite */
      var dip = Math.sin(phase * Math.PI);
      headBobY = 6 + dip * 24;           /* leans down 30px to reach bowl! */
      chomp = phase > 0.18 && phase < 0.68;
      var remScale = [1.0, 0.72, 0.42][biteIdx] || 0.25;
      if (phase > 0.55) remScale *= 0.78;
      var wobble = Math.sin(ct * 0.8) * 6;
      foodHtml = '<g transform="translate(0,-3) rotate(' + wobble.toFixed(1) + ') scale(' + remScale.toFixed(2) + ')">' + foodSVG(a.food.id) + '</g>';
      /* Pop text on each bite */
      var words = ['NOM!', 'CHOMP! 🧡', 'YUM~ ✨'];
      var wy = -46 - phase * 16;
      var wx = biteIdx === 1 ? 48 : -48;
      fx += '<text x="' + wx + '" y="' + wy.toFixed(1) + '" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="13" fill="#d6336c" stroke="#fff" stroke-width="3" paint-order="stroke">' + words[biteIdx] + '</text>';
    } else {
      /* Phase 3: Bowl licked clean! Blissful purr + licking cheek + floating hearts */
      var ft = (t - 82) / 30;
      isPet = true;
      lick = (t % 14) < 8;
      headBobY = Math.sin(ft * Math.PI) * -4;
      cleanSparkle = true;
      var hy = -48 - ft * 28;
      fx += '<text x="0" y="' + hy.toFixed(1) + '" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="15" fill="#e8590c" stroke="#fff" stroke-width="3.5" paint-order="stroke">+' + a.food.food + ' 🍽  +' + a.food.happy + ' 💕</text>';
      fx += '<text x="-52" y="' + (-36 - ft * 22).toFixed(1) + '" font-size="18">💕</text>';
      fx += '<text x="46" y="' + (-42 - ft * 26).toFixed(1) + '" font-size="17">🧡</text>';
    }

    /* Flying food crumbs */
    a.crumbs.forEach(function (c) {
      fx += '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + c.r.toFixed(1) + '" fill="' + c.c + '" opacity="' + Math.max(0, c.life / 22).toFixed(2) + '"/>';
    });

    var extra = catBowlSVG(foodHtml, cleanSparkle) + fx;
    var svg = puffySVG({
      mood: 'happy',
      petting: isPet,
      chomp: chomp,
      lick: lick,
      headBobY: headBobY,
      bg: homeBg,
      extra: extra,
      viewBox: '-95 -105 190 198'
    });
    box.innerHTML = svg;
    if ($('petBox')) $('petBox').innerHTML = svg;
  }

  function stepFeedAnim() {
    if (!feedAnim) return;
    feedAnim.t++;
    /* Spawn crumbs on each chomp impact */
    if (feedAnim.t === 32 || feedAnim.t === 52 || feedAnim.t === 72) {
      var cols = ['#ff9f5c', '#ffd166', '#ff7597', '#fffaf3'];
      for (var i = 0; i < 7; i++) {
        feedAnim.crumbs.push({
          x: (Math.random() - 0.5) * 26,
          y: 66 + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 4.2,
          vy: -Math.random() * 3.8 - 1.2,
          r: 2 + Math.random() * 2.2,
          c: cols[i % cols.length],
          life: 22
        });
      }
    }
    feedAnim.crumbs = feedAnim.crumbs.filter(function (c) {
      c.x += c.vx; c.y += c.vy; c.vy += 0.25; c.life--;
      return c.life > 0;
    });
    renderFeedStage();
    if (feedAnim.t >= 112) {
      feedAnim = null;
      feedRaf = 0;
      renderFeedStage();
      renderHome();
      return;
    }
    feedRaf = requestAnimationFrame(stepFeedAnim);
  }

  function renderFood() {
    var g = $('foodGrid');
    g.innerHTML = '';
    FOODS.forEach(function (f) {
      var d = document.createElement('div');
      d.className = 'it' + (pickFood === f.id ? ' on' : '');
      var fav = f.id === S.favFood;
      d.innerHTML = '<svg viewBox="-30 -22 60 40" style="width:56px;height:38px;display:block;margin:0 auto 2px">' + foodSVG(f.id) + '</svg>' +
        '<span>' + f.name + (fav ? ' 💛' : '') + '</span>' +
        '<small>+' + f.food + ' 🍽 +' + f.happy + ' 💕</small>';
      d.addEventListener('click', function () {
        if (pickFood === f.id) {
          doFeed();
        } else {
          pickFood = f.id;
          renderFood();
          renderFeedStage();
        }
      });
      g.appendChild(d);
    });
    renderFeedStage();
  }

  function doFeed() {
    tick();
    var f = FOODS.filter(function (x) { return x.id === pickFood; })[0] || FOODS[0];
    var wasFull = S.food >= 99;
    S.food = Math.min(100, S.food + f.food);
    S.happy = Math.min(100, S.happy + f.happy);
    var fav = f.id === S.favFood;
    if (fav) { S.love += 3; $('feedLog').textContent = '💛 Favorite ' + f.name + '! Nom nom nom~ (+3 love)'; }
    else if (wasFull) { S.love += 1; $('feedLog').textContent = f.e + ' Bonus snack! Puffy happily munches the ' + f.name + '~'; }
    else $('feedLog').textContent = f.e + ' Yum! Puffy gobbled up the ' + f.name + '~';
    say(fav ? 'NYAM NYAM! 🧡' : 'Yummy ' + f.name + '! 😺');
    save();
    $('bFood').style.width = Math.round(S.food) + '%';
    if ($('bFoodFeed')) $('bFoodFeed').style.width = Math.round(S.food) + '%';
    $('bHappy').style.width = Math.round(S.happy) + '%';
    $('stLove').textContent = S.love;
    if (feedRaf) cancelAnimationFrame(feedRaf);
    feedAnim = { food: f, t: 0, crumbs: [] };
    feedRaf = requestAnimationFrame(stepFeedAnim);
  }
  $('feedBtn').addEventListener('click', doFeed);
  if ($('feedBox')) $('feedBox').addEventListener('click', doFeed);

  /* ---------------- DRESS ---------------- */
  var dressCat = 'hat';
  function renderDress() {
    $('petBox2').innerHTML = puffySVG({ bg: homeBg, viewBox: '-95 -105 190 195' });
    renderSavedLooksUI();
    var cr = $('dressCats');
    cr.innerHTML = '';
    DRESS_CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'place' + (dressCat === c.key ? ' on' : '');
      b.textContent = c.name;
      b.addEventListener('click', function () { dressCat = c.key; renderDress(); });
      cr.appendChild(b);
    });
    var g = $('dressGrid');
    g.innerHTML = '';
    var cat = DRESS_MAP[dressCat];
    Object.keys(cat).forEach(function (k) {
      var it = cat[k];
      var d = document.createElement('div');
      d.className = 'it' + (S.outfit[dressCat] === k ? ' on' : '');
      /* preview: mini puffy with only that item */
      var keep = S.outfit[dressCat];
      S.outfit[dressCat] = k;
      d.innerHTML = puffySVG({ w: 90, viewBox: '-95 -105 190 195' }).replace(/^<svg[^>]*>/, '<svg viewBox="-95 -105 190 195">');
      S.outfit[dressCat] = keep;
      d.innerHTML += '<span>' + it.name + '</span>';
      d.addEventListener('click', function () {
        S.outfit[dressCat] = k;
        S.happy = Math.min(100, S.happy + 2);
        save(); renderDress(); renderHome();
        say('How do I look? 😺✨');
      });
      g.appendChild(d);
    });
  }
  $('btnSaveLook')?.addEventListener('click', saveCurrentLook);
  $('btnResetCute')?.addEventListener('click', resetToDefaultCute);
  $('actFace')?.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { if (t.textContent.includes('Dress') || t.textContent.includes('แต่งตัว')) t.click(); });
    dressCat = 'eyes';
    renderDress();
  });
  $('dressClear')?.addEventListener('click', resetToDefaultCute);
  $('dressRandom')?.addEventListener('click', function () {
    function pick(obj) { var keys = Object.keys(obj); return keys[Math.floor(Math.random() * keys.length)]; }
    S.outfit = {
      eyes: pick(EYES),
      brows: pick(BROWS),
      nose: pick(NOSES),
      mouth: pick(MOUTHS),
      ears: pick(EARS),
      blush: pick(BLUSHES),
      emotion: pick(EMOTIONS),
      hat: pick(HATS),
      collar: pick(COLLARS),
      cloth: pick(CLOTHES)
    };
    save(); renderDress(); renderHome(); say('Brand new cute face! 🧡');
  });

  /* ---------------- WALK ---------------- */
  var place = PLACES[0];
  function renderPlaces() {
    var row = $('placeRow');
    row.innerHTML = '';
    PLACES.forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'place' + (place.key === p.key ? ' on' : '');
      b.textContent = p.e + ' ' + p.name;
      b.addEventListener('click', function () { place = p; renderPlaces(); drawWalk(); say('Off to ' + p.name + '! ' + p.e); });
      row.appendChild(b);
    });
  }
  function drawWalk(moving) {
    var sc = (window.SCENE_LIB[place.key] || window.SCENE_LIB['n_meadow2']).bg();
    var scale = 1.9;
    var px = 120 + walkX;
    var hop = moving ? Math.abs(Math.sin(walkX * 0.14)) * 5 : 0;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">';
    s += '<g transform="translate(' + (200 - 120 * scale) + ',' + (240 - 340 * scale - 8) + ') scale(' + scale + ')">' + sc + '</g>';
    s += '<ellipse cx="' + px + '" cy="206" rx="' + (34 - hop * 0.8) + '" ry="7.5" fill="rgba(60,40,30,.18)"/>';
    s += '<g transform="translate(' + px + ',' + (148 - hop) + ') scale(' + (walkDir < 0 ? -0.78 : 0.78) + ',0.78)">' + puffySVG({ pose: moving ? 'walk' : 'sit', step: walkX * 0.22, noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>';
    if (moving) s += '<text x="' + (px - walkDir * 44) + '" y="196" font-size="16">🐾</text>';
    s += '</svg>';
    $('walkBox').innerHTML = s;
  }
  function walkStep() {
    if (!walkOn) return;
    walkX += walkDir * 2.2;
    if (walkX > 210) walkDir = -1;
    if (walkX < 0) walkDir = 1;
    drawWalk(true);
    if (Math.random() < 0.012) {
      S.happy = Math.min(100, S.happy + 2);
      S.love += 1; S.coins += 1;
      var finds = ['Puffy found a shiny leaf! +1 🍪', 'Puffy chases a butterfly 🦋 +1 love', 'Puffy rolls in the grass~ 💕', 'Puffy says hi to a pigeon 🐦'];
      $('walkLog').textContent = finds[Math.floor(Math.random() * finds.length)];
      save();
    }
    walkRaf = requestAnimationFrame(walkStep);
  }
  $('wLeft').addEventListener('pointerdown', function () { walkDir = -1; if (!walkOn) { walkOn = true; walkStep(); } });
  $('wRight').addEventListener('pointerdown', function () { walkDir = 1; if (!walkOn) { walkOn = true; walkStep(); } });
  ['pointerup', 'pointerleave'].forEach(function (ev) {
    $('wLeft').addEventListener(ev, stopWalk);
    $('wRight').addEventListener(ev, stopWalk);
  });
  function stopWalk() {
    walkOn = false;
    if (walkRaf) cancelAnimationFrame(walkRaf);
    drawWalk(false);
  }
  $('wPlay').addEventListener('click', function () {
    S.happy = Math.min(100, S.happy + 8);
    S.love += 2; S.coins += 2;
    $('walkLog').textContent = '🎾 Puffy leaps for the ball! So athletic! (+2 🍪)';
    say('Yay! Fetch! 🎾');
    save(); renderHome();
  });
  /* snap walk photo */
  var snapWalk = document.createElement('button');
  snapWalk.className = 'abtn alt';
  snapWalk.textContent = '📸 Snap walkie';
  snapWalk.addEventListener('click', function () {
    var sc = (window.SCENE_LIB[place.key] || window.SCENE_LIB['n_meadow2']).bg();
    snapPhoto(place.name, '<g transform="translate(-95,-105) scale(1.05)">' + sc + '</g>');
  });
  $('pWalk').querySelector('.walkctl').appendChild(snapWalk);

  /* ---------------- ALBUM ---------------- */
  function renderAlbum() {
    var a = $('album');
    a.innerHTML = '';
    if (!S.album.length) { a.innerHTML = '<p class="hint" style="grid-column:1/-1">No photos yet — snap one at Home or on Walkies! 📸</p>'; return; }
    S.album.forEach(function (p, i) {
      var d = document.createElement('div');
      d.className = 'ph';
      d.innerHTML = '<svg viewBox="-95 -105 190 195">' + p.svg + '</svg>' +
        '<div class="pm"><span>' + p.where + '</span><button data-i="' + i + '" style="border:none;background:none;cursor:pointer;font-size:.95rem">🗑</button></div>';
      a.appendChild(d);
    });
    a.querySelectorAll('button[data-i]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.album.splice(+b.getAttribute('data-i'), 1);
        save(); renderAlbum();
      });
    });
  }

  /* ---------------- tabs ---------------- */
  var TABS = [['tabHome', 'pHome'], ['tabFeed', 'pFeed'], ['tabDress', 'pDress'], ['tabWalk', 'pWalk'], ['tabPhotos', 'pPhotos']];
  TABS.forEach(function (t) {
    $(t[0]).addEventListener('click', function () {
      TABS.forEach(function (x) { $(x[0]).classList.remove('on'); $(x[1]).classList.remove('on'); });
      $(t[0]).classList.add('on'); $(t[1]).classList.add('on');
      if (t[1] === 'pWalk') drawWalk(false);
    });
  });

  /* ---------------- boot ---------------- */
  renderHome(); renderFood(); renderDress(); renderPlaces(); drawWalk(false); renderAlbum();
  if (window.GameStats) GameStats.record('puffy', { score: S.love, loves: S.love, day: S.days });
})();
