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

Resource:
https://github.com/hlnguyensinh/HA_VNLunarCalendar/releases/latest/download/vn_lunar_calendar.js

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

- Cập nhật entity:
	- Home Assistant -> Helpers -> Create Helper:
		- input_text:
			- Name: _`your_input_text`_ (ex: vn_lunar_selected)
			- Advanced settings -> Maximum length: `255`
		- input_boolean
			- Name: _`your_input_boolean`_ (ex: vn_lunar_veg)
		- input_boolean
			- Name: _`your_input_boolean2`_ (ex: vn_lunar_connected)

	```yaml
	- type: custom:vn-lunar-calendar
	  entity_selected_lunar: input_text.vn_lunar_selected
	  entity_isveg: input_boolean.vn_lunar_veg
	  entity_component: input_boolean.vn_lunar_connected
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

Resource:
https://github.com/hlnguyensinh/HA_VNLunarCalendar/releases/latest/download/vn_lunar_calendar.js

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

- Update entity:
	- Home Assistant -> Helpers -> Create Helper:
		- input_text:
			- Name: _`your_input_text`_ (ex: vn_lunar_selected)
			- Advanced settings -> Maximum length: `255`
		- input_boolean
			- Name: _`your_input_boolean`_ (ex: vn_lunar_veg)
		- input_boolean
			- Name: _`your_input_boolean2`_ (ex: vn_lunar_connected)

	```yaml
	- type: custom:vn-lunar-calendar
	  entity_selected_lunar: input_text.vn_lunar_selected
	  entity_isveg: input_boolean.vn_lunar_veg
	  entity_component: input_boolean.vn_lunar_connected
	```
	

### 📦 Integration:
- Auto connect VN Lunar Calendar Component: https://github.com/hlnguyensinh/HA_VNCalendarComponent

---

## 👤 Author & Credits

- Lunar calculation algorithm based on work by **Hồ Ngọc Đức**  
  https://github.com/vanng822/amlich

- Developer: **Nguyen Sinh**
- AI Support: ChatGPT (OpenAI)

---

## 📌 Notes

Personal project, non-commercial.
