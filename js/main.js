
/* =====================
   공통: 화면 전환
===================== */
function goTo(screenName) {
  const target = document.querySelector(`.screen.${screenName}`);

  if (!target) {
    console.warn("존재하지 않는 페이지:", screenName);
    return;
  }

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  target.classList.add("active");
  // resizeScreen();

  if (screenName === "page2") startTypingPage2();
}


/* =====================
   DOMContentLoaded
===================== */
document.addEventListener("DOMContentLoaded", () => {

  const appState = {
    userName: ''
  };

  /* =====================
        START 버튼
  ===================== */
  document.addEventListener("click", (e) => {
    const startWrap = e.target.closest(".start-wrap");
    if (!startWrap) return;

    clearFaceStateForNewSession();
    goTo("loading");

    setTimeout(() => {
      goTo("page2");
    }, 3000);
  });


  /* =====================
        이름 입력 (page2)
  ===================== */
   const nameInput = document.querySelector('.name-input');
  const nameArea = document.querySelector('.name-area');
  const nextBtn = document.querySelector('.next-btn');

  if (nameInput && nameArea && nextBtn) {

    nameInput.addEventListener('focus', () => {
      nameArea.style.transform = 'translate(-50%, -180px)';
    });

    nameInput.addEventListener('blur', () => {
      nameArea.style.transform = 'translateX(-50%)';
    });

    nameInput.addEventListener('input', () => {
      const value = nameInput.value.trim();
      appState.userName = value;

      if (value.length > 0) nextBtn.classList.remove('disabled');
      else nextBtn.classList.add('disabled');
    });

    nextBtn.addEventListener('click', () => {
      if (nextBtn.classList.contains('disabled')) return;

      localStorage.setItem("userName", appState.userName);

      const nameEl = document.getElementById("userName");
      if (nameEl) nameEl.textContent = appState.userName;

      const dateEl = document.getElementById("todayDate");
      if (dateEl) {
        const today = new Date();
        dateEl.textContent =
          `DATE : ${today.getMonth() + 1} / ${today.getDate()} / ${today.getFullYear()}`;
      }

      goTo("page3");
    });
  }

});


 /* =====================
   PAGE3 → PAGE4 이동
===================== */
const p3NextBtn = document.querySelector(".p3-next-btn");

if (p3NextBtn) {
  p3NextBtn.addEventListener("click", () => {
    goTo("page4");

    // 렌더 완료 후 실행
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enterPage4();
      });
    });
  });
}


/* =====================
    타이핑
===================== */
function typeText({ text, target, speed = 40, callback }) {
  let i = 0;
  if (!target) return;

  target.textContent = "";
  const timer = setInterval(() => {
    target.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
}


/* =====================
      PAGE2 타이핑
===================== */
function startTypingPage2() {

  const lines = [
    { el: document.getElementById("t1"), text: "멍멍!", emoji: ["e1", "e2"] },
    { el: document.getElementById("t2"), text: "‘오오티디 다이어리’에 온 걸 환영해!" },
    { el: document.getElementById("t3"), text: "우리 주인…" },
    { el: document.getElementById("t4"), text: "패션 센스가 좀 부족하댕", emoji: ["e3"] },
    { el: document.getElementById("t5"), text: "그래서 내가 좀 도와주려고 해" },
    { el: document.getElementById("t6"), text: "주인에게 전해줄 수 있도록" },
    { el: document.getElementById("t7"), text: "너희의 멋진 스타일을" },
    { el: document.getElementById("t8"), text: "이 다이어리에 기록해줘!", emoji: ["e4"] },
    { el: document.getElementById("t9"), text: "자, 그럼 먼저 이름을 알려줘!" }
  ];

  let index = 0;

  function nextLine() {
    if (index >= lines.length) return;

    const { el, text, emoji } = lines[index];
    if (!el) { index++; nextLine(); return; }

    typeText({
      text,
      target: el,
      callback: () => {
        if (emoji) {
          emoji.forEach(id => {
            const emojiEl = document.getElementById(id);
            if (emojiEl) emojiEl.classList.add("show");
          });
        }
        index++;
        setTimeout(nextLine, 150);
      }
    });
  }

  nextLine();
}
// page3 진입
function enterPage3(){
  const guide = document.getElementById("page3Guide");
  if(guide){
    guide.style.display = "flex";  // ⭐ 진입 시 안내 표시
  }

  // 기존 피부 초기화 그대로 실행
  initPage3SkinDefault();
}

/* =====================
      PAGE3 피부 선택
===================== */
const bodyImg = document.getElementById("body");
const chips = document.querySelectorAll(".p3-chip");

if (bodyImg && chips.length) {
  const skinMap = {
    1: "assets/page_3/character/body_skin_1.svg",
    2: "assets/page_3/character/body_skin_2.svg",
    3: "assets/page_3/character/body_skin_3.svg",
    4: "assets/page_3/character/body_skin_4.svg",
  };

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const skin = chip.dataset.skin;
      if (!skinMap[skin]) return;

      bodyImg.src = skinMap[skin];

      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      localStorage.setItem("skin", skin);
    });
  });
}

function initPage3SkinDefault() {
  const defaultSkin = "1"; // ⭐ 제일 밝은 피부 ID (확인!)

  // body 이미지
  if (bodyImg) {
    bodyImg.src = `assets/page_3/character/body_skin_${defaultSkin}.svg`;
  }

  // UI 칩 상태
  chips.forEach(c => c.classList.remove("active"));
  const firstChip = chips[0];
  if (firstChip) firstChip.classList.add("active");

  // localStorage에 확정 저장 (⭐ 핵심)
  localStorage.setItem("skin", defaultSkin);
}
initPage3SkinDefault();

/* =====================
   ⭐ PAGE3로 돌아갈 때 초기화
===================== */
function resetPage3ToSkinSelect() {
  initPage3SkinDefault();

  const bodyImg = document.getElementById("body");
  const skin = localStorage.getItem("skin") || "1";
  if (bodyImg) {
    bodyImg.src = `assets/page_3/character/body_skin_${skin}.svg`;
  }
}

