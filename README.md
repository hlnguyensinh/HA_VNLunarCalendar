[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

# 🇻🇳 VN LUNAR CALENDAR

<p align="center">
  <img src="https://img.shields.io/github/v/release/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20with-ChatGPT-orange?style=for-the-badge" />
</p>

<p align="center">
  📅 Vietnamese Lunar Calendar for Home Assistant & Web  
  🌙 Elegant • Customizable • Smart Home Ready
</p>

---

## ✨ Demo

<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_day.gif" width="300" alt="VN Lunar Calendar - Day" />
<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_night.gif" width="300" alt="VN Lunar Calendar - Night" />
<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_night2.gif" width="300" alt="VN Lunar Calendar - Night 2" />

---

## 🇻🇳 Tiếng Việt

### 💡 Ý tưởng

Xuất phát từ nhu cầu cá nhân trong việc tìm kiếm các ngày chay để “tịnh tâm”, dự án này mang đến một lịch âm trực quan, đẹp mắt và dễ tích hợp vào hệ sinh thái nhà thông minh.

### 🚀 Tính năng

- Lịch dương + âm
- Thông tin âm lịch (ngày, tháng, năm, tiết khí)
- Hoàng đạo / Hắc đạo
- Auto theme (day / night / full moon)
- Custom background
- Chuyển tháng

### 📦 Cài đặt

- HACS -> Custom repositories
  - Repository: `https://github.com/hlnguyensinh/HA_VNLunarCalendar/releases/latest/download/vn_lunar_calendar.js`
  - Type: `Dashboard`

- Đơn giản:

  ```yaml
  - type: custom:vn-lunar-calendar
  ```

- Tùy chỉnh background:

  ```yaml
  - type: custom:vn-lunar-calendar
    background_day: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/whiteflower.jpg
    background_night: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_fullmoon1.jpg
    background_nighthalf: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_halfmoon.jpg
  ```


### 📦 Integration:

- Tự động kết nối VN Lunar Calendar Component nếu HA đã cài sẵn component: https://github.com/hlnguyensinh/HA_VNCalendarComponent

---

## 🇬🇧 English

### 💡 Idea

A Vietnamese lunar calendar designed for Home Assistant and web usage.

### 🚀 Features

- Solar & lunar calendar
- Lunar details
- Auto theme
- Custom background

### 📦 Installation

- HACS -> Custom repositories
  - Repository: `https://github.com/hlnguyensinh/HA_VNLunarCalendar/releases/latest/download/vn_lunar_calendar.js`
  - Type: `Dashboard`

- Basic:

  ```yaml
  - type: custom:vn-lunar-calendar
  ```

- Change background:

  ```yaml
  - type: custom:vn-lunar-calendar
    background_day: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/whiteflower.jpg
    background_night: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_fullmoon1.jpg
    background_nighthalf: https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_halfmoon.jpg
  ```
 
### Entity table

| Name | Type | Default value | Description
| --- | --- |:---:| --- |
|entity_component | input_boolean | N/A | Get status component connection
|entity_nobg | input_boolean | False | Remove background card
|entity_readonly | input_boolean | False | Disable click on calendar
|entity_hide_goodhour | input_boolean | False | Hide good hour tag
|entity_hide_goodday | input_boolean | True | Hide good day tag
|entity_hide_events | input_boolean | False | Hide lunar events tag
|entity_hide_isveg | input_boolean | True | Hide vegetarian day status tag


### 📦 Integration:

- Auto connect VN Lunar Calendar Component: https://github.com/hlnguyensinh/HA_VNCalendarComponent

---

## 👤 Author & Credits

- [Lunar calculation algorithm based on work by **Hồ Ngọc Đức**](https://github.com/vanng822/amlich)

- Developer: **Nguyen Sinh**
- AI Support: ChatGPT (OpenAI)

---

## 📌 Notes

Personal project, non-commercial.
