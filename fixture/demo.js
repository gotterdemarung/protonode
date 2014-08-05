
module.exports = "\
# This is demo structure \n\
\n\
# This is common PSR-3 logger interface\n\
interface Psr.Log.Logger\n\
  void emergency(string message, mixed[] context)\n\
  void alert(string message, mixed[] context)\n\
  void critical(string message, mixed[] context)\n\
  void error(string message, mixed[] context)\n\
  void warning(string message, mixed[] context)\n\
  void notice(string message, mixed[] context)\n\
  void info(string message, mixed[] context)\n\
  void debug(string message, mixed[] context)\n\
  void log(mixed level, string message, mixed[] context)\n\
";