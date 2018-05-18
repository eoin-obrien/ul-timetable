const lessonSplitRegex = /\s*(?:<font>.*?<\/font>|<br>)+\s*/g;

// tslint:disable-next-line:prefer-template
export const courseTimetableLesson = ('12:00\r\n      <font> - <\/font>\r\n      13:00\r\n      <br>\r\n'
  + '      EE4013\r\n       <font> - <\/font>\r\n      LEC\r\n       <font> - <\/font>\r\n      &nbsp;\r\n'
  + '      <br>\r\n\r\n       MURPHY KEVIN DR<br>\r\n\r\n       FG042<br>\r\n       Wks:1-9,11-13\r\n'
  + '      ').split(lessonSplitRegex);

// tslint:disable-next-line:prefer-template
export const moduleTimetableLesson = ('09:00\r\n      <font> - <\/font>\r\n      10:00\r\n      <br>\r\n'
  + '      TUT\r\n       <font> - <\/font>\r\n      3B\r\n      <br>\r\n       EATON MALACHY DR<br>\r\n'
  + '       SG19<br>\r\n       Wks:1-9,11-13\r\n      ').split(lessonSplitRegex);

// tslint:disable-next-line:prefer-template
export const roomTimetableLesson = ('11:00\r\n      <font> - <\/font>\r\n      12:00\r\n      <br>\r\n'
  + '       AC4004 AC4034\r\n      <font> - <\/font>\r\n      LEC\r\n      <font> - <\/font>\r\n'
  + '        \r\n      <br>\r\n\r\n      Size - 201\r\n      <br>\r\n\r\n       WHELAN JOANNE MS\r\n'
  + '      <br>\r\n       \r\n      Wks:1-9,11-13\r\n      ').split(lessonSplitRegex);

// tslint:disable-next-line:prefer-template
export const roomTimetableBooking = ('14:00\r\n      <font> - <\/font>\r\n      18:00\r\n      <br>\r\n'
  + '      &nbsp;\r\n      <font> - <\/font>\r\n      RMBKG\r\n      <font> - <\/font>\r\n       \r\n'
  + '      <br>\r\n\r\n      Size - 0\r\n      <br>\r\n\r\n      &nbsp;\r\n      <br>\r\n       \r\n'
  + '      Wks:1-9,11-14\r\n      ').split(lessonSplitRegex);

// tslint:disable-next-line:prefer-template
export const studentTimetableLesson = ('15:00\r\n      <font> - <\/font>\r\n      17:00\r\n      <br>\r\n'
  + '      CS4076\r\n      <font> - <\/font>LAB <font>- <\/font>\r\n      2A\r\n      <br>\r\n'
  + '       CS3005B\r\n      <br>\r\n       \r\n      Wks:1-9,11-13\r\n      ').split(lessonSplitRegex);
