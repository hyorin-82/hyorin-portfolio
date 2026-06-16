// =====================================================
// 커스텀 커서: 마우스 위치에 따라 원 이동
// =====================================================
const cursor = document.getElementById('customCursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});


// =====================================================
// 1단계: 로딩 (퍼센트 카운트 + MIN HYORIN 색 차오름)
// =====================================================
let count = 0;
const percentEl = document.getElementById('percent');
const fillEl = document.getElementById('fillTitle');
const frameEl = document.getElementById('frame');
const mainScreenEl = document.getElementById('mainScreen');
 
// 20ms마다 한 번씩 실행 (총 2초 동안 0 -> 100)
const introTimer = setInterval(() => {
  count++;
  percentEl.textContent = count + '%';
 
  // 그라디언트의 흰색/검은색 경계선을 현재 퍼센트 위치로 이동
  // (아래에서부터 흰색이 차오르고, 그 위쪽은 검은색)
  const stop1 = count;
  const stop2 = Math.min(count + 1, 100);
  fillEl.style.backgroundImage =
    `linear-gradient(to top, #fff 0%, #fff ${stop1}%, #000 ${stop2}%, #000 100%)`;
 
  if(count >= 100){
    clearInterval(introTimer);
 
    // 100% 상태로 1초 동안 멈춰있기
    setTimeout(() => {
      frameEl.classList.add('leave'); // 테두리 + MIN HYORIN + 퍼센트 사라짐
 
      // ===== 2단계: SECURITY ENGINEER 메인 화면 떠오름 =====
      setTimeout(() => {
        mainScreenEl.classList.add('show');
      }, 300);
    }, 1000);
  }
}, 20);
 
 
 
 
// =====================================================
// Timeline Swiper 슬라이더
// =====================================================
new Swiper('.tl-swiper', {
  slidesPerView: 3,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  navigation: {
    prevEl: '.tl-prev',
    nextEl: '.tl-next'
  }
});


// =====================================================
// 스크롤 페이드인: 들어올 때 순서대로, 나갈 때 한꺼번에
// =====================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.style.transitionDelay = e.target.dataset.delay || '0s'; // 등장: 각자 딜레이
      e.target.classList.add('visible');
    } else {
      e.target.style.transitionDelay = '0s'; // 사라질 땐 딜레이 없이
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// =====================================================
// Projects: GitHub API로 레포 목록 불러와 카드 생성
// =====================================================
const projGrid = document.getElementById('projGrid');

// GitHub API: hyorin-82 계정의 공개 레포 목록 요청
fetch('https://api.github.com/users/hyorin-82/repos?sort=created&direction=asc')
  .then(res => res.json())         // 응답을 JSON으로 변환
  .then(repos => {
    if (repos.length === 0) {
      // 레포가 없으면 안내 문구 표시
      projGrid.innerHTML = '<p class="proj-message">등록된 프로젝트가 없습니다.</p>';
      return;
    }

    // 언어별 색상 매핑
    const langColors = {
      'JavaScript': '#f1e05a', 'TypeScript': '#3178c6',
      'Python': '#3572a5',     'HTML': '#e34c26',
      'CSS': '#563d7c',        'Java': '#b07219',
      'C': '#555555',          'C++': '#f34b7d',
      'C#': '#178600',         'Go': '#00add8',
    };

    // 레포마다 카드 하나씩 만들기
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'proj-row';

      const lang      = repo.language || '';
      const color     = langColors[lang] || 'rgba(255,255,255,0.4)';
      const stars     = repo.stargazers_count;
      const updated   = new Date(repo.updated_at)
                          .toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' });
      const descText  = repo.description || '—';

      card.innerHTML = `
        <div class="proj-row-left">
          <p class="proj-card-name">${repo.name}</p>
          <div class="proj-card-meta">
            ${lang ? `<span class="proj-lang"><span class="lang-dot" style="background:${color}"></span>${lang}</span>` : ''}
            ${stars ? `<span class="proj-stat">★ ${stars}</span>` : ''}
            <span class="proj-updated">${updated}</span>
          </div>
          <p class="proj-card-desc">${descText}</p>
        </div>
        <div class="proj-row-right">
          <a class="proj-card-link" href="${repo.html_url}" target="_blank" rel="noopener">VIEW ON<br>GITHUB →</a>
        </div>
      `;

      projGrid.appendChild(card);
    });
  })
  .catch(() => {
    // 네트워크 오류 등 실패 시
    projGrid.innerHTML = '<p class="proj-message">프로젝트를 불러오지 못했습니다.</p>';
  });


// =====================================================
// 메뉴 열기/닫기 + 메뉴 클릭 시 해당 섹션으로 스크롤
// =====================================================
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('menuPanel').classList.add('open');
});

document.getElementById('closeBtn').addEventListener('click', () => {
  document.getElementById('menuPanel').classList.remove('open');
});
 
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
 
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
 
    document.getElementById('menuPanel').classList.remove('open');
 
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  });
});