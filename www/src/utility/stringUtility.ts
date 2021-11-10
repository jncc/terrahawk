

/// Trims the specified chars from the string
/// https://stackoverflow.com/a/55292366/40759
export function trimAny(str: string, chars: string[]) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0)
    ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0)
    --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}