/* =================================================
   ⭐ PAGE4 전용 JS (전체)
   - 자동 복원 ❌
   - 클릭 시에만 반영 + 저장
================================================= */
function clearFaceStateForNewSession() {
  localStorage.removeItem("eyeId");
  localStorage.removeItem("cheekId");
  localStorage.removeItem("hairId");
  localStorage.removeItem("hairColor");
}
/* =====================
   ⭐ PAGE4 진입 (최종 안정)
===================== */
function enterPage4() {

  /* ===== 이름 ===== */
  const nameEl =
    document.getElementById("p4UserName") ||
    document.getElementById("userName");

  if (nameEl) {
    nameEl.textContent = localStorage.getItem("userName") || "";
  }

  /* ===== 피부 ===== */
  const skin = localStorage.getItem("skin") || "1";
  const body = document.getElementById("p4-body");
  if (body) {
    body.src = `assets/page_3/character/body_skin_${skin}.svg`;
    body.style.display = "block";
  }

  /* ===== 언더웨어 ===== */
  const under = document.getElementById("p4-under");
  if (under) {
    under.src = `assets/page_3/character/underwear_basic.svg`;
    under.style.display = "block";
  }

   /* ⭐⭐⭐ 여기 추가 ⭐⭐⭐ */
   const guide = document.getElementById("page4Guide");
   if (guide) {
     guide.style.display = "flex";
   }

  /* =====================
     ⭐ 커스터마이즈 안 했을 때만 초기화
     (page3 기본 눈은 건드리지 않음)
  ===================== */
  if (localStorage.getItem("hasCustomizedFace") !== "true") {

    localStorage.removeItem("eyeId");
    localStorage.removeItem("cheekId");
    localStorage.removeItem("hairId");
    localStorage.removeItem("hairColor");

    /* ❌ 눈은 건드리지 않음 (page3 기본 눈 유지) */

    /* 볼 제거 */
    document.querySelectorAll(".p4-cheeks .cheek")
      .forEach(c => c.classList.remove("show"));

    /* 머리 제거 */
    document.querySelectorAll(".p4-hair")
      .forEach(h => h.classList.remove("showColor"));

    /* 썸네일 테두리 제거 */
    document.querySelectorAll(".p4-list .item")
      .forEach(i => i.classList.remove("selected"));
  }
}





/* =====================
   ⭐ 카테고리 전환
===================== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-icon");
  if (!btn) return;

  document.querySelectorAll(".cat-icon")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const category =
    btn.classList.contains("eye") ? "eyes" :
    btn.classList.contains("cheek") ? "cheek" :
    "hair";

  document.querySelectorAll(".p4-list")
    .forEach(l => l.classList.remove("show"));

  const target = document.querySelector(`.p4-list.${category}`);
  if (target) target.classList.add("show");

  const page4 = document.querySelector(".screen.page4");
  page4.classList.toggle("show-hair", category === "hair");
});


/* =====================
   ⭐ 눈 선택 (기본눈 유지 + 선택취소 가능)
===================== */
document.querySelectorAll(".p4-list.eyes .item").forEach(item => {
  item.addEventListener("click", () => {

    const id = Number(item.dataset.id);
    const isSelected = item.classList.contains("selected");

    const baseEye = document.querySelector(".p4-eyes .base-eye");
    const eyes = document.querySelectorAll(".p4-eyes .eye");

    // 테두리 초기화
    document.querySelectorAll(".p4-list.eyes .item")
      .forEach(i => i.classList.remove("selected"));

    // 모든 커스텀 눈 숨김
    eyes.forEach(e => e.classList.remove("show"));

    /* 🔁 같은 눈 재클릭 → 취소 */
    if (isSelected) {
      if (baseEye) baseEye.classList.add("show");
      localStorage.removeItem("eyeId");
      return;
    }

    /* ✅ 새 선택 */
    item.classList.add("selected");
    if (baseEye) baseEye.classList.remove("show");

    const target = eyes[id]; // 0 = base-eye, 1부터 커스텀
    if (target) target.classList.add("show");

    localStorage.setItem("eyeId", id);
    localStorage.setItem("hasCustomizedFace", "true");
  });
});


//볼선택


document.querySelectorAll(".p4-list.cheek .item").forEach(item => {
  item.addEventListener("click", () => {

    const id = Number(item.dataset.id);
    const isSelected = item.classList.contains("selected");
    const cheeks = document.querySelectorAll(".p4-cheeks .cheek");

    document.querySelectorAll(".p4-list.cheek .item")
      .forEach(i => i.classList.remove("selected"));

    cheeks.forEach(c => c.classList.remove("show"));

    if (isSelected) {
      localStorage.removeItem("cheekId");
      return;
    }

    item.classList.add("selected");
    const target = cheeks[id - 1];
    if (target) target.classList.add("show");

    localStorage.setItem("cheekId", id);
    localStorage.setItem("hasCustomizedFace", "true");
  });
});








/* =====================
   ⭐ 머리 (색/스타일 순서 무관)
===================== */
/* =====================
   ⭐ 머리 상태
===================== */
let currentHairId = null;
let currentHairColor = null;

function updateHair() {
  document.querySelectorAll(".p4-hair")
    .forEach(g => g.classList.remove("showColor"));

  if (!currentHairId) return;

  if (!currentHairColor) {
    currentHairColor = "brown";
    localStorage.setItem("hairColor", "brown");
  }

  const group = document.querySelector(`.p4-hair.${currentHairColor}`);
  if (!group) return;

  group.classList.add("showColor");

  group.querySelectorAll(".hair")
    .forEach(h => h.classList.remove("show"));

  const target = group.querySelector(`.hair:nth-child(${currentHairId})`);
  if (target) target.classList.add("show");
}

/* 스타일 선택 (토글) */
document.querySelectorAll(".p4-list.hair .item").forEach(item => {
  item.addEventListener("click", () => {

    const id = Number(item.dataset.id);
    const isSelected = item.classList.contains("selected");

    document.querySelectorAll(".p4-list.hair .item")
      .forEach(i => i.classList.remove("selected"));

    if (isSelected) {
      currentHairId = null;
      localStorage.removeItem("hairId");
      updateHair();
      return;
    }

    item.classList.add("selected");
    currentHairId = id;
    localStorage.setItem("hairId", id);
    localStorage.setItem("hasCustomizedFace", "true");

    updateHair();
  });
});

/* 색상 선택 */
document.querySelectorAll(".hair-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".hair-chip").forEach(c => {
      c.classList.remove("active");
      const paw = c.querySelector(".p4-paw");
      if (paw) paw.style.display = "none";
    });

    chip.classList.add("active");
    const paw = chip.querySelector(".p4-paw");
    if (paw) paw.style.display = "block";

    currentHairColor = chip.dataset.color;
    localStorage.setItem("hairColor", currentHairColor);
    updateHair();
  });
});

