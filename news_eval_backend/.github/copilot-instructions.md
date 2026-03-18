<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 프로젝트 개요
- 뉴스 문장 인간평가 웹사이트(연구용) 백엔드.
- Django + Django REST Framework + SQLite.

## 주요 요구사항
- 샘플 제공: 로컬 JSON 파일(프로젝트 상위 폴더의 `news_samples.json`)에서 무작위 샘플 1개 반환
- 임시 정책: `llm_label`이 없으면 `gold_label`을 `llm_label`로 사용
- 응답 저장: DB(SQLite)에 응답 저장(annotator info + sample_id + 설문 응답)
- CORS: 로컬 프론트엔드(기본 5173/3000)에서 접근 가능

## 코드 스타일
- API는 DRF function-based view 또는 APIView 사용 가능하나, 최소 구현을 우선.
- 입력 검증(필수 필드)과 명확한 에러 메시지(JSON)를 제공.
