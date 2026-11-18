# Petting Friends (쓰담쓰담)

[English](README.md) | **한국어**

Orca 오른쪽 사이드바에서 귀여운 친구를 쓰다듬는 예능 플러그인.

- 친구 위에서 마우스를 누른 채 **좌우로 문지르면** 쓰다듬어집니다. 방향을 바꿀 때마다 한 번의 쓰담.
- 쓰다듬을수록 기분 게이지가 차고, 가득 차면 골골 모드가 됩니다.
- 친구는 네 마리: 몽실이, 토토(토끼), 반반이(고양이), 날다(하늘다람쥐). 아래 버튼으로 고릅니다.
- 쓰담 횟수와 고른 친구는 플러그인 자체 저장소에 남습니다 (`storage:own`).
- 작게 보기: 친구 오른쪽 위의 `−` 버튼을 누르면 친구만 200px 크기로 남습니다 (`+`로 되돌림). 패널이 아주 좁거나 낮으면 자동으로 작게 바뀝니다.
- 키보드: 친구에 포커스를 두고 Space/Enter.
- 언어: Orca 설정 → 플러그인 → Petting Friends의 **Language / 언어**에서 Auto / 한국어 / English를 고릅니다 (`settings:own`). Auto는 Orca의 언어를 따릅니다.

## 구조

TypeScript로 작성했고 **빌드 단계가 없습니다**. Orca가 `.ts`를 불러올 때 직접 변환합니다.

| 파일                   | 역할                                                      |
| ---------------------- | --------------------------------------------------------- |
| `orca-plugin.json`     | 매니페스트: 패널 등록, 요청 권한                          |
| `src/panel.ts`         | 패널 진입점: 화면 구성, 포인터 입력, 기분 게이지, 저장    |
| `src/characters.ts`    | 친구들의 SVG 그림 (`CHARACTERS` 배열)                     |
| `src/strokes.ts`       | 쓰다듬기 판정 (DOM 없는 순수 로직)                        |
| `src/*.test.ts`        | 판정과 언어 선택 테스트                                   |
| `src/styles.ts`        | 스타일과 반응 애니메이션                                  |
| `src/i18n.ts`          | 언어별 문구와 언어 선택 로직 (언어 추가 방법은 파일 주석) |

## Orca에서 돌려 보기

Orca 데스크톱 앱이 켜져 있어야 합니다.

```sh
orca plugin dev watch . --check
```

1. 처음에는 승인이 필요해서 종료 코드 3으로 끝나며, 요청 권한 목록과 `--approve <지문>`이 붙은 명령을 출력합니다.
   권한은 세 가지입니다: 샌드박스 패널에서 코드 실행, 플러그인 자체 저장소 사용, 플러그인 자체 설정 읽기/쓰기.
2. 내용을 확인하고 출력된 명령을 그대로 다시 실행합니다.
   ```sh
   orca plugin dev watch . --check --approve ap1-...
   ```
3. Orca 오른쪽 사이드바 활동 표시줄에서 별 아이콘(Petting Friends)을 누릅니다.
   터미널에서 열려면 `orca plugin open local.petting-friends --panel petting-friends`.
4. watch가 떠 있는 동안 파일을 저장하면 패널이 바로 다시 로드됩니다. 오류는 watch 출력에 `[frame] 파일:줄` 형태로 나옵니다.
5. `Ctrl-C`로 watch를 끝내면 플러그인도 내려갑니다.

코드만 고치는 동안에는 다시 승인하지 않아도 됩니다. 권한을 추가하면 새 지문으로 다시 승인해야 합니다.

## 기여하기

```sh
npm install        # 타입 체크용 typescript만 설치
orca plugin types . # .orca/types 에 Orca 타입 생성 (dev watch도 해 줍니다)
npm run check      # 타입 체크 + 테스트 + 매니페스트 검증
```

- 변환 과정은 타입을 검사하지 않으니, 올리기 전에 `npm run check`를 돌려 주세요.
- import는 `orca`, `orca/*`, 상대 경로만 됩니다. npm 패키지는 불러올 수 없습니다.
- 네트워크 요청은 막혀 있습니다. 그림은 인라인 SVG로 넣습니다.
- 색은 `--orca-*` 테마 변수를 쓰고, 털 색과 하트만 고정 색입니다.

### 친구 추가하기

`src/characters.ts`의 `CHARACTERS`에 항목을 하나 추가하면 고르기 버튼까지 자동으로 생깁니다.
그림은 `viewBox="0 0 200 200"` 기준이고, 반응이 먹히려면 정해진 부위 클래스를 써야 합니다:
`.tail`, `.head`, `.ear.ear-l` / `.ear.ear-r`, 그리고 `face()`가 만들어 주는 눈·입·볼.
이름과 울음소리는 모든 언어로 채워야 합니다 (빠지면 컴파일러가 알려 줍니다).
캐릭터는 직접 디자인한 것만 받습니다 (남의 캐릭터 그림은 넣지 말아 주세요).

### 언어 추가하기

`src/i18n.ts`의 `LANGS`와 `STRINGS`, 각 친구의 `name`/`sound`에 언어를 추가하고,
`orca-plugin.json`의 `language` 설정 `enum`/`enumLabels`에도 넣습니다.
문서를 고칠 때는 `README.md`(영어)와 `README.ko.md`를 함께 고쳐 주세요.
