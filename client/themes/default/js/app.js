/* THEME SPECIFIC JAVASCRIPT */

const rxYoutube = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
const rxVimeo = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/

window.boot.register('vue', () => {
  window.onload = () => {
    console.log('window loaded')
    setTimeout(() => {
      document.querySelectorAll('.contents oembed').forEach(elm => {
        const url = elm.hasAttribute('url') ? elm.getAttribute('url') : elm.getAttribute('href')
        let newElmHtml = null

        const ytMatch = url.match(rxYoutube)
        const vmMatch = !ytMatch && url.match(rxVimeo)
        if (ytMatch) {
          newElmHtml = `<div style="position: relative;padding-bottom: 56.25%;height: 0;margin-top:16px;background:#eee">
<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:0;position: absolute;top: 0;left: 0;"></iframe>
</div>`
        } else if (vmMatch) {
          newElmHtml = `<iframe id="vmplayer" type="text/html" width="640" height="360" src="https://player.vimeo.com/video/${vmMatch[5]}" frameborder="0" allowfullscreen></iframe>`
        } else if (url.endsWith('.mp4')) {
          newElmHtml = `<video controls autostart="0" name="media" width="640" height="360"><source src="${url}" type="video/mp4"></video>`
        } else {
          return
        }

        const newElm = document.createElement('div')
        newElm.classList.add('video-responsive')
        newElm.insertAdjacentHTML('beforeend', newElmHtml)
        elm.replaceWith(newElm)
      })
    }, 200)
  }
})
