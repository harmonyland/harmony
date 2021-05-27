function script() {
  const id = 'q' + '-' + 'Y' + '0' + 'b' + 'n' + 'x' + '6' + 'N' + 'd' + 'w'
  document.body.innerHTML = '3...'
  setTimeout(() => {
    document.body.innerHTML = '2...'
    setTimeout(() => {
      document.body.innerHTML = '1...'
      setTimeout(() => {
        document.body.innerHTML = 'No'
        setTimeout(() => {
          window.location.href =
            'h' +
            't' +
            't' +
            'p' +
            's' +
            ':' +
            '/' +
            '/' +
            'w' +
            'w' +
            'w' +
            '.' +
            'y' +
            'o' +
            'u' +
            't' +
            'u' +
            'b' +
            'e' +
            '.' +
            'c' +
            'o' +
            'm' +
            '/' +
            'w' +
            'a' +
            't' +
            'c' +
            'h' +
            '?' +
            'v' +
            '=' +
            id
        }, 2000)
      }, 1000)
    }, 1000)
  }, 1000)
}

window.addEventListener('fetch', (evt) => {
  evt.respondWith(
    new Response(
      `<!DOCTYPE HTML>
      <html lang="en-US">
      <head>
      <meta charset="utf-8"/>
      <title>Will Ian ever get dev badge?</title>
      <meta name="og:title" content="Everyone wants to know..."/>
      <meta name="theme-color" content="#E5C41D"/>
      <meta name="og:description" content="Will Ian ever get dev badge?">
      <meta name="og:image" content="https://cdn.discordapp.com/avatars/90339695967350784/ab775dfe83d1a8057587a837eedde447.png">
      </head>
      <body>
      <script>(${(script + '').replaceAll(/ +/g, ' ')})();
      </script>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  )
})
