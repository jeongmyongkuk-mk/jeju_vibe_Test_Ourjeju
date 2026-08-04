# jeju_vibe_Test_Ourjeju

# Max Jeju — Landing Page

로컬에서 미리보기:

```bash
# Windows: 간단한 HTTP 서버 (파워셀)
python -m http.server 8000
# 또는
npx http-server . -p 8000
```

브라우저에서 `http://localhost:8000` 열면 `index.html`을 확인할 수 있습니다.

다음 단계 제안:
- 로고와 이미지 자산 추가
- 폰트(예: Noto Sans KR) 로컬 또는 CDN 연결
- 세부 애니메이션과 접근성 개선

## GitHub에 업로드하기 (자동 스크립트 포함)

1) 원격 저장소 URL 준비(예: `git@github.com:jeongmyongkuk-mk/jeju_vibe_Test_Ourjeju.git`)
2) 스크립트에 실행 권한 부여(Windows는 Git Bash 또는 WSL에서 실행 권장):

```bash
chmod +x scripts/github-deploy.sh
./scripts/github-deploy.sh <remote-url>
```

3) 인증 문제:
- SSH 방식이면 로컬에 SSH 키가 설정되어 있어야 합니다.
- HTTPS를 사용하려면 `https://<TOKEN>@github.com/username/repo.git` 형태로 원격을 지정하거나
	`git push`를 실행할 때 사용자명/토큰을 입력해야 합니다.

스크립트는 로컬에 `.git`이 없으면 `git init` → 커밋 → `main` 브랜치로 푸시합니다.
기존 `.git`이 있으면 `maxjeju-deploy` 브랜치를 생성하여 푸시합니다. 원하시면 스크립트를
원격 브랜치 이름이나 커밋 메시지를 변경하도록 수정해 드립니다.
