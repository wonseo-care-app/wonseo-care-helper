# wonseo #3

어린이집/유치원 보육교사가 키워드만 넣어 알림장, 보육일지, 종합 발달평가, 신입 적응일지 초안을 빠르게 만드는 모바일 우선 웹앱입니다.

## 주요 기능

- 첫 화면에서 `알림장 쓰기`, `보육일지 쓰기`, `발달평가 쓰기`, `적응일지 쓰기` 선택
- 아이 프로필 저장: 아동명, 성별, 생년월일, 반명, 만 나이, 특이사항
- 같은 아이 선택 시 작성 화면에 기본 정보 자동 입력
- 생성 결과를 직접 수정하고 `복사하기`, `저장하기`
- `이전 작성글 보기`로 브라우저에 저장된 글 다시 불러오기
- Netlify Functions에서 OpenAI API 호출: 프론트엔드에 API 키가 노출되지 않음
- PWA manifest와 service worker 포함: 휴대폰 홈 화면에 추가 가능

## 예시 HWP 문체 반영

첨부 HWP 5개를 `PrvText`와 `BodyText/Section0`에서 추출해 문체를 확인했습니다.

- 종합 발달평가: `~할 수 있다`, `~하는 편이다`, `교사의 도움을 받아 ~한다`, `반복적인 경험을 통해 ~가 가능하다` 문체
- 신입 적응일지: 등원 초기 반응, 울음 변화, 놀이 참여, 교사 반응, 친구와의 상호작용이 보이는 일차별 기록
- 주간 보육일지: 시간대별 일과표는 제외하고 놀이평가, 일상생활, 안전/건강/영양, 다음날 지원계획 중심

프롬프트 템플릿은 `src/lib/prompts.ts`에 문서 유형별로 분리되어 있습니다.

## 설치와 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 환경변수

로컬에서는 `.env.example`을 참고해 `.env.local`을 만듭니다.

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-mini
```

`OPENAI_API_KEY`가 없으면 로컬 테스트용 예시 문장 생성기로 동작합니다. 실제 배포에서는 Netlify 환경변수를 설정해야 AI 생성이 작동합니다.

## Netlify 배포

1. GitHub 저장소에 코드를 올립니다.
2. Netlify에서 `Add new site` → `Import an existing project`를 선택합니다.
3. Build settings는 `netlify.toml`이 자동으로 적용합니다.
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions`
4. Netlify site settings → `Environment variables`에 아래 값을 추가합니다.
   - `OPENAI_API_KEY`: OpenAI API 키
   - `OPENAI_MODEL`: `gpt-5.4-mini` 또는 사용할 모델명
5. Deploy 후 생성된 Netlify 영구 링크를 카카오톡으로 보내면 휴대폰 브라우저에서 바로 사용할 수 있습니다.

## OpenAI 호출 구조

프론트엔드는 `/api/generate`로만 요청합니다. Netlify redirect가 이를 `/.netlify/functions/generate`로 연결하고, 함수 안에서 `OPENAI_API_KEY`로 OpenAI Responses API를 호출합니다.

관련 공식 문서:

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses/create?api-mode=responses)
- [GPT-5.4 mini 모델](https://developers.openai.com/api/docs/models/gpt-5.4-mini)

## 파일 구조

```text
src/app                 Next.js App Router
src/components          모바일 UI 컴포넌트
src/lib                 문서 설정, 샘플 데이터, 저장소, 프롬프트, 로컬 초안 생성
netlify/functions       서버리스 AI 생성 함수
public                  PWA 아이콘과 service worker
```

## 문서별 주의사항

- 보육일지는 시간대별 일과표를 생성하지 않습니다.
- 발달평가는 반드시 6개 영역으로 나누어 생성합니다.
- 적응일지는 최소 5일 이상 입력해야 하며 마지막에 적응기간 종합결과를 생성합니다.
- 알림장은 부모님이 읽는 글이므로 내부문서처럼 딱딱하지 않게 생성합니다.
