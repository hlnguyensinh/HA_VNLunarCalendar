// ======================= COMMON =======================
const TIME_ZONE = 7;
//const VERSION = "0.0.48";

// console.log(`VN Lunar Calendar version: ${VERSION}`);
// ======================= VNCalendarComponent =======================
const DOMAIN = "vn_calendar_component";
const SERVICE_TODAY = "today";
const SERVICE_GET_DAY = "get_day";
const SERVICE_GET_MONTH = "get_month";
const SERVICE_GET_YEAR = "get_year";

class VNCalendarComponent {
  constructor(hass) {
    this._hass = hass;
  }

  async get_today() {
    const result = await this._hass.callService(DOMAIN, SERVICE_TODAY, {}, {}, true, true);

    return result.response;
  }

  async get_day(dd, mm, yy) {
    const result = await this._hass.callService(
      DOMAIN,
      SERVICE_GET_DAY,
      {
        day: dd,
        month: mm,
        year: yy,
      },
      {},
      true,
      true,
    );

    return result.response;
  }

  async get_month(mm, yy) {
    const result = await this._hass.callService(
      DOMAIN,
      SERVICE_GET_MONTH,
      {
        month: mm,
        year: yy,
      },
      {},
      true,
      true,
    );

    return result.response;
  }

  async get_year(yy) {
    const result = await this._hass.callService(
      DOMAIN,
      SERVICE_GET_YEAR,
      {
        year: yy,
      },
      {},
      true,
      true,
    );

    return result.response;
  }
}

// ======================= VNCalendarComponentCache =======================

class VNCalendarComponentCache {
  constructor(hass, timeZone = TIME_ZONE) {
    this.timeZone = timeZone;
    this._hass = hass;

    this.cache = new Map();
    this.loadingYears = new Map();

    this.clsLunar = new VNCalendarComponent(this._hass);
  }

  // build full year cache
  async buildYear(year) {
    year = Number(year);

    if (this.cache.has(year)) {
      return this.cache.get(year);
    }

    if (this.loadingYears.has(year)) {
      return await this.loadingYears.get(year);
    }

    const promise = this.clsLunar.get_year(year);

    this.loadingYears.set(year, promise);

    const yearMap = await promise;

    this.cache.set(year, yearMap);

    this.loadingYears.delete(year);

    this.cleanup(year);

    return yearMap;
  }

  // get cached date
  async getDay(dd, mm, yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = await this.buildYear(yy);
    }

    const key_month = `${yy}-${String(mm).padStart(2, "0")}`;