/* =================================================
   ⭐ PAGE5 전용 JS (기존 코드 수정 ❌)
   → 기존 JS 맨 아래에 그대로 붙여넣기
================================================= */

/* =====================
   PAGE4 ↔ PAGE5 이동
===================== */
document.addEventListener("click", (e) => {

  /* page4 → page5 */
  const toPage5 = e.target.closest(".screen.page4 .p4-arrow.right");
  if (toPage5) {
    goTo("page5");
    requestAnimationFrame(() => enterPage5());
    return;
  }

  /* page5 → page4 */
  const backToPage4 = e.target.closest(".screen.page5 .p4-arrow.left");
  if (backToPage4) {
    goTo("page4");
    requestAnimationFrame(() => enterPage4());
    return;
  }
  /* page4 → page3 (이전 버튼) */
  const backToPage3 = e.target.closest(".screen.page4 .p4-arrow.left");
  if (backToPage3) {

    resetPage3ToSkinSelect(); // ⭐ 핵심

    goTo("page3");
    return;
  }

})

/* =====================
   ⭐ PAGE5 초기화 (안전 버전)
===================== */
function enterPage5() {

  /* ===== 이름 ===== */
  const nameEl = document.getElementById("p5UserName");
  if (nameEl) {
    nameEl.textContent = localStorage.getItem("userName") || "";
  }

  /* ===== 피부 ===== */
  const skin = localStorage.getItem("skin") || "1";
  const body = document.getElementById("p5-body");
  if (body) {
    body.src = `assets/page_3/character/body_skin_${skin}.svg`;
    body.style.display = "block";
  }

  /* ===== 언더웨어 ===== */
  const under = document.getElementById("p4-under");
  if (under) {
    under.src = `assets/page_3/character/underwear_basic.svg`;
    under.style.display = "block";
  }

  /* ⭐ 1️⃣ 얼굴 / 머리 먼저 복원 */
  restoreFaceForPage5();

  /* ⭐ 2️⃣ 그 다음 카테고리 세팅 */
  requestAnimationFrame(() => {
    setDefaultCategoryPage5();
  });
  startDogTips();

}
  /* =====================
     ⭐ 기본 카테고리 강제 설정 (추가)
  ===================== */
  setDefaultCategoryPage5();


/* =====================
   ⭐ PAGE5 얼굴 + 머리 복원
===================== */
function restoreFaceForPage5() {

  /* ❗ 얼굴을 실제로 만진 적 없으면 아무것도 복원 안 함 */
  const hasCustomized = localStorage.getItem("hasCustomizedFace");
  if (hasCustomized !== "true") {
    return;
  }

  /* =====================
   👁 PAGE5 눈 복원 (밀림 해결)
===================== */
const eyeId = localStorage.getItem("eyeId");
const eyes = document.querySelectorAll(".page5 .p4-eyes .eye");
const baseEye = document.querySelector(".page5 .p4-eyes .base-eye");

// 전부 숨김
eyes.forEach(e => e.classList.remove("show"));

// 선택한 눈이 있으면
if (eyeId !== null) {
  if (baseEye) baseEye.classList.remove("show");

  const target = eyes[Number(eyeId)];
  if (target) target.classList.add("show");
} else {
  // 선택 안 했으면 기본눈
  if (baseEye) baseEye.classList.add("show");
}

  /* =====================
     😊 볼
  ===================== */
  const cheekId = localStorage.getItem("cheekId");
  const cheeks = document.querySelectorAll(".page5 .p4-cheeks .cheek");

  cheeks.forEach(c => c.classList.remove("show"));

  if (cheekId) {
    const cheek = cheeks[Number(cheekId) - 1];
    if (cheek) cheek.classList.add("show");
  }

  /* =====================
     💇 머리
  ===================== */
  const hairId = localStorage.getItem("hairId");
  const hairColor = localStorage.getItem("hairColor");

  if (!hairId || !hairColor) {
    document
      .querySelectorAll(".page5 .p4-hair")
      .forEach(g => g.classList.remove("showColor"));
    return;
  }

  const groups = document.querySelectorAll(".page5 .p4-hair");
  groups.forEach(g => g.classList.remove("showColor"));

  const group = document.querySelector(`.page5 .p4-hair.${hairColor}`);
  if (!group) return;

  group.classList.add("showColor");

  const hairs = group.querySelectorAll(".hair");
  hairs.forEach(h => h.classList.remove("show"));

  const target = hairs[Number(hairId) - 1];
  if (target) target.classList.add("show");
}
/* =================================================
   ⭐ PAGE5 의상 상태 관리
================================================= */
const wearState = {
  top: null,
  pants: null,
  skirt: null,
  onepiece: null,
  outer: null,
  socks: null,
  shoes: null
};
/* =================================================
   ⭐ PAGE5 카테고리 전환
================================================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".screen.page5 .cat-icon");
  if (!btn) return;

  // 아이콘 active 처리
  document.querySelectorAll(".screen.page5 .cat-icon")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // 카테고리 판별
  const category =
    btn.classList.contains("top") ? "top" :
    btn.classList.contains("pants") ? "pants" :
    btn.classList.contains("skirt") ? "skirt" :
    btn.classList.contains("onepiece") ? "onepiece" :
    btn.classList.contains("outer") ? "outer" :
    btn.classList.contains("socks") ? "socks" :
    btn.classList.contains("shoes") ? "shoes" :
    null;

  if (!category) return;

  // 모든 리스트 숨김
  document.querySelectorAll(".screen.page5 .p4-list")
    .forEach(l => l.classList.remove("show"));

  // 해당 리스트만 표시
  const target = document.querySelector(`.screen.page5 .p4-list.${category}`);
  if (target) target.classList.add("show");
});

/* =================================================
   ⭐ PAGE5 언더웨어 토글
   - 하나라도 옷 있으면 숨김
   - 전부 없으면 표시
================================================= */
function updateUnderwearVisibilityPage5() {
  const under = document.getElementById("p5-under"); // page5에서도 이 id 사용
  if (!under) return;

  const hasAnyClothes = Object.values(wearState).some(v => v !== null);
  under.style.display = hasAnyClothes ? "none" : "block";
}


