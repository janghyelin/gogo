let webcam; // 웹캠 변수
let shotButton, crosshair, loadingImage, addressModal, matchModal, noMatchModal, matchB, noMatchB, messageImage; // 이미지 변수
let isCrosshairVisible = true; // Crosshair 표시 여부
let isLoading = false; // 로딩 상태
let isAddressModalVisible = false; // Address_modal 표시 여부
let isMatchModalVisible = false; // Match 모달 표시 여부
let isNoMatchModalVisible = false; // No Match 모달 표시 여부
let isFinalMessageVisible = false; // 최종 메시지 화면 표시 여부

let mouseCheck = 0; // Shot Button 클릭 상태
let isLastMatch = false; // 이전 상태를 저장하는 변수 (초기값: 실패로 시작)

function preload() {
  // 이미지 로드
  headerImage = loadImage("img/Top.png");
  shotButton = loadImage("img/shot_Button.png");
  crosshair = loadImage("img/Crosshair.png");
  loadingImage = loadImage("img/loading.png");
  addressModal = loadImage("img/Address_modal.png");
  matchModal = loadImage("img/match.png");
  noMatchModal = loadImage("img/no_match.png");
  matchB = loadImage("img/match_b.png"); // match_b 버튼
  noMatchB = loadImage("img/no_match_B.png"); // no_match_B 버튼
  messageImage = loadImage("img/messege.png"); // 최종 메시지 화면
}

function setup() {
  createCanvas(375, 812); // 캔버스 크기 설정

  // 웹캠 생성
  webcam = createCapture(VIDEO); // 웹캠 활성화
  webcam.size(375, 544); // 웹캠 크기 설정
  webcam.hide(); // HTML 기본 요소 숨김
}

function draw() {
  if (isFinalMessageVisible) {
    // 최종 메시지 화면 표시 (다른 모든 화면 숨김)
    background(0);
    image(messageImage, 0, 0, 375, 812); // messege.png 표시
    return; // 다른 화면 그리지 않음
  }

  background(0); // 검정 배경

  // 웹캠 화면
  image(webcam, 0, 110, 375, 544);

  // Crosshair 표시 여부에 따라 렌더링
  if (isCrosshairVisible) {
    image(crosshair, 66, 248, 244, 244);
  }

  // Shot Button (하단 중앙)
  image(shotButton, 148, 681, 80, 80);

  // 로딩 중 이미지 표시
  if (isLoading) {
    fill(0, 0, 0, 150); // 반투명 배경
    rect(0, 0, width, height); // 화면 전체 덮기
    image(loadingImage, 110, 300, 170, 130);
  }

  // Address_modal 표시
  if (isAddressModalVisible) {
    image(addressModal, 15, 110, 360, 160);
  }

  // Match 모달 및 버튼 표시
  if (isMatchModalVisible) {
    image(matchModal, 23, 312, 330, 200); // Match 모달
    image(matchB, 274, 422, 43, 29); // Match 버튼
  }

  // No Match 모달 및 버튼 표시
  if (isNoMatchModalVisible) {
    image(noMatchModal, 23, 312, 330, 200); // No Match 모달
    image(noMatchB, 274, 422, 43, 29); // No Match 버튼
  }
}

function mousePressed() {
  // 최종 메시지 화면 상태일 때, 클릭 시 초기화
  if (isFinalMessageVisible) {
    resetState();
    return; // 다른 클릭 처리 생략
  }

  // 로딩 중에는 클릭을 처리하지 않음
  if (isLoading) return;

  // Shot Button 클릭 감지
  if (
    mouseX > 148 &&
    mouseX < 148 + 80 && // x 위치
    mouseY > 681 &&
    mouseY < 681 + 80 // y 위치
  ) {
    if (mouseCheck === 0) {
      isCrosshairVisible = false; // Crosshair 숨기기
      showLoadingScreen(); // 로딩 화면 표시
      mouseCheck = 1;
    } else if (mouseCheck === 1) {
      isAddressModalVisible = false; // Address_modal 숨기기
      isLoading = false; // 로딩 화면 표시 안 함
      showMatchOrNoMatch(); // Match/No Match 모달 표시
      mouseCheck = 2;
    }
  }

  // Match 버튼 클릭 처리
  if (
    mouseX > 274 &&
    mouseX < 274 + 43 && // Match 버튼 x 위치
    mouseY > 422 &&
    mouseY < 422 + 29 && // Match 버튼 y 위치
    isMatchModalVisible
  ) {
    isMatchModalVisible = false; // Match 모달 숨기기
    isFinalMessageVisible = true; // 최종 메시지 화면 표시
  }

  // No Match 버튼 클릭 처리
  if (
    mouseX > 274 &&
    mouseX < 274 + 43 && // No Match 버튼 x 위치
    mouseY > 422 &&
    mouseY < 422 + 29 && // No Match 버튼 y 위치
    isNoMatchModalVisible
  ) {
    isNoMatchModalVisible = false; // No Match 모달 숨기기
    isAddressModalVisible = true; // Address_modal 다시 표시
    mouseCheck = 1; // 두 번째 클릭 상태로 복귀
  }
}

function showLoadingScreen() {
  isLoading = true; // 로딩 상태 활성화

  // 1초 후 로딩 상태 해제 및 Address_modal 표시
  setTimeout(() => {
    isLoading = false; // 로딩 상태 해제
    isAddressModalVisible = true; // Address_modal 표시
  }, 1000);
}

function showMatchOrNoMatch() {
  if (isLastMatch) {
    // 이전에 Match였다면 이번에는 No Match
    isMatchModalVisible = false;
    isNoMatchModalVisible = true;
  } else {
    // 이전에 No Match였다면 이번에는 Match
    isMatchModalVisible = true;
    isNoMatchModalVisible = false;
  }

  // 상태를 반대로 변경
  isLastMatch = !isLastMatch;
}

function resetState() {
  // 모든 상태 초기화
  isCrosshairVisible = true;
  isLoading = false;
  isAddressModalVisible = false;
  isMatchModalVisible = false;
  isNoMatchModalVisible = false;
  isFinalMessageVisible = false;
  mouseCheck = 0; // Shot 버튼 상태 초기화
}