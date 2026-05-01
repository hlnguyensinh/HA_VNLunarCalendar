# Changelog

## [0.0.1] - 2026-04-25
- Initial release
- Lunar calendar display
- Solar terms
- Theme switching (day/night/full moon)

## [0.0.2] - 2026-04-26
- Update background links to github.
> Ex: /local/widget/vn_lunar_calendar/assets/whiteflower.jpg -> https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/whiteflower.jpg

## [0.0.3] - 2026-04-27
- Hide vegetarian day icon to avoid overflowing the frame

## [0.0.4] - 2026-04-30
- Re-render calendar when a new date changes.
- For test:
	- Send JSON to input_text entity
	- Update vegegetarian status to input_boolean entity
	```
	entity_selected_lunar: input_text.your_input_text
	entity_isveg: input_boolean.your_input_boolean
	```
	
## [1.0.0] - 2026-05-01
- Auto detect and connect to VN Calendar Component (default), or run standalone if the component unavailable
- Add new entity to Update state of connected component:
	```
	entity_component: input_boolean.vn_lunar_connected
	```
	