/* =================================================
   ⭐ 카테고리 렌더
================================================= */
function renderCategory(category) {
  const layers = document.querySelectorAll(`.page5 .p4-${category} .${category}`);
  layers.forEach(l => l.classList.remove("show"));

  const id = wearState[category];
  if (!id) return;

  const target = layers[id - 1];
  if (target) target.classList.add("show");
}

/* =================================================
   ⭐ PAGE5 의상 클릭 (선택 / 취소)
================================================= */
document.querySelectorAll(".page5 .p4-list .item").forEach(item => {
  item.addEventListener("click", () => {

    const category = item.dataset.type; // top, pants, skirt...
    const id = Number(item.dataset.id);

    if (!wearState.hasOwnProperty(category)) return;

    const wasSelected = item.classList.contains("selected");

    /* =====================
       🔁 같은 아이템 재클릭 → 취소
    ===================== */
    if (wasSelected) {
      item.classList.remove("selected");
      wearState[category] = null;

      renderCategory(category);
      updateUnderwearVisibilityPage5(); // ⭐ 여기만
      return;
    }

    /* =====================
       ✅ 새 아이템 선택
    ===================== */

    // 같은 카테고리 썸네일 초기화
    document
      .querySelectorAll(`.page5 .p4-list.${category} .item`)
      .forEach(i => i.classList.remove("selected"));

    item.classList.add("selected");
    wearState[category] = id;

    renderCategory(category);
    updateUnderwearVisibilityPage5(); // ⭐ 여기
  });
});

/* =================================================
   ⭐ PAGE5 기본 카테고리 (상의)
================================================= */
function setDefaultCategoryPage5() {
  const defaultCategory = "top";

  // 아이콘 초기화
  document
    .querySelectorAll(".screen.page5 .cat-icon")
    .forEach(b => b.classList.remove("active"));

  // 리스트 초기화
  document
    .querySelectorAll(".screen.page5 .p4-list")
    .forEach(l => l.classList.remove("show"));

  // 아이콘 활성화
  const icon = document.querySelector(
    `.screen.page5 .cat-icon.${defaultCategory}`
  );
  if (icon) icon.classList.add("active");

  // 리스트 표시
  const list = document.querySelector(
    `.screen.page5 .p4-list.${defaultCategory}`
  );
  if (list) list.classList.add("show");
}

/* =====================
   🐶 강아지 랜덤 팁
===================== */

const dogMessages = [
  "오늘 입은 코디 그대로 기록해줘!",
  "여러 아이템을 같이 입을 수도 있어!",
  "레이어드 코디도 기록할 수 있어!",
  "오늘의 스타일 저장!",
  "오늘 착장 마음에 들어!",
  "오늘의 코디 기록하는중…"
];

let dogTipInterval = null;

/* 랜덤 멘트 세팅 */
function setRandomDogMessage(){
  const bubble = document.getElementById("dogBubble");
  if(!bubble) return;

  const random = Math.floor(Math.random() * dogMessages.length);
  bubble.textContent = dogMessages[random];
}

/* 자동 변경 시작 */
function startDogTips(){
  stopDogTips();          // 중복 방지
  setRandomDogMessage(); // 처음 한 번

  dogTipInterval = setInterval(() => {
    setRandomDogMessage();
  }, 3500); // 3.5초마다 변경
}

/* 자동 변경 중지 */
function stopDogTips(){
  if(dogTipInterval){
    clearInterval(dogTipInterval);
    dogTipInterval = null;
  }
}

/* =====================
   🔄 PAGE5 코디 리셋 (옷만 제거)
===================== */
function resetCoordi(){

  /* 1) wearState 전부 초기화 */
  wearState.top = null;
  wearState.pants = null;
  wearState.skirt = null;
  wearState.onepiece = null;
  wearState.outer = null;
  wearState.socks = null;
  wearState.shoes = null;

  /* 2) 캐릭터에 입혀진 옷 전부 숨기기 */
  document.querySelectorAll(
    ".page5 .p4-top .top, \
     .page5 .p4-pants .pants, \
     .page5 .p4-skirt .skirt, \
     .page5 .p4-onepiece .onepiece, \
     .page5 .p4-outer .outer, \
     .page5 .p4-socks .socks, \
     .page5 .p4-shoes .shoes"
  ).forEach(el => el.classList.remove("show"));

  /* 3) 썸네일 선택 상태 제거 */
  document.querySelectorAll(".page5 .p4-list .item")
    .forEach(item => item.classList.remove("selected"));

  /* 4) 언더웨어 상태는 기존 로직에 맡김 */
  updateUnderwearVisibilityPage5();  // ⭐ 이 한 줄이 전부임
}

/* =================================================
   PAGE5 ↔ PAGE6 이동
================================================= */
document.addEventListener("click", (e) => {

  /* page5 → page6 */
  const toPage6 = e.target.closest(".screen.page5 .p4-arrow.right");
  if (toPage6) {
    goTo("page6");
    requestAnimationFrame(() => enterPage6());
    return;
  }

  /* page6 → page5 */
  const backToPage5 = e.target.closest(".screen.page6 .p4-arrow.left");
  if (backToPage5) {
    goTo("page5");
    requestAnimationFrame(() => enterPage5());
    return;
  }

});


/* =================================================
   PAGE6 진입 초기화
================================================= */
function enterPage6(){

  const page6 = document.querySelector(".screen.page6");
  if(!page6) return;

  /* 이름 */
  const nameEl = page6.querySelector("#p5UserName");
  if(nameEl){
    nameEl.textContent = localStorage.getItem("userName") || "";
  }

  /* 피부 */
  const skin = localStorage.getItem("skin") || "1";
  const body = page6.querySelector("#p5-body");
  if(body){
    body.src = `assets/page_3/character/body_skin_${skin}.svg`;
    body.style.display = "block";
  }

  /* 언더웨어 */
  const under = page6.querySelector("#p5-under");
  if(under){
    under.src = "assets/page_3/character/underwear_basic.svg";
  }

  updateUnderwearVisibilityPage6();

  /* 얼굴 / 머리 복원 */
  restoreFaceForPage6();
  restoreHairForPage6();

  /* 옷 복원 */
  restoreClothesForPage6();


  /* 기본 카테고리 */
  setDefaultCategoryPage6();
  savePage6State();

  // 저장된 상태 복원
restorePage6State();

}


