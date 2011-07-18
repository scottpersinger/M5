<!doctype html>
<html>
  <head>
      <meta charset="UTF-8" />
      <title>M5 Apps Community</title>
  </head>
  <body>
    <h1>M5 Mobile Framework</h1>
    
    <hr />
    <h2>Apps</h2>
    <ul>
%for app in apps:
      <li><a href="{{app}}">{{basename(app)}}</li>
%end
    </ul>
  </body>
</html>