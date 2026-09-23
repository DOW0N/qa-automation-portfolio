# QA Automation Portfolio



## 1. 프로젝트 소개



API 테스트 자동화와 웹 UI 테스트 자동화를 통해 주요 기능의 정상 동작, 회귀 오류, 화면 변화 및 네트워크 요청 실패 여부를 검증하는 QA 자동화 포트폴리오입니다.



테스트 작성뿐 아니라 실패 원인 분석, 테스트 범위 조정, CI 환경 실행 결과 확인까지 진행했습니다.



## 2. 사용 기술



* Postman

* Newman

* Playwright

* JavaScript

* GitHub Actions

* Git / GitHub



## 3. API 테스트 자동화



### 테스트 도구



* Postman Collection

* Newman CLI

* GitHub Actions



### 테스트 시나리오



1\. Login - Success



&#x20;  * 정상 로그인 요청 검증

2\. Get User Cart (Auth)



&#x20;  * 인증 정보가 포함된 장바구니 조회 검증

3\. Login - Fail



&#x20;  * 로그인 실패 상황 검증

4\. Get User Cart - No Auth



&#x20;  * 인증 정보가 없는 요청 검증



### 실행 결과



Newman을 사용하여 로컬 환경에서 API 테스트를 실행하고 HTML 리포트를 생성했습니다.



GitHub Actions 실행에서는 외부 API 환경에서 `403 Forbidden` 응답이 확인되었습니다. 해당 결과를 무조건 성공으로 처리하지 않고, 로컬 환경과 CI 환경의 차이를 확인할 수 있는 이슈로 기록했습니다.



## 4. UI 테스트 자동화



### 테스트 도구



* Playwright

* Chromium

* Firefox

* WebKit



### 주요 테스트



* 로그인 후 Secure Area 진입 확인

* 페이지 타이틀 검증

* Logout 버튼 존재 및 동작 확인

* 브라우저별 페이지 로딩 성능 회귀 테스트

* 내부 리소스 요청 실패 여부 확인

* UI 스냅샷 회귀 테스트



### 테스트 결과



```text

31 passed

2 skipped

46.5s

```



브라우저별 테스트를 실행하여 주요 기능과 화면 동작을 검증했습니다.



## 5. 네트워크 요청 검증



### 목적



화면이 정상적으로 표시되더라도 내부 리소스 요청이 실패하는 상황을 확인하기 위해 네트워크 요청을 감시했습니다.



### 검증 방식



* Playwright의 `requestfailed` 이벤트 활용

* 테스트 대상 서비스의 호스트 기준으로 요청 범위 제한

* 내부 리소스 요청 실패 발생 시 테스트 실패 처리



외부 분석 및 추적 서비스 요청과 테스트 대상 서비스의 요청을 구분하여 검증 범위를 조정했습니다.



이를 통해 실제 테스트 대상과 관련 없는 외부 요청 실패가 테스트 결과에 과도하게 영향을 주지 않도록 개선했습니다.



## 6. UI 스냅샷 회귀 테스트



### 목적



코드 변경으로 인한 주요 화면의 시각적 변화를 조기에 발견합니다.



### 설계



* 주요 화면의 기준 스냅샷 저장

* 이후 테스트 실행 결과와 기준 이미지 비교

* UI 변경으로 인한 시각적 차이 확인



스냅샷 테스트를 통해 기능 동작뿐 아니라 화면 구성의 변화도 검증할 수 있도록 구성했습니다.



## 7. 실패 테스트를 유지한 이유



일부 테스트에서는 브라우저별 성능 기준을 초과하는 결과가 발생할 수 있도록 임계값을 설정했습니다.



모든 테스트를 무조건 통과시키는 것보다, 사전에 정의한 기준을 초과하면 실패하도록 구성하는 것이 회귀 테스트의 목적에 부합한다고 판단했습니다.



QA의 역할은 문제를 숨기는 것이 아니라 문제를 발견하고, 원인을 분석하며, 개선 사항을 기록하는 것입니다.



## 8. 실행 방법



### API 테스트



```bash

cd api-test

newman run "QA API Automation.postman_collection.json" -e environment.json

```



### UI 테스트



```bash

cd playwright-ui-test

npm install

npx playwright test

```



### Playwright 리포트 확인



```bash

npx playwright show-report

```



## 9. CI/CD



GitHub Actions를 사용하여 API 테스트 자동 실행 환경을 구성했습니다.



CI 실행 결과에서 발생한 `403 Forbidden` 응답을 확인하고, 로컬 실행 결과와 CI 환경의 차이를 기록했습니다.



## 10. 프로젝트에서 수행한 작업



* API 테스트 시나리오 작성

* Newman을 활용한 CLI 테스트 실행

* Playwright 기반 UI 자동화 테스트 작성

* 브라우저별 회귀 테스트 구성

* UI 스냅샷 테스트 구성

* 네트워크 요청 실패 검증

* 테스트 실패 원인 분석

* GitHub Actions 자동 실행 구성

* 테스트 결과 및 알려진 이슈 정리