/* =================================================
   PAGE6 얼굴 복원
================================================= */
function restoreFaceForPage6(){

  const page6 = document.querySelector(".screen.page6");
  if(!page6) return;

  const hasCustomized = localStorage.getItem("hasCustomizedFace");
  if(hasCustomized !== "true") return;

  /* 눈 */
  const eyeId = localStorage.getItem("eyeId");
  const eyes = page6.querySelectorAll(".p4-eyes .eye");
  const baseEye = page6.querySelector(".p4-eyes .base-eye");

  eyes.forEach(e => e.classList.remove("show"));

  if(eyeId !== null){
    if(baseEye) baseEye.classList.remove("show");
    const target = eyes[Number(eyeId)];
    if(target) target.classList.add("show");
  }else{
    if(baseEye) baseEye.classList.add("show");
  }

  /* 볼 */
  const cheekId = localStorage.getItem("cheekId");
  const cheeks = page6.querySelectorAll(".p4-cheeks .cheek");

  cheeks.forEach(c => c.classList.remove("show"));

  if(cheekId){
    const cheek = cheeks[Number(cheekId)-1];
    if(cheek) cheek.classList.add("show");
  }
}


/* =================================================
   PAGE6 머리 복원
================================================= */
function restoreHairForPage6(){

  const page6 = document.querySelector(".screen.page6");
  if(!page6) return;

  const hairId = localStorage.getItem("hairId");
  const hairColor = localStorage.getItem("hairColor");

  page6.querySelectorAll(".p4-hair")
    .forEach(g => g.classList.remove("showColor"));

  if(!hairId || !hairColor) return;

  const group = page6.querySelector(`.p4-hair.${hairColor}`);
  if(!group) return;

  group.classList.add("showColor");

  const hairs = group.querySelectorAll(".hair");
  hairs.forEach(h => h.classList.remove("show"));

  const target = hairs[Number(hairId)-1];
  if(target) target.classList.add("show");
}


/* =================================================
   PAGE6 옷 복원
================================================= */
function updateUnderwearVisibilityPage6(){

  const page6 = document.querySelector(".screen.page6");
  if(!page6) return;

  const under = page6.querySelector("#p5-under");
  if(!under) return;

  const hasAnyClothes = Object.values(wearState).some(v => v !== null);
  under.style.display = hasAnyClothes ? "none" : "block";
}

function restoreClothesForPage6(){

  const page6 = document.querySelector(".screen.page6");
  if(!page6) return;

  Object.keys(wearState).forEach(category => {
    page6.querySelectorAll(`.p4-${category} .${category}`)
      .forEach(el => el.classList.remove("show"));
  });

  Object.keys(wearState).forEach(category => {
    const id = wearState[category];
    if(!id) return;

    const layers = page6.querySelectorAll(`.p4-${category} .${category}`);
    const target = layers[id - 1];
    if(target) target.classList.add("show");
  });

  updateUnderwearVisibilityPage6(); 
}


/* =================================================
   PAGE6 기본 카테고리
================================================= */
function setDefaultCategoryPage6(){

  const defaultCategory = "bag";

  document
    .querySelectorAll(".screen.page6 .cat-icon")
    .forEach(b => b.classList.remove("active"));

  document
    .querySelectorAll(".screen.page6 .p4-list")
    .forEach(l => l.classList.remove("show"));

  const icon = document.querySelector(`.screen.page6 .cat-icon.${defaultCategory}`);
  if(icon) icon.classList.add("active");

  const list = document.querySelector(`.screen.page6 .p4-list.${defaultCategory}`);
  if(list) list.classList.add("show");
}


/* =================================================
   PAGE6 카테고리 전환
================================================= */
document.addEventListener("click", (e) => {

  const btn = e.target.closest(".screen.page6 .cat-icon");
  if (!btn) return;

  document.querySelectorAll(".screen.page6 .cat-icon")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const category =
    btn.classList.contains("bag") ? "bag" :
    btn.classList.contains("case") ? "case" :
    btn.classList.contains("hat") ? "hat" :
    btn.classList.contains("face") ? "face" :
    btn.classList.contains("ect") ? "ect" :
    null;

  if (!category) return;

  document.querySelectorAll(".screen.page6 .p4-list")
    .forEach(l => l.classList.remove("show"));

  const target = document.querySelector(`.screen.page6 .p4-list.${category}`);
  if (target) target.classList.add("show");
});


/* =================================================
   PAGE6 FACE 슬롯 시스템
================================================= */

const faceState = {
  activeSlots: [],
  slotMap: {}
};

function selectFace(item) {
  const id = item.dataset.id;
  const slot = item.dataset.slot;

  const img = document.querySelector(`.p4-face img[data-id="${id}"]`);
  if (!img) return;

  if (faceState.slotMap[slot] === id) {
    removeFace(slot);
    return;
  }

  if (faceState.slotMap[slot]) {
    removeFace(slot);
  }

  if (!faceState.activeSlots.includes(slot)) {
    if (faceState.activeSlots.length >= 3) {
      const oldest = faceState.activeSlots.shift();
      removeFace(oldest);
    }
    faceState.activeSlots.push(slot);
  }

  faceState.slotMap[slot] = id;
  img.classList.add("show");
  item.classList.add("selected");
}

function removeFace(slot) {
  const id = faceState.slotMap[slot];
  if (!id) return;

  const img = document.querySelector(`.p4-face img[data-id="${id}"]`);
  const item = document.querySelector(`.p4-list.face .item[data-id="${id}"]`);

  if (img) img.classList.remove("show");
  if (item) item.classList.remove("selected");

  delete faceState.slotMap[slot];
  faceState.activeSlots = faceState.activeSlots.filter(s => s !== slot);
  savePage6State();
}


/* =================================================
   PAGE6 ECT 슬롯 시스템
================================================= */

const ectState = {
  "hand-left": null,
  "hand-right": null,
  "body": null
};

function selectEct(item) {
  const id = item.dataset.id;
  const slot = item.dataset.slot;

  const img = document.querySelector(`.p4-ect img[data-id="${id}"]`);
  if (!img) return;

  if (ectState[slot] === id) {
    removeEct(slot);
    return;
  }

  if (ectState[slot]) {
    removeEct(slot);
  }

  ectState[slot] = id;
  img.classList.add("show");
  item.classList.add("selected");
}

