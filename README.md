[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

# 🇻🇳 VN LUNAR CALENDAR

<p align="center">
  <img src="https://img.shields.io/github/v/release/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/hlnguyensinh/HA_VNLunarCalendar?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue?style=for-the-badge" />
</p>

<p align="center">
  📅 Vietnamese Lunar Calendar for Home Assistant & Web  
  🌙 Elegant • Customizable • Smart Home Ready
</p>

---

## ✨ Demo

<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_day.gif" width="200" alt="VN Lunar Calendar - Day" />
<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_night.gif" width="200" alt="VN Lunar Calendar - Night" />
<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_night2.gif" width="200" alt="VN Lunar Calendar - Night 2" />
<img src="https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/screenshots/demo_themes.gif" width="200" alt="VN Lunar Calendar - Themes" />

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

⚠️ Cảnh báo: Nếu không cập nhật **[VN Lunar Calendar Component](#-integration)**, giao diện VN Lunar Calendar có thể hoạt động không đúng hoặc phát sinh lỗi.
/hacsfiles/HA_VNLunarCalendar/vn_lunar_calendar.js

- HACS -> Custom repositories
    - Repository: `https://github.com/hlnguyensinh/HA_VNLunarCalendar`
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

## Hỏi & trả lời:
1. Frontend và Component là 2 phần tách riêng, chức năng chính là gì?
- Component dành cho người dùng cần lấy các state để làm Automation
- Frontend dành cho phần lớn người dùng chỉ cần show card trên Home Assistant

2. Vậy chỉ cần cài 1 trong 2 được không?
- Được vì 2 phần này có thề chạy độc lập

3. Nếu chạy độc lập vậy Frontend cài thêm Componet thì có liên quan gì?
- Frontend có thể chạy độc lập, nhưng nếu Frontend "thấy" Component thì sẽ ưu tiên kết nối với Component, lúc này việc xử lý cache sẽ do Component phụ trách cho nên cải thiện hiệu suất thay vì sử dụng hoàn toàn trên client. Đặc biệt, tuỳ theo nhu cầu, nếu bạn không muốn Frontend kết nối Component thì dễ dàng bật/tắt tình năng này thông qua `entity_use_component` trong config của Frontend.

---

## 🇬🇧 English

### 💡 Idea

A Vietnamese lunar calendar designed for Home Assistant and web usage.

### 🚀 Features

- Solar & lunar calendar
- Lunar details
- Auto theme
- Custom background
- Support Themes

### 📦 Installation

⚠️ Warning: If the **[VN Lunar Calendar Component](#-integration-1)** is not updated, the VN Lunar Calendar Frontend may not work correctly or could cause errors.

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

| Name                         | Type          | Default value | Description                                    |
| ---------------------------- | ------------- | :-----------: | ---------------------------------------------- |
| `entity_use_component`       | input_boolean |     True      | Use component                                  |
| `entity_component_connected` | input_boolean |      N/A      | Get status component connection                |
| `entity_theme`               | input_select  |   standard    | Calendar Theme, other load file ./themes/\*.js |
| `entity_hide_event`          | input_text    |     False     | Hide lunar events tag                          |
| `entity_textpanel`           | any sensor    |      N/A      | Show value (ex: sensor.vn_calendar_day_type)   |
| `entity_theme_nocache`       | input_boolean |     False     | Not use theme cache                            |
| `entity_readonly`            | input_boolean |     False     | Disable click on calendar                      |
| `entity_hide_goodhour`       | input_boolean |     False     | Hide good hour tag                             |
| `entity_hide_goodday`        | input_boolean |     True      | Hide good day tag                              |
| `entity_hide_event`          | input_boolean |     False     | Hide lunar events tag                          |
| `entity_hide_isveg`          | input_boolean |     True      | Hide vegetarian day status tag                 |

### 📦 Integration:

- Auto connect VN Lunar Calendar Component: https://github.com/hlnguyensinh/HA_VNCalendarComponent

---

## FAQs:
1. Frontend and Component are two separate parts; what are their main functions?
- Component is for users who need to retrieve states for automation.
- Frontend is for most users who only need to display cards on Home Assistant.

2. So, can I install only one of them?
- Yes, because these two parts can run independently.

3. If they run independently, what's the connection between installing Component in Frontend?
- Frontend can run independently, but if Frontend "sees" Component, it will prioritize connecting to Component. In this case, Component will handle caching, thus improving performance instead of relying entirely on the client. Specifically, depending on your needs, if you don't want Frontend to connect to Component, you can easily enable/disable this feature via `entity_use_component` in the Frontend's configuration.

## 👤 Author & Credits

- [Lunar calculation algorithm based on work by **Hồ Ngọc Đức**](https://github.com/vanng822/amlich)

- Developer: **Nguyen Sinh**
- AI Support: ChatGPT (OpenAI)

---

## 📌 Notes

Personal project, non-commercial.