    const key_day = `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

    return yearMap?.[key_month]?.[key_day];
  }

  async getMonth(mm, yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = await this.buildYear(yy);
    }

    const key_month = `${yy}-${String(mm).padStart(2, "0")}`;

    return yearMap?.[key_month] || {};
  }

  async getYear(yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = await this.buildYear(yy);
    }

    return yearMap;
  }

  async getToday() {
    return await this.clsLunar.get_today();
  }

  preload(years = []) {
    years.forEach((y) => this.buildYear(y));
  }

  clear(year) {
    this.cache.delete(year);
  }

  clearAll() {
    this.cache.clear();
  }

  cleanup(viewingyear) {
    const trigger = 6;

    const lenCached = this.cache.size;

    if (lenCached <= trigger) {
      return;
    }

    const nowYear = new Date().getFullYear();

    viewingyear = Number(viewingyear);
    viewingyear = viewingyear > 1900 ? viewingyear : nowYear;

    const keepYears = new Set([nowYear - 1, nowYear, nowYear + 1, viewingyear - 1, viewingyear, viewingyear + 1]);

    for (const year of this.cache.keys()) {
      if (!keepYears.has(Number(year))) {
        this.clear(year);
      }
    }
  }
}

// ======================= LUNAR [HO NGOC DUC] =======================

class Lunar_HoNgocDuc {
  /*
   * Modified by Webpro. Thank to @author HO NGOC DUC.
   *
   * -----------------------------------------------------------------------------------
   * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
   * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
   *
   * Permission to use, copy, modify, and redistribute this software and its
   * documentation for personal, non-commercial use is hereby granted provided that
   * this copyright notice and appropriate documentation appears in all copies.
   * -----------------------------------------------------------------------------------
   */

  SOLAR_TERM_EMOJI = [
    // 🌸 Xuân
    ["Xuân phân", "🌸"],
    ["Thanh minh", "🌿"],
    ["Cốc vũ", "🌧️"],

    // ☀️ Hạ
    ["Lập hạ", "🌱"],
    ["Tiểu mãn", "🌾"],
    ["Mang chủng", "🌾"],
    ["Hạ chí", "☀️"],
    ["Tiểu thử", "🌤️"],
    ["Đại thử", "🔥"],

    // 🍂 Thu
    ["Lập thu", "🍃"],
    ["Xử thử", "🌬️"],
    ["Bạch lộ", "💧"],
    ["Thu phân", "🍂"],
    ["Hàn lộ", "❄️"],
    ["Sương giáng", "🌫️"],

    // ❄️ Đông
    ["Lập đông", "🌨️"],
    ["Tiểu tuyết", "❄️"],
    ["Đại tuyết", "☃️"],
    ["Đông chí", "🌙"],
    ["Tiểu hàn", "🥶"],
    ["Đại hàn", "🧊"],

    // 🌱 Cuối đông → xuân
    ["Lập xuân", "🌱"],
    ["Vũ thủy", "🌧️"],
    ["Kinh trập", "⚡"],
  ];

  HOANG_DAO = [
    ["Hắc đạo", "⚡"],
    ["Hoàng đạo", "🍀"],
  ];

  CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  HOANG_DAO_TABLE = {
    1: ["Tý", "Sửu", "Tỵ", "Mùi"],
    2: ["Dần", "Mão", "Mùi", "Dậu"],
    3: ["Thìn", "Tỵ", "Dậu", "Hợi"],
    4: ["Ngọ", "Mùi", "Hợi", "Sửu"],
    5: ["Thân", "Dậu", "Sửu", "Mão"],
    6: ["Tuất", "Hợi", "Mão", "Tỵ"],
    7: ["Tý", "Sửu", "Tỵ", "Mùi"],
    8: ["Dần", "Mão", "Mùi", "Dậu"],
    9: ["Thìn", "Tỵ", "Dậu", "Hợi"],
    10: ["Ngọ", "Mùi", "Hợi", "Sửu"],
    11: ["Thân", "Dậu", "Sửu", "Mão"],
    12: ["Tuất", "Hợi", "Mão", "Tỵ"],
  };

  BUDDHA_EVENTS = {
    "1-1": ["Di Lặc Bồ Tát"],
    "8-2": ["Phật Thích Ca xuất gia"],
    "15-2": ["Phật Thích Ca nhập Niết Bàn"],
    "19-2": ["Quan Âm đản sinh"],
    "21-2": ["Phổ Hiền Bồ Tát"],
    "16-3": ["Phật Thích Ca đản sinh (Nam tông)"],
    "4-4": ["Văn Thù Bồ Tát"],
    "8-4": ["Phật Thích Ca đản sinh (Bắc tông)"],
    "15-4": ["Phật Thích Ca thành đạo"],
    "13-6": ["Quan Âm thành đạo"],
    "15-7": ["Vu Lan (Ullambana)"],
    "19-6": ["Quan Âm thành đạo"],
    "30-7": ["Địa Tạng Vương Bồ Tát"],
    "22-9": ["Dược Sư Phật"],
    "19-9": ["Quan Âm xuất gia"],
    "8-12": ["Phật Thích Ca thành đạo"],
  };

  VEG_DAY = [1, 15];

  constructor() {}

  PI = Math.PI;

  /* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
  INT(d) {
    return Math.floor(d);
  }

  /* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
   * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
   * Formula from http://www.tondering.dk/claus/calendar.html
   */
  jdFromDate(dd, mm, yy) {
    var a, y, m, jd;
    a = this.INT((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - this.INT(y / 100) + this.INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - 32083;
    }
    return jd;
  }

  /* Convert a Julian day number to day/month/year. Parameter jd is an integer */
  jdToDate(jd) {
    var a, b, c, d, e, m, day, month, year;
    if (jd > 2299160) {
      // After 5/10/1582, Gregorian calendar
      a = jd + 32044;
      b = this.INT((4 * a + 3) / 146097);
      c = a - this.INT((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    d = this.INT((4 * c + 3) / 1461);
    e = c - this.INT((1461 * d) / 4);
    m = this.INT((5 * e + 2) / 153);
    day = e - this.INT((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * this.INT(m / 10);
    year = b * 100 + d - 4800 + this.INT(m / 10);
    return new Array(day, month, year);
  }

  /* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
   * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
   * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
   * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
   */
  NewMoon(k) {
    var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = this.PI / 180;
    Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    JdNew = Jd1 + C1 - deltat;
    return JdNew;
  }

  /* Compute the longitude of the sun at any time.
   * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
   * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
   */
  SunLongitude(jdn) {
    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = this.PI / 180; // degree to radian
    M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - this.PI * 2 * this.INT(L / (this.PI * 2)); // Normalize to (0, 2*PI)
    return L;
  }

  /* Compute sun position at midnight of the day with the given Julian day number.
   * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
   * The function returns a number between 0 and 11.
   * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
   * After that, return 1, 2, 3 ...
   */
  getSunLongitude(dayNumber, timeZone) {
    return this.INT((this.SunLongitude(dayNumber - 0.5 - timeZone / 24) / this.PI) * 6);
  }

  /* Compute the day of the k-th new moon in the given time zone.
   * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
   */
  getNewMoonDay(k, timeZone) {
    return this.INT(this.NewMoon(k) + 0.5 + timeZone / 24);
  }

  /* Find the day that starts the luner month 11 of the given year for the given time zone */
  getLunarMonth11(yy, timeZone) {
    var k, off, nm, sunLong;
    //off = jdFromDate(31, 12, yy) - 2415021.076998695;
    off = this.jdFromDate(31, 12, yy) - 2415021;
    k = this.INT(off / 29.530588853);
    nm = this.getNewMoonDay(k, timeZone);
    sunLong = this.getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
      nm = this.getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  /* Find the index of the leap month after the month starting on the day a11. */
  getLeapMonthOffset(a11, timeZone) {
    var k, last, arc, i;
    k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
  }

  /* Convert solar date dd/mm/yyyy to the corresponding lunar date */
  convertSolar2Lunar(dd, mm, yy, timeZone) {
    var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth;
    var lunarYear, lunarLeap, diff, leapMonthDiff;
    dayNumber = this.jdFromDate(dd, mm, yy);
    k = this.INT((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = this.getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = this.getNewMoonDay(k, timeZone);
    }
    //alert(dayNumber+" -> "+monthStart);
    a11 = this.getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = this.getLunarMonth11(yy + 1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    diff = this.INT((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff == leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }

    // return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
    return {
      solar: {
        day: dd,
        month: mm,
        year: yy,
      },

      lunar: {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap ? true : false,

        canchi: {
          year: this.canChiYear(lunarYear),
          month: this.canChiMonth(lunarYear, lunarMonth),
          day: this.canChiDay(dayNumber),
        },

        events: this.buddhaEvents(lunarDay, lunarMonth),
      },

      timeZone: timeZone,
      solarTerm: this.solarTerm(dayNumber, timeZone),
      dayType: this.dayType(lunarMonth, this.canChiDay(dayNumber)),
      isVeg: this.isVegDay(lunarDay),
    };
  }

  /* Convert a lunar date to the corresponding solar date */
  convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
    var k, a11, b11, off, leapOff, leapMonth, monthStart;
    if (lunarMonth < 11) {
      a11 = this.getLunarMonth11(lunarYear - 1, timeZone);
      b11 = this.getLunarMonth11(lunarYear, timeZone);
    } else {
      a11 = this.getLunarMonth11(lunarYear, timeZone);
      b11 = this.getLunarMonth11(lunarYear + 1, timeZone);
    }
    k = this.INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    off = lunarMonth - 11;
    if (off < 0) {
      off += 12;
    }
    if (b11 - a11 > 365) {
      leapOff = this.getLeapMonthOffset(a11, timeZone);
      leapMonth = leapOff - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      if (lunarLeap != 0 && lunarMonth != leapMonth) {
        return new Array(0, 0, 0);
      } else if (lunarLeap != 0 || off >= leapOff) {
        off += 1;
      }
    }
    monthStart = this.getNewMoonDay(k + off, timeZone);
    return this.jdToDate(monthStart + lunarDay - 1);
  }

  canChiYear(lunarYear) {
    return this.CAN[(lunarYear + 6) % 10] + " " + this.CHI[(lunarYear + 8) % 12];
  }

  canChiMonth(lunarYear, lunarMonth) {
    const yearCan = (lunarYear + 6) % 10;
    const canIndex = (yearCan * 2 + lunarMonth + 1) % 10;
    const chiIndex = (lunarMonth + 1) % 12;

    return this.CAN[canIndex] + " " + this.CHI[chiIndex];
  }

  canChiDay(jd) {
    return this.CAN[(jd + 9) % 10] + " " + this.CHI[(jd + 1) % 12];
  }

  canChiDayFromSolar(dd, mm, yy) {
    const jd = this.jdFromDate(dd, mm, yy);
    return this.canChiDay(jd);
  }

  solarTerm(jd, timeZone) {
    const L = this.SunLongitude(jd - 0.5 - timeZone / 24);
    const degree = (L * 180) / this.PI;

    const index = this.INT(degree / 15); // mỗi 15°
    return this.SOLAR_TERM_EMOJI[index];
  }

  solarTermFromSolar(dd, mm, yy, timeZone) {
    const jd = this.jdFromDate(dd, mm, yy);
    return solarTerm(jd, timeZone);
  }

  dayType(lunarMonth, dayCanChi) {
    const chi = dayCanChi.split(" ")[1];

    const goodlist = this.HOANG_DAO_TABLE[lunarMonth] || [];

    return goodlist.includes(chi) ? this.HOANG_DAO[1] : this.HOANG_DAO[0];
  }

  buddhaEvents(lunarDay, lunarMonth) {
    return this.BUDDHA_EVENTS[`${Number(lunarDay)}-${Number(lunarMonth)}`] || [];
  }

  isVegDay(lunarDay) {
    return this.VEG_DAY.includes(lunarDay);
  }
}

// ======================= LUNARCACHE =======================

class LunarCache {
  constructor(timeZone = TIME_ZONE) {
    this.timeZone = timeZone;
    this.cache = new Map(); // year -> Map(date -> lunar)

    this.clsLunar = new Lunar_HoNgocDuc();
  }

  // build full year cache
  buildYear(year) {
    year = Number(year);

    const yearMap = {};

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dd = d.getDate();
      const mm = d.getMonth() + 1;
      const yy = d.getFullYear();

      const lunar = this.clsLunar.convertSolar2Lunar(dd, mm, yy, this.timeZone);

      const key_month = `${yy}-${String(mm).padStart(2, "0")}`;

      const key_day = `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