function removeEct(slot) {
  const id = ectState[slot];
  if (!id) return;

  const img = document.querySelector(`.p4-ect img[data-id="${id}"]`);
  const item = document.querySelector(`.p4-list.ect .item[data-id="${id}"]`);

  if (img) img.classList.remove("show");
  if (item) item.classList.remove("selected");

  ectState[slot] = null;
  savePage6State();

}
/* =================================================
   PAGE6 상태 저장 / 복원
================================================= */

function savePage6State() {
  const data = {
    face: faceState,
    ect: ectState,
    basic: accBasicState
  };
  localStorage.setItem("page6AccState", JSON.stringify(data));
}


/* ===============================
   복원
================================ */

function restorePage6State() {
  const raw = localStorage.getItem("page6AccState");
  if (!raw) return;

  const data = JSON.parse(raw);

  /* face 복원 */
  if (data.face) {
    Object.assign(faceState, data.face);
    faceState.activeSlots.forEach(slot => {
      const id = faceState.slotMap[slot];
      const img = document.querySelector(`.p4-face img[data-id="${id}"]`);
      const item = document.querySelector(`.p4-list.face .item[data-id="${id}"]`);
      if (img) img.classList.add("show");
      if (item) item.classList.add("selected");
    });
  }

  /* ect 복원 */
  if (data.ect) {
    Object.assign(ectState, data.ect);
    Object.keys(ectState).forEach(slot => {
      const id = ectState[slot];
      if (!id) return;
      const img = document.querySelector(`.p4-ect img[data-id="${id}"]`);
      const item = document.querySelector(`.p4-list.ect .item[data-id="${id}"]`);
      if (img) img.classList.add("show");
      if (item) item.classList.add("selected");
    });
  }

  /* bag / hat / case 복원 */
  if (data.basic) {
    Object.assign(accBasicState, data.basic);
    Object.keys(accBasicState).forEach(cat => {
      renderBasicAcc(cat);
      const id = accBasicState[cat];
      if (!id) return;
      const item = document.querySelector(`.p4-list.${cat} .item[data-id="${id}"]`);
      if (item) item.classList.add("selected");
    });
  }
}

/* =================================================
   PAGE6 리셋 버튼
================================================= */

function resetAcc() {
  // face 전부 해제
  Object.keys(faceState.slotMap).forEach(slot => removeFace(slot));

  // ect 전부 해제
  Object.keys(ectState).forEach(slot => removeEct(slot));

  // bag / hat / case 전부 해제
  Object.keys(accBasicState).forEach(cat => {
    accBasicState[cat] = null;
    const layers = document.querySelectorAll(`.screen.page6 .p4-${cat} .${cat}`);
    layers.forEach(l => l.classList.remove("show"));
    document
      .querySelectorAll(`.screen.page6 .p4-list.${cat} .item`)
      .forEach(i => i.classList.remove("selected"));
  });

  // face/ect 썸네일 selected도 정리
  document.querySelectorAll(".screen.page6 .p4-list.face .item, .screen.page6 .p4-list.ect .item")
    .forEach(i => i.classList.remove("selected"));

  // 저장
  savePage6State();
}


/* =================================================
   PAGE6 기본 악세서리 (bag / hat / case)
================================================= */

const accBasicState = {
  bag: null,
  case: null,
  hat: null
};

function renderBasicAcc(category){

  const layers = document.querySelectorAll(`.screen.page6 .p4-${category} .${category}`);
  layers.forEach(l => l.classList.remove("show"));

  const id = accBasicState[category];
  if (!id) return;

  const target = layers[id - 1];
  if (target) target.classList.add("show");
}


/* ===============================
   bag / hat / case 선택
================================ */

document.querySelectorAll(
  ".screen.page6 .p4-list.bag .item, \
   .screen.page6 .p4-list.case .item, \
   .screen.page6 .p4-list.hat .item"
).forEach(item => {

  item.addEventListener("click", () => {

    const category = item.dataset.type; // bag / case / hat
    const id = Number(item.dataset.id);

    const wasSelected = item.classList.contains("selected");

    // 기존 선택 해제
    document
      .querySelectorAll(`.screen.page6 .p4-list.${category} .item`)
      .forEach(i => i.classList.remove("selected"));

    if (wasSelected) {
      accBasicState[category] = null;
      renderBasicAcc(category);
      savePage6State();
      return;
    }

    item.classList.add("selected");
    accBasicState[category] = id;
    renderBasicAcc(category);
    savePage6State();
  });

});

/* =====================
   PAGE6 → PAGE7 이동
===================== */
document.addEventListener("click", (e) => {

  // page6 오른쪽 화살표
  const toPage7 = e.target.closest(".screen.page6 .p4-arrow.right");
  if (!toPage7) return;

  // page7로 이동
  goTo("page7");

  // page7 초기화 함수 (나중에 만들 예정)
  if (typeof enterPage7 === "function") {
    requestAnimationFrame(() => enterPage7());
  }
});

/* =====================
   PAGE7 스티커 박스 등장 제어
===================== */

function enterPage7(){

  const box = document.querySelector(".screen.page7 .p7-sticker-box");
  if(!box) return;

  // 처음엔 숨김
  box.classList.remove("show");

  // 1초 후 등장
  setTimeout(() => {
    box.classList.add("show");
  }, 1000);

  setPage7Date();
  loadNameToPage7(); 
  loadCharacterToPage7();
  
}

/* =====================
   PAGE7 날짜 세팅
===================== */
function setPage7Date(){
  const dateEl = document.getElementById("p7TodayDate");
  if(!dateEl) return;

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth()+1).padStart(2,"0");
  const d = String(today.getDate()).padStart(2,"0");

  dateEl.textContent = `${y}.${m}.${d}`;
}

/* =====================
   PAGE6 캐릭터 → PAGE7 복사
===================== */
function loadCharacterToPage7(){

  // page6 캐릭터 전체 박스
  const page6Character = document.querySelector(".screen.page6 .p4-character");
  const page7Area = document.getElementById("p7CharacterArea");

  if(!page6Character || !page7Area){
    console.log("❌ 캐릭터 복사 실패", page6Character, page7Area);
    return;
  }

  // 기존 캐릭터 삭제
  page7Area.innerHTML = "";

  // 캐릭터 복제
  const clone = page6Character.cloneNode(true);

  // page7 전용 클래스 추가 (필요하면 스타일 조절용)
  clone.classList.add("p7-character");

  page7Area.appendChild(clone);
}


// 이름불러오기 //
function loadNameToPage7(){
  const nameEl = document.getElementById("p7UserName");
  if(!nameEl) return;

  const savedName = localStorage.getItem("userName") || "";
  nameEl.textContent = savedName;
}

