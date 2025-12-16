# 🌦️ Gild Weather (Premium Gold Theme)

> 고급스러운 골드 테마 디자인과 위치 기반 날씨 정보를 제공하는 프리미엄 웹 애플리케이션입니다.

![Preview](https://via.placeholder.com/800x400?text=Gild+Weather+Preview)

## ✨ Key Features

- **📍 위치 기반 날씨**: 사용자 권한 획득 후 즉시 현재 위치의 날씨를 표시합니다.
- **🏙️ 대체 도시 검색**: 위치 권한 거부 시, 원하는 도시를 직접 검색할 수 있습니다.
- **🎨 Premium Gold UI**: 다크 모드 배경에 골드 메탈릭 포인트를 더한 세련된 디자인.
- **📊 상세 정보**: 체감 온도, 습도, 풍속, 일출/일몰 시간을 직관적인 그리드로 제공.
- **🔄 단위 변환**: 섭씨(Metric) / 화씨(Imperial) 즉시 전환.
- **⚡ Performance**: API 응답 캐싱(LocalStorage)으로 불필요한 호출 최소화.

## 🛠 Tech Stack

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Theme Config)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Custom React Hooks

## 🚀 Getting Started

### 1. Installation

```bash
# Clone Repository
git clone https://github.com/username/weather-app.git

# Install Dependencies
npm install
```

### 2. Environment Setup

프로젝트 루트에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 입력하세요.

```env
# .env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

## 📂 Project Structure

```
src/
├── components/      # UI Components (Header, Cards, etc.)
├── hooks/           # Custom Hooks (useWeather)
├── services/        # API Layer & Caching Logic
├── types/           # TypeScript Definitions
├── utils/           # Helper Functions
└── App.tsx          # Main Entry Point
```

## ⚠️ Notes

- 이 프로젝트는 **OpenWeather API**를 사용합니다. 무료 플랜 사용 시 API 호출 제한이 있을 수 있습니다.
- API 키는 클라이언트 측 환경변수(`VITE_`)로 노출되어 있습니다. 프로덕션 환경에서는 **Backend Proxy** 구축을 강력히 권장합니다.