      if (!yearMap[key_month]) {
        yearMap[key_month] = {};
      }

      yearMap[key_month][key_day] = lunar;
    }

    this.cache.set(year, yearMap);

    this.cleanup(year);

    return yearMap;
  }

  // get cached date
  getDay(dd, mm, yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = this.buildYear(yy);
    }
    const key_month = `${yy}-${String(mm).padStart(2, "0")}`;

    const key_day = `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

    return yearMap?.[key_month]?.[key_day];
  }

  // get full month
  getMonth(mm, yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = this.buildYear(yy);
    }

    const key_month = `${yy}-${String(mm).padStart(2, "0")}`;

    return yearMap?.[key_month] || {};
  }

  // get full year
  getYear(yy) {
    let yearMap = this.cache.get(yy);

    if (!yearMap) {
      yearMap = this.buildYear(yy);
    }

    return yearMap;
  }

  // today
  getToday() {
    const d = new Date();

    return getDay(d.getDate(), d.getMonth() + 1, d.getFullYear());
  }

  // preload multiple years
  preload(years = []) {
    years.forEach((y) => this.buildYear(y));
  }

  clear(year) {
    this.cache.delete(year);
  }

  clearAll() {
    this.cache.clear();
  }

  cleanup(viewingyear) {
    const trigger = 6;

    const lenCached = this.cache.size;

    if (lenCached <= trigger) {
      return;
    }

    const nowYear = new Date().getFullYear();

    viewingyear = Number(viewingyear);
    viewingyear = viewingyear > 1900 ? viewingyear : nowYear;

    const keepYears = new Set([nowYear - 1, nowYear, nowYear + 1, viewingyear - 1, viewingyear, viewingyear + 1]);

    for (const year of this.cache.keys()) {
      if (!keepYears.has(Number(year))) {
        this.clear(year);
      }
    }
  }
}

// ======================= VN LUNAR CALENDAR =======================
// const EMOJI = {
//   veg: "🥬",
//   fullmoon: "🌕",
//   newmoon: "🌑",
//   event: "🪷",
//   good: "🍀",
//   bad: "⚡",
//   solarTerm: "🌿",
//   today: "⭐",
//   day_1: "🌑",
//   day_214: "🌒",
//   day_15: "🌕",
//   day_1630: "🌘",
// };

class VNLunarCalendar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.presentDate = new Date();
    this.selectedDate = new Date();
    this.calendarDate = new Date();

    this.isAnimating = false;
    this._initialized = false;
    this._initializing = false;
  }

  setConfig(config) {
    this.config = config || {};
  }

  set hass(hass) {
    this._hass = hass;

    // this.hasService  = hass.config?.components.includes(DOMAIN) || false;
    this.hasService = hass.services?.[DOMAIN]?.[SERVICE_TODAY] || false;
    this.hasService = this.hasService ? true : false;

    if (this.hasService) {
      if (!this.clsLunar) {
        this.clsLunarCache = new VNCalendarComponentCache(hass);
      }
    } else {
      if (!this.clsLunarCache) {
        this.clsLunarCache = new LunarCache();
      }
    }

    this.handleHass();
  }

  async handleHass() {
    if (this._initializing) {
      return;
    }

    if (!this._initialized) {
      this._initializing = true;

      await this.initializeCard();

      this._initialized = true;
      this._initializing = false;

      return;
    }

    const newDay = await this.isNewDay();

    if (newDay) {
      this._initializing = true;

      await this.initializeCard();

      this._initializing = false;
    }
  }

  async initializeCard() {
    await this.init();

    this.render();

    this._initialized = true;
  }

  async init() {
    if (this.hasService) {
      const today = await this.clsLunarCache.getToday();

      this.presentDate = new Date(today.solar.year, today.solar.month - 1, today.solar.day);
      this.selectedDate = new Date(today.solar.year, today.solar.month - 1, today.solar.day);
      this.calendarDate = new Date(today.solar.year, today.solar.month - 1, today.solar.day);

      this.clsLunarCache.preload([today.solar.year - 1, today.solar.year, today.solar.year + 1]);
    } else {
      this.presentDate = new Date();
      this.selectedDate = new Date();
      this.calendarDate = new Date();

      this.clsLunarCache.preload([
        this.presentDate.getFullYear() - 1,
        this.presentDate.getFullYear(),
        this.presentDate.getFullYear() + 1,
      ]);
    }
  }

  async isNewDay() {
    const oldDay = this.presentDate?.getDate();

    if (this.hasService) {
      const today = await this.clsLunarCache.getToday();
      this.presentDate = new Date(today.solar.year, today.solar.month - 1, today.solar.day);
    } else {
      this.presentDate = new Date();
    }

    const newDay = this.presentDate.getDate();

    if (oldDay !== newDay) {
      this.selectedDate = new Date();
      this.calendarDate = new Date();

      return true;
    }

    return false;
  }

  async handleRender() {
    let [buildDay, buildCalendar, buildStyle] = await Promise.all([
      this.buildDayDetail(this.selectedDate),
      this.buildCalendar(this.calendarDate),
      this.buildStyleCard(this.presentDate),
    ]);

    this.shadowRoot.innerHTML = `
      <ha-card>
        <div class="vn-lunar-card">
          <div class="daybox">
            ${buildDay}
          </div>

          <div class="calendarbox">
            ${buildCalendar}
          </div>
        </div>

        <style>
          ${buildStyle}
        </style>
      </ha-card>
    `;
  }

  async render() {
    await this.handleRender();

    const track = this.shadowRoot.querySelector(".calendar-track");

    if (track) {
      track.style.transition = "none";
      track.style.transform = "translateX(-100%)";
    }

    this.shadowRoot.querySelector(".prev").onclick = () => this.changeMonth(-1);
    this.shadowRoot.querySelector(".next").onclick = () => this.changeMonth(1);

    this.initSwipe();
    this.bindCalendarDayClick();
    this.bindDayBoxClick();

    this.updateSelectedLunarEntity(this.selectedDate);
  }
  async updateTheme() {
    const style = this.shadowRoot.querySelector("style");

    if (!style) return;

    style.innerHTML = await this.buildStyleCard(this.selectedDate);
  }

  async updateDayDetail(date) {
    const container = this.shadowRoot.querySelector(".daybox");

    if (!container) return;

    container.innerHTML = await this.buildDayDetail(date);
  }

  async bindCalendarDayClick() {
    const wrapper = this.shadowRoot.querySelector(".calendar-wrapper");

    wrapper.addEventListener("pointerup", async (e) => {
      if (this.justDragged) return;

      const startEl = this._downTarget;

      const cell = startEl?.closest?.(".cell");

      if (!cell) return;

      const dateStr = cell.dataset.date;

      if (!dateStr) return;

      const [y, m, d] = dateStr.split("-").map(Number);

      const date = new Date(y, m - 1, d);

      this.selectedDate = date;
      this.updateDayDetail(date);
      this.highlightSelected(cell);

      this.updateSelectedLunarEntity(date);
    });
  }

  highlightSelected(selectedCell) {
    this.removeHighlightSelected();
    selectedCell.classList.add("selected");
  }

  removeHighlightSelected() {
    const cells = this.shadowRoot.querySelectorAll(".cell");
    cells.forEach((c) => c.classList.remove("selected"));
  }

  bindDayBoxClick() {
    const cell = this.shadowRoot.querySelector(".daybox");

    cell.addEventListener("pointerup", (e) => {
      this.calendarDate = this.presentDate;

      this.selectedDate = this.presentDate;

      this.removeHighlightSelected();

      this.render();
    });
  }

  async buildDayDetail(date) {
    const dayinfo = await this.clsLunarCache.getDay(date.getDate(), date.getMonth() + 1, date.getFullYear());

    let html = `
      <div class="dayinfo">
        <div class="solar">
          ${date.toLocaleDateString("vi-VN", { weekday: "long" })}
          ${date.toLocaleDateString("vi-VN")}
        </div>

        <div class="lunar  ${dayinfo.isVeg ? "vegday" : ""}">
          ${dayinfo.lunar.day}/${dayinfo.lunar.month}
          ${dayinfo.lunar.leap ? "(nhuận)" : ""}
          - ${dayinfo.lunar.canchi.year}
        </div>

        <div class="daycanchi">
          Ngày: ${dayinfo.lunar.canchi.day}
        </div>
        
        <div class="monthcanchi">
          Tháng: ${dayinfo.lunar.canchi.month}
        </div>
      </div>

      <div class="dayextra">
        <div class="tags">
          <span>${dayinfo.solarTerm[1]} ${dayinfo.solarTerm[0]}</span>
          <span>${dayinfo.dayType[1]} ${dayinfo.dayType[0]}</span>
          <!-- ${dayinfo.isVeg ? "<span>🥬 Chay</span>" : ""} -->
          ${dayinfo.lunar.day === 1 ? "<span>🌑 Mùng 1</span>" : ""}
          ${dayinfo.lunar.day === 15 ? "<span>🌕 Rằm</span>" : ""}
          ${dayinfo.lunar.events?.length ? `<span>🌸 ${dayinfo.lunar.events.join(", ")}</span>` : ""}
        </div>
      </div>
    `;
    return html;
  }

  async changeMonth(step) {
    if (this.isAnimating) {
      return;
    }

    const track = this.shadowRoot.querySelector(".calendar-track");
    if (!track) return;

    this.isAnimating = true;

    track.style.transition = "transform 0.3s cubic-bezier(.34,1.56,.64,1)"; //transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    track.style.transform = step > 0 ? "translateX(-200%)" : "translateX(0%)";

    const onEnd = async () => {
      track.removeEventListener("transitionend", onEnd);

      const d = new Date(this.calendarDate);
      d.setMonth(d.getMonth() + step);

      this.calendarDate = d;

      await this.render();

      const newTrack = this.shadowRoot.querySelector(".calendar-track");

      if (newTrack) {
        newTrack.style.transition = "none";
        newTrack.style.transform = "translateX(-100%)";
      }

      this.isAnimating = false;
    };

    track.addEventListener("transitionend", onEnd);
  }

  buildMonthCalendar(date, monthData, extraClass = "") {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    // JS: 0=CN → đổi về T2=0
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    let html = `<div class="calendar-grid ${extraClass}">`;

    // header
    const days = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CN"];
    html += days.map((d) => `<div class="header">${d}</div>`).join("");

    // today
    const today = this.presentDate;

    // cell
    const totalCells = 42;
    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - startDay;
      const cellDate = new Date(year, month, 1 + dayOffset);

      const d = cellDate.getDate();
      const m = cellDate.getMonth();
      const y = cellDate.getFullYear();
      const isSunday = cellDate.getDay() === 0;

      const isCurrentMonth = m === month;

      const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const dayinfo = monthData[key];

      if (!dayinfo) {
        continue;
      }

      const isVeg = dayinfo.isVeg;
      const hasEvent = dayinfo.lunar.events?.length;

      const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

      html += `
        <div class="cell 
          ${isToday ? "today" : ""} 
          ${!isCurrentMonth ? "other-month" : ""}
          ${isSunday ? "sunday" : ""}"
          data-date="${y}-${m + 1}-${d}">
          
          <div class="solar-day">
            ${d === 1 ? `<span class="first-daymonth">1/${m + 1}</span>` : d}
          </div>

          <div class="lunar-day">
            ${dayinfo.lunar.day === 1 ? `<span class="first-daymonth">1/${dayinfo.lunar.month}</span>` : dayinfo.lunar.day}
          </div>

          ${isVeg ? `<div class="dot veg"></div>` : ""}
          ${hasEvent ? `<div class="dot event"></div>` : ""}
        </div>
      `;
    }

    html += `</div>`;

    return html;
  }

  async renderCalendars(date) {
    const prev = new Date(date);
    prev.setMonth(prev.getMonth() - 1, 1);

    const prevprev = new Date(date);
    prevprev.setMonth(prev.getMonth() - 1, 1);

    const next = new Date(date);
    next.setMonth(next.getMonth() + 1, 1);

    const nextnext = new Date(date);
    nextnext.setMonth(next.getMonth() + 1, 1);

    const [prevprevMonthData, prevMonthData, currentMonthData, nextMonthData, nextnextMonthData] = await Promise.all([
      this.clsLunarCache.getMonth(prevprev.getMonth() + 1, prevprev.getFullYear()),
      this.clsLunarCache.getMonth(prev.getMonth() + 1, prev.getFullYear()),
      this.clsLunarCache.getMonth(date.getMonth() + 1, date.getFullYear()),
      this.clsLunarCache.getMonth(next.getMonth() + 1, next.getFullYear()),
      this.clsLunarCache.getMonth(nextnext.getMonth() + 1, nextnext.getFullYear()),
    ]);

    const mergedData = {
      ...prevprevMonthData,
      ...prevMonthData,
      ...currentMonthData,
      ...nextMonthData,
      ...nextnextMonthData,
    };
    let buildPrevMonth = this.buildMonthCalendar(prev, mergedData, "prev");
    let buildCurrMonth = this.buildMonthCalendar(date, mergedData, "current");
    let buildNextMonth = this.buildMonthCalendar(next, mergedData, "next");

    return `
      <div class="calendar-track">
        ${buildPrevMonth}
        ${buildCurrMonth}
        ${buildNextMonth}
      </div>
    `;
  }

  async buildCalendar(date) {
    let renderCalendars = await this.renderCalendars(date);

    let html = `
      <div class="calendar-nav">
        <button class="prev">◀ Tháng trước</button>
        <div class="month">
            ${date.getMonth() + 1}/${date.getFullYear()}
        </div>
        <button class="next">Tháng sau ▶</button>
      </div>

      <div class="calendar-wrapper">
        ${renderCalendars}
      </div>
    `;
    return html;
  }

  initSwipe() {
    const wrapper = this.shadowRoot.querySelector(".calendar-wrapper");
    const track = this.shadowRoot.querySelector(".calendar-track");

    if (!wrapper || !track) return;

    this.isDragging = false;
    this.hasMoved = false;
    this.justDragged = false;

    let startX = 0;
    let currentX = 0;

    const threshold = 50;

    wrapper.style.touchAction = "pan-y";

    // ================= DOWN =================
    wrapper.addEventListener("pointerdown", async (e) => {
      if (this.isAnimating) return;

      wrapper.setPointerCapture(e.pointerId);

      this.isDragging = true;
      this.hasMoved = false;

      startX = e.clientX;
      currentX = startX;

      this._downTarget = e.target;

      track.style.transition = "none";
    });

    // ================= MOVE =================
    wrapper.addEventListener("pointermove", async (e) => {
      if (!this.isDragging) return;

      currentX = e.clientX;
      const delta = currentX - startX;

      if (Math.abs(delta) > 5) {
        this.hasMoved = true; // 🔥 chỉ set true
      }

      const percent = (delta / wrapper.offsetWidth) * 100;
      track.style.transform = `translateX(calc(-100% + ${percent}%))`;
    });

    // ================= END =================
    const handleEnd = (e) => {
      if (!this.isDragging) return;

      this.isDragging = false;

      const delta = currentX - startX;

      track.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";

      if (this.hasMoved) {
        this.justDragged = true;

        setTimeout(() => {
          this.justDragged = false;
        }, 0);

        if (delta > threshold) {
          this.changeMonth(-1);
        } else if (delta < -threshold) {
          this.changeMonth(1);
        } else {
          track.style.transform = "translateX(-100%)";
        }
      } else {
        track.style.transform = "translateX(-100%)";
      }
    };

    wrapper.addEventListener("pointerup", handleEnd);
    wrapper.addEventListener("pointercancel", handleEnd);
  }

  async updateSelectedLunarEntity(date) {
    const entity_selected_lunar = this.config?.entity_selected_lunar;
    const entity_isveg = this.config?.entity_isveg;
    const entity_component = this.config?.entity_component;

    if (!this._hass) {
      return;
    }

    const dayinfo = await this.clsLunarCache.getDay(date.getDate(), date.getMonth() + 1, date.getFullYear());

    const payload = {
      solar: dayinfo.solar,
      lunar: {
        day: dayinfo.lunar.day,
        month: dayinfo.lunar.month,
        year: dayinfo.lunar.year,
        canchi: dayinfo.lunar.canchi,
      },
    };

    try {
      if (entity_selected_lunar) {
        this._hass.callService("input_text", "set_value", {
          entity_id: entity_selected_lunar,
          value: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error("VN Lunar Calendar selected lunar error:", err);
    }

    try {
      if (entity_isveg) {
        this._hass.callService("input_boolean", dayinfo.isVeg ? "turn_on" : "turn_off", {
          entity_id: entity_isveg,
        });
      }
    } catch (err) {
      console.error("VN Lunar Calendar veg error:", err);
    }

    try {
      if (entity_component) {
        this._hass.callService("input_boolean", this.hasService ? "turn_on" : "turn_off", {
          entity_id: entity_component,
        });
      }
    } catch (err) {
      console.error("VN Lunar Calendar component error:", err);
    }
  }

  async getStyle() {
    const bg_day =
      this.config?.background_day ||
      "https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/whiteflower.jpg";
    const bg_night =
      this.config?.background_night ||
      "https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_fullmoon2.jpg";
    const bg_night_half =
      this.config?.background_nighthalf ||
      "https://raw.githubusercontent.com/hlnguyensinh/HA_VNLunarCalendar/main/assets/night_halfmoon.jpg";

    const now = this.presentDate;
    let isNight = false;
    try {
      isNight = this._hass?.states["sun.sun"]?.state === "below_horizon";
    } catch (error) {
      const hour = now.getHours();
      isNight = hour >= 18 || hour < 6;
    }

    const dayinfo = await this.clsLunarCache.getDay(now.getDate(), now.getMonth() + 1, now.getFullYear());

    let style = isNight ? "night" + (dayinfo.lunar.day == 15 ? "-15" : "") : "";

    switch (style) {
      case "night-15":
        return {
          background: `background: url('${bg_night}'), linear-gradient(rgba(10, 25, 50, 0.55), rgba(10, 25, 50, 0.55))`,
          background_attb: "/*background-attachment: fixed;*/",

          daybox: "background: rgba(0,0,0,0.1); /*backdrop-filter: blur(8px);*/",
          daybox_solar: "font-size:1.2em; color: #E6F0FF",
          daybox_lunar: "font-size:1.5em; color: #FFFFFF",
          daybox_vegday: "color: orange",
          daybox_daycanchi: "color: #A8C7FF",
          daybox_monthcanchi: "color: #A8C7FF",

          daybox_dayextra_tags: "background: rgb(63, 127, 166,.5); color: #E6F0FF",

          calendarbox:
            "background: rgba(20,40,70,0.45); backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(31,95,139,0.15);",
          calendarbox_nav_month: "color: #E6F0FF",
          calendarbox_nav_background: "background: rgba(111,163,197,0.15);",
          calendarbox_nav_button: "color: #a7b7ff",

          calendarbox_header: "background: linear-gradient(135deg, #3F7FA6, #6FA3C5); color: #fff;",
          calendarbox_header_sunday: "color: orange",
          calendarbox_cell:
            "border: 1.5px solid rgba(63, 127, 166, 0.2); background: rgba(255,255,255,0.05); color: #CFE3FF;;",
          calendarbox_cell_hover: "background: rgba(111,163,197,0.2);",

          calendarbox_solarday: "text-align: center; font-weight: bold;",
          calendarbox_lunarday: "font-size: .8rem; text-align: right; margin-right:20px",
          calendarbox_sunday: "color: orange",
          calendarbox_today: "background: rgba(77,163,255,0.8); color: #fff;",
          calendarbox_selected: "border: 1.5px solid #3F7FA6; background: rgba(111,163,197,0.15);",

          calendarbox_dotveg: "background: #FBBF24;",
          calendarbox_dotevent: "background: #C084FC",
          calendarbox_othermonth_solar: "color: rgba(108, 216, 255, .2);",
          calendarbox_othermonth_lunar: "color: rgba(108, 216, 255, .2);",
          calendarbox_firstmonth_solar: "text-decoration: underline;",
          calendarbox_firstmonth_lunar: "text-decoration: underline;",
        };
      case "night":
        return {
          background: `background: url('${bg_night_half}'), linear-gradient(rgba(10, 25, 50, 0.55), rgba(10, 25, 50, 0.55))`,
          background_attb: "/*background-attachment: fixed;*/",

          daybox: "background: rgba(0,0,0,0.1); /*backdrop-filter: blur(8px);*/",
          daybox_solar: "font-size:1.2em; color: #E6F0FF",
          daybox_lunar: "font-size:1.5em; color: #FFFFFF",
          daybox_vegday: "color: orange",
          daybox_daycanchi: "color: #A8C7FF",
          daybox_monthcanchi: "color: #A8C7FF",

          daybox_dayextra_tags: "background: rgb(63, 127, 166,.5); color: #E6F0FF",

          calendarbox:
            "background: rgba(20,40,70,0.45); backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(31,95,139,0.15);",
          calendarbox_nav_month: "color: #E6F0FF",
          calendarbox_nav_background: "background: rgba(111,163,197,0.15);",
          calendarbox_nav_button: "color: #a7b7ff",

          calendarbox_header: "background: linear-gradient(135deg, #3F7FA6, #6FA3C5); color: #fff;",
          calendarbox_header_sunday: "color: orange",
          calendarbox_cell:
            "border: 1.5px solid rgba(63, 127, 166, 0.2); background: rgba(255,255,255,0.05); color: #CFE3FF;;",
          calendarbox_cell_hover: "background: rgba(111,163,197,0.2);",

          calendarbox_solarday: "text-align: center; font-weight: bold;",
          calendarbox_lunarday: "font-size: .8rem; text-align: right; margin-right:20px",
          calendarbox_sunday: "color: orange",
          calendarbox_today: "background: rgba(77,163,255,0.8); color: #fff;",
          calendarbox_selected: "border: 1.5px solid #3F7FA6; background: rgba(111,163,197,0.15);",

          calendarbox_dotveg: "background: #FBBF24;",
          calendarbox_dotevent: "background: #C084FC",
          calendarbox_othermonth_solar: "color: rgba(108, 216, 255, .2);",
          calendarbox_othermonth_lunar: "color: rgba(108, 216, 255, .2);",
          calendarbox_firstmonth_solar: "text-decoration: underline;",
          calendarbox_firstmonth_lunar: "text-decoration: underline;",
        };
      default:
        return {
          background: `background: url('${bg_day}'), linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.15))`,
          background_attb: "background-attachment: fixed;",

          daybox: "background: rgba(255,255,255,0.5); backdrop-filter: blur(8px);",
          daybox_solar: "font-size:1.2em; color: #3F7FA6",
          daybox_lunar: "font-size:1.5em; color: #1F5F8B",
          daybox_vegday: "color: orange",
          daybox_daycanchi: "color: #1F5F8B",
          daybox_monthcanchi: "color: #1F5F8B",

          daybox_dayextra_tags: "background: #1F5F8B; color: #ccc",

          calendarbox:
            "background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(31,95,139,0.15);",
          calendarbox_nav_month: "color: #1F5F8B",
          calendarbox_nav_background: "background: rgba(111,163,197,0.15);",
          calendarbox_nav_button: " color: #5B7C99",

          calendarbox_header: "background: linear-gradient(135deg, #3F7FA6, #6FA3C5); color: #fff;",
          calendarbox_header_sunday: "color: orange",
          calendarbox_cell:
            "border: 1.5px solid rgba(63, 127, 166, 0.2); background: rgba(255,255,255,0.6); color: #3F7FA6;",
          calendarbox_cell_hover: "background: rgba(111,163,197,0.2);",

          calendarbox_solarday: "text-align: center; font-weight: bold;",
          calendarbox_lunarday: "font-size: .8rem; text-align: right; margin-right:20px",
          calendarbox_sunday: "color: orange",
          calendarbox_today: "background: rgba(63, 127, 166, .6); color: #fff;",
          calendarbox_selected: "border: 1.5px solid #3F7FA6; background: rgba(111,163,197,0.15);",

          calendarbox_dotveg: "background: orange;",
          calendarbox_dotevent: "background: purple",
          calendarbox_othermonth_solar: "color: rgba(63, 127, 166, .2);",
          calendarbox_othermonth_lunar: "color: rgba(63, 127, 166, .2);",
          calendarbox_firstmonth_solar: "text-decoration: underline;",
          calendarbox_firstmonth_lunar: "text-decoration: underline;",
        };
    }
  }

  async buildStyleCard() {
    let st = await this.getStyle();

    let html = `
        .vn-lunar-card {
          padding:5px;
          
          ${st.background};
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
		  
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          
          ${st.background_attb}
        }

        /* --------- daybox -------- */
        .vn-lunar-card .daybox {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          height:10rem;
		  
		      border-radius: 10px 10px 0 0;

          /*
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(31,95,139,0.15);
          */

          cursor: pointer;

          ${st.daybox}
        }

        .vn-lunar-card .daybox .dayinfo {
          text-align:center;
        }

        .vn-lunar-card .daybox .dayinfo .solar {${st.daybox_solar}}
        .vn-lunar-card .daybox .dayinfo .lunar {${st.daybox_lunar}}
        .vn-lunar-card .daybox .dayinfo .vegday {${st.daybox_vegday}}
        .vn-lunar-card .daybox .dayinfo .daycanchi {${st.daybox_daycanchi}}
        .vn-lunar-card .daybox .dayinfo .monthcanchi {${st.daybox_monthcanchi}}
        
        .vn-lunar-card .daybox .dayextra {
          max-width: 50%;
          text-align:center;
        }
          
        .vn-lunar-card .daybox .dayextra .tags {
        }

        .vn-lunar-card .daybox .dayextra .tags span {
          display: inline-block;
          margin: 4px;
          padding: 4px 8px;
          border-radius: 6px;

          ${st.daybox_dayextra_tags}
        }

        /* --------- calendarbox -------- */
        .vn-lunar-card .calendarbox {
          border-radius: 0 0 10px 10px;

          /*
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(31,95,139,0.15);
          */

          ${st.calendarbox}
        }

        .vn-lunar-card .calendarbox .calendar-nav{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom: 8px;
          border-radius: 20px;

          ${st.calendarbox_nav_background}
        }

        .vn-lunar-card .calendarbox .calendar-nav .month{${st.calendarbox_nav_month}}

        .vn-lunar-card .calendarbox .calendar-nav button{
          background: transparent;
          border:0;

          ${st.calendarbox_nav_button}
        }

        .vn-lunar-card .calendarbox .calendar-wrapper {
          overflow: hidden;
          width: 100%;
          touch-action: pan-y;
          
          user-select: none;
          cursor: grab;
        }
        .vn-lunar-card .calendarbox .calendar-wrapper:active {
          cursor: grabbing;
        }
          
        /* --------- calendarbox.calendar-wrapper.calendar-track -------- */
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track {
          display: flex;
          width: 100%;
          transform: translateX(-100%);
          will-change: transform;
        }
        
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid {
          width: 100%;
          flex-shrink: 0;

          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: auto repeat(6, 1fr);
          gap: 4px;

          box-sizing: border-box;
        }

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .header{
          display: flex;
          justify-content: center;
          align-items: center;
          
          font-size: .8em;
          height: 2rem;
          border-radius:6px;

          ${st.calendarbox_header}
        }
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .header:nth-child(7) {${st.calendarbox_header_sunday}}

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .cell {
          position: relative;
          padding: 1px;
          border-radius: 8px;
          font-size: 1.2em;

          ${st.calendarbox_cell}
        }
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .cell:hover {
          cursor: pointer;
          ${st.calendarbox_cell_hover}
        }

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .today {${st.calendarbox_today}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .solar-day {${st.calendarbox_solarday}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .lunar-day {${st.calendarbox_lunarday}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .sunday {${st.calendarbox_sunday}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .selected {${st.calendarbox_selected}}

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          bottom: 4px;
          right: 4px;
        }

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .dot.veg {${st.calendarbox_dotveg}}

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .dot.event {
          right: 14px;
          ${st.calendarbox_dotevent};
        }

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .other-month {
          pointer-events: none;
        }

        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .solar-day .first-daymonth {${st.calendarbox_firstmonth_solar}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .lunar-day .first-daymonth {${st.calendarbox_firstmonth_lunar}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .other-month .solar-day {${st.calendarbox_othermonth_solar}}
        .vn-lunar-card .calendarbox .calendar-wrapper .calendar-track .calendar-grid .other-month .lunar-day {${st.calendarbox_othermonth_lunar}}
    `;

    return html;
  }

  getCardSize() {
    return 3;
  }
}

if (!customElements.get("vn-lunar-calendar")) {
  customElements.define("vn-lunar-calendar", VNLunarCalendar);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "vn-lunar-calendar",
  name: "VN Lunar Calendar",
  description: "Vietnam Lunar Calendar supported Component",
});