/* =================================================
   PAGE7 STICKER SYSTEM (FINAL)
================================================= */

document.addEventListener("DOMContentLoaded", () => {

const stickerArea = document.getElementById("p7StickerArea");
const stickerPanel = document.getElementById("p7StickerPanel");
const stickerBox = document.querySelector(".p7-sticker-box");

let currentSticker = null;

/* 크기 설정 */
const STICKER_DEFAULT = 1;
const STICKER_MIN = 0.6;
const STICKER_MAX = 1.3;
const STICKER_STEP = 0.2;
const ROTATE_STEP = 30;

/* 카테고리 클릭 */
document.querySelectorAll(".p7-sticker-item, .p7-sticker-item-big").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const img = btn.querySelector("img");
    if(!img) return;
    createSticker(img.src);
  });
});


function createSticker(src){
  const sticker = document.createElement("div");
  sticker.className = "p7-sticker";
  sticker.dataset.scale = STICKER_DEFAULT;
  sticker.dataset.rotate = 0;

  const transformWrap = document.createElement("div");
  transformWrap.className = "sticker-transform-wrap";

  const scaleWrap = document.createElement("div");
  scaleWrap.className = "sticker-scale-wrap";

  const img = document.createElement("img");
  img.className = "sticker-img";
  img.src = src;

  const border = document.createElement("div");
  border.className = "sticker-border";

  const close = document.createElement("div");
  close.className = "sticker-close";
  close.textContent = "×";

  scaleWrap.appendChild(border);
  scaleWrap.appendChild(img);
  scaleWrap.appendChild(close);

  transformWrap.appendChild(scaleWrap);
  sticker.appendChild(transformWrap);

  const pos = randomPosition();
  sticker.style.left = pos.x + "px";
  sticker.style.top = pos.y + "px";

  stickerArea.appendChild(sticker);

  // ⭐ 이미지 실제 크기 기준으로 회전 중심 맞추기
  img.onload = () => {
    scaleWrap.style.width = img.naturalWidth + "px";
    scaleWrap.style.height = img.naturalHeight + "px";
    transformWrap.style.width = img.naturalWidth + "px";
    transformWrap.style.height = img.naturalHeight + "px";
    applyTransform(sticker);
  };

  selectSticker(sticker);

  close.addEventListener("click", e=>{
    e.stopPropagation();
    sticker.remove();
    deselectSticker();
  });

  sticker.addEventListener("pointerdown", e=>{
    e.stopPropagation();
    selectSticker(sticker);
  });

  makeDraggable(sticker);
}



/* 랜덤 위치 (카테고리 박스 위까지만) */
function randomPosition(){
  const areaRect = stickerArea.getBoundingClientRect();
  const boxRect = stickerBox.getBoundingClientRect();

  const minX = 40;
  const maxX = areaRect.width - 140;

  const minY = 120;
  const maxY = boxRect.top - areaRect.top - 160;

  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY
  };
}


/* 선택 관리 */
function selectSticker(sticker){
  deselectSticker();
  currentSticker = sticker;
  sticker.classList.add("selected");
  stickerPanel.classList.add("show");
}

function deselectSticker(){
  if(currentSticker){
    currentSticker.classList.remove("selected");
  }
  currentSticker = null;
  stickerPanel.classList.remove("show");
}

document.querySelector(".p7-note-area").addEventListener("pointerdown", ()=>{
  deselectSticker();
});


/* 변형 */
function applyTransform(sticker){
  const scale = sticker.dataset.scale;
  const rotate = sticker.dataset.rotate;

  const scaleWrap = sticker.querySelector(".sticker-scale-wrap");
  const transformWrap = sticker.querySelector(".sticker-transform-wrap");

  /* 확대는 scale-wrap */
  scaleWrap.style.transform = `scale(${scale})`;

  /* 회전은 transform-wrap */
  transformWrap.style.transform = `rotate(${rotate}deg)`;
}



/* 패널 버튼 */
document.querySelector(".btn-plus").addEventListener("click", ()=>{
  if(!currentSticker) return;
  let scale = parseFloat(currentSticker.dataset.scale);
  scale = Math.min(scale + STICKER_STEP, STICKER_MAX);
  currentSticker.dataset.scale = scale;
  applyTransform(currentSticker);
});

document.querySelector(".btn-minus").addEventListener("click", ()=>{
  if(!currentSticker) return;
  let scale = parseFloat(currentSticker.dataset.scale);
  scale = Math.max(scale - STICKER_STEP, STICKER_MIN);
  currentSticker.dataset.scale = scale;
  applyTransform(currentSticker);
});

document.querySelector(".btn-rotate").addEventListener("click", ()=>{
  if(!currentSticker) return;
  let rotate = parseFloat(currentSticker.dataset.rotate);
  rotate += ROTATE_STEP;
  currentSticker.dataset.rotate = rotate;
  applyTransform(currentSticker);
});


/* 드래그 */
function makeDraggable(sticker){
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  sticker.addEventListener("pointerdown", startDrag);

  function startDrag(e){
    e.preventDefault();
    selectSticker(sticker);
    isDragging = true;

    startX = e.clientX;
    startY = e.clientY;
    startLeft = sticker.offsetLeft;
    startTop = sticker.offsetTop;

    document.addEventListener("pointermove", drag);
    document.addEventListener("pointerup", endDrag);
  }

  function drag(e){
    if(!isDragging) return;
    sticker.style.left = startLeft + (e.clientX - startX) + "px";
    sticker.style.top = startTop + (e.clientY - startY) + "px";
  }

  function endDrag(){
    isDragging = false;
    document.removeEventListener("pointermove", drag);
    document.removeEventListener("pointerup", endDrag);
  }
}

});

/* ===========================
   PAGE7 저장 버튼 → 로딩 → PAGE8
=========================== */

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#p7SaveBtn");
  if (!btn) return;

  console.log("저장 버튼 클릭됨");

  goTo("loading");

  setTimeout(() => {
    goTo("page8");
    enterPage8();
  }, 3000);
});

