# Changelog

## [0.0.1] - 2026-04-25
- Initial release
- Lunar calendar display
- Solar terms
- Theme switching (day/night/full moon)

## [0.0.2] - 2026-04-26
- Update background links to github.
> Ex: /local/widget/vn_lunar_calendar/assets/whiteflower.jpg → https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/whiteflower.jpg

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
	
## [1.1.0] - 2026-05-04

### Function:
- Get good hours in a day with current time
- Get status "Hoàng đạo/Hắc đạo" realtime 

### Entity:
- Add entity input_boolean for disable click on calendar: `entity_uireadonly` (default: false)
- Add entity input_boolean for hide good hour: `entity_hide_goodhour` (default: false)
- Add entity input_boolean for hide good day: `entity_hide_goodday` (default: true)
- Add entity input_boolean for hide events: `entity_hide_event` (default: false)
- Add entity input_boolean for hide is vegetarian day status: `entity_hide_isveg` (default: true)
- Add entity input_boolean for no background: `entity_nobg`  (default: false)

### Example
```
- type: custom:vn-lunar-calendar
  entity_hide_goodhour: input_boolean.vn_lunar_hide_goodhour
  entity_hide_goodday: input_boolean.vn_lunar_hide_goodday
  entity_hide_events: input_boolean.vn_lunar_hide_events
  entity_hide_isveg: input_boolean.vn_lunar_hide_isveg
  entity_nobg: input_boolean.vn_lunar_nobg
  entity_readonly: input_boolean.vn_lunar_calendar_readonly
```

## [1.1.1] & [1.1.2] - 2026-05-04
- Update component connection
- Update name config's entity

## [1.2.0] - 2026-05-07
- Removed `entity_nobg`
- Change name `entity_component` → `entity_component_connected` (add '_connected')
- Change name `entity_hide_events` → `entity_hide_event` (remove 's')
- Add new `entity_theme`: choose theme for VN Lunar Calendar (ready support more theme), with values:
	- green
	- sample
	- standard (default)
- Add new `entity_use_component`: use component (True) or not (False)
- Add new `entity_textpanel`: useful for show entity's state, example: sensor.vn_calendar_day_type
- Add new `entity_theme_nocache`: no cache themes, turn on to re-design, turn off to get cache for improve performance

### Dynamic themes:
- Default "standard" theme, if you want to custom, please add file .js to ./themes/

### Summary:

| Name                         | Type          | Default value | Description                                   | ViewOnly |
| ---------------------------- | ------------- |:-------------:| --------------------------------------------- |:--------:| 
| `entity_use_component`       | input_boolean | True          | Use component                                 |          |
| `entity_component_connected` | input_boolean | N/A           | Get status component connection               | x        |
| `entity_theme`               | input_select  | standard      | Calendar Theme, other load file ./themes/*.js |          |
| `entity_hide_event`          | input_text    | False         | Hide lunar events tag                         |          |
| `entity_textpanel`           | any sensor    | N/A           | Show value (ex: sensor.vn_calendar_day_type)  |          |
| `entity_theme_nocache`       | input_boolean | False         | Not use theme cache                           |          |