function enterPage8(){



  // 이름
  const name = localStorage.getItem("userName") || "";
  const nameEl = document.getElementById("p8UserName");
  if(nameEl) nameEl.textContent = name;

  // 날짜
  const dateEl = document.getElementById("p8TodayDate");
  if(dateEl){
    const d = new Date();
    dateEl.textContent = `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
  }

  // 캐릭터 복사
  const page7Char = document.getElementById("p7CharacterArea");
  const page8Char = document.getElementById("p8CharacterArea");

  if(page7Char && page8Char){
    page8Char.innerHTML = "";
    page8Char.appendChild(page7Char.cloneNode(true));
  }

  // 스티커 복사
  const page7Sticker = document.getElementById("p7StickerArea");
  const page8Sticker = document.getElementById("p8StickerArea");

  if(page7Sticker && page8Sticker){
    page8Sticker.innerHTML = "";
    page8Sticker.appendChild(page7Sticker.cloneNode(true));
  }

   /* =====================
     ⏳ 문장 타이핑 딜레이
  ===================== */

  setTimeout(() => {
    startTypingPage8();
  }, 2000);   // ← 2초 뒤 시작
}

/* =====================
   PAGE8 타이핑 (최종 안정 버전)
===================== */

/* 이모지 위치/상태 리셋 */
function resetPage8Emojis(){
  const line = document.getElementById("p8t1")?.parentNode;
  if(!line) return;

  ["p8e1","p8e2","p8e4"].forEach(id=>{
    const el = document.getElementById(id);
    if(el){
      el.classList.remove("show");
      // 항상 문장 줄 끝으로 되돌림
      line.appendChild(el);
    }
  });
}


function startTypingPage8() {

  /* 🔥 이모지 상태 초기화 */
  resetPage8Emojis();

  /* 랜덤 코디 문장 */
  const coordiTexts = [
    "오늘 코디 진짜 최고야!",
    "이 코디 완전 맘에들어!",
    "이 코디 완전 귀엽잖아?",
    "오늘 코디도 완벽해!"
  ];

  /* 랜덤 강아지 (e3 제외) */
  const emojiIds = ["p8e1", "p8e2", "p8e4"];

  const randomText = coordiTexts[Math.floor(Math.random() * coordiTexts.length)];
  const randomEmoji = emojiIds[Math.floor(Math.random() * emojiIds.length)];

  const lines = [
    { el: document.getElementById("p8t1"), text: randomText, emoji: [randomEmoji] },
    { el: document.getElementById("p8t2"), text: "아래 저장하기 버튼을 누르면" },
    { el: document.getElementById("p8t3"), text: "png 또는 노트 전체를" },
    { el: document.getElementById("p8t4"), text: "저장할 수 있어!" }
  ];

  let index = 0;

  function nextLine() {
    if (index >= lines.length) return;

    const { el, text, emoji } = lines[index];
    if (!el) {
      index++;
      nextLine();
      return;
    }

    typeText({
      text,
      target: el,
      speed: 25, 
      callback: () => {

        /* 이모지가 있는 줄이면 문장 끝에 고정 배치 */
        if (emoji) {
          emoji.forEach(id => {
            const emojiEl = document.getElementById(id);
            if (emojiEl && el) {
              emojiEl.classList.add("show");

              // 🔥 문장(span) 바로 뒤에 붙여서 위치 고정
              el.insertAdjacentElement("afterend", emojiEl);
            }
          });
        }

        index++;
        setTimeout(nextLine, 150);
      }
    });
  }

  nextLine();
}

/* =====================
   PAGE8 홈 버튼 → 새 게임
===================== */

document.addEventListener("click", (e) => {
  const homeBtn = e.target.closest("#homeBtn");
  if (!homeBtn) return;

  location.reload();   // ⭐ 완전 새 게임
});




/* =================================================
   📸 PAGE8 저장 기능 (캐릭터 / 전체페이지)
================================================= */

/* -------------------------------
   캡쳐용 UI 숨김 처리
-------------------------------- */
function toggleCaptureUI(hide) {
  const targets = document.querySelectorAll(".no-capture");

  targets.forEach(el => {
    if (hide) {
      el.dataset.prevDisplay = el.style.display;
      el.style.display = "none";
    } else {
      el.style.display = el.dataset.prevDisplay || "";
    }
  });
}

/* -------------------------------
   📸 캡쳐용 로고 토글
-------------------------------- */
function toggleCaptureLogo(show){
  const logo = document.getElementById("captureLogo");
  if(!logo) return;
  logo.style.display = show ? "block" : "none";
}



/* -------------------------------
   전체 페이지 저장 (현재 화면 그대로)
-------------------------------- */
const savePageBtn = document.getElementById("savePageBtn");

if (savePageBtn) {
  savePageBtn.addEventListener("click", saveFullPage);
}

function saveFullPage() {
  const screen = document.querySelector(".screen.page8");
  if (!screen) return;

  toggleCaptureUI(true);
  toggleCaptureLogo(true);
  toggleRandomForCapture(true);   // ⭐ 랜덤문구 보이게

  const prevTransform = screen.style.transform;
  const prevOrigin = screen.style.transformOrigin;

  screen.style.transform = "none";
  screen.style.transformOrigin = "top left";

  setTimeout(() => {
    html2canvas(screen, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      windowWidth: screen.offsetWidth,
      windowHeight: screen.offsetHeight
    }).then(canvas => {

      const link = document.createElement("a");
      link.download = "ootd-diary.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toggleCaptureUI(false);
      toggleCaptureLogo(false);
      toggleRandomForCapture(false); // ⭐ 원래대로 숨김

      screen.style.transform = prevTransform;
      screen.style.transformOrigin = prevOrigin;
    });
  }, 120);
}

/* -------------------------------
   📸 랜덤 문구 캡쳐용 토글
-------------------------------- */
function toggleRandomForCapture(show){
  const randomLine = document.getElementById("p8RandomLine");
  const fixedGroup = document.querySelector(".p8-fixed-group");

  if(randomLine){
    randomLine.style.display = show ? "flex" : "";
  }
}







/* -------------------------------
   캐릭터만 저장
-------------------------------- */
const saveCharacterBtn = document.getElementById("saveCharacterBtn");

if (saveCharacterBtn) {
  saveCharacterBtn.addEventListener("click", saveCharacterOnly);
}

function saveCharacterOnly() {
  const character = document.getElementById("p8CharacterArea");
  if (!character) return;

  html2canvas(character, {
    scale: 2,
    useCORS: true,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "ootd-character.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

/* =====================
   튜토리얼 닫기
===================== */
function closeGuide(id){
  const guide = document.getElementById(id);
  if(!guide) return;

  guide.style.display = "none";
}
