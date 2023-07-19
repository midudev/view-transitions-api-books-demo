const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
  // vamos a cargar la página de destino
  // utilizando un fetch para obtener el HTML
  const response = await fetch(url) // /clean-code
  const text = await response.text()
  // quedarnos sólo con el contenido del html dentro de la etiqueta body
  // usamos un regex para extraerlo
  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  const [, title] = text.match(/<title>([\s\S]*)<\/title>/i)
  return {
    data,
    title
  }
}

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return

  window.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)

    // es una página externa? si es así, lo ignoramos
    if (location.origin !== toUrl.origin) return

    // si es una navegación en el mismo dominio (origen)
    event.intercept({
      async handler () {
        const {data , title} = await fetchPage(toUrl.pathname)

        // utilizar la api de View Transition API
        document.startViewTransition(() => {
          // el scroll hacia arriba del todo
          document.body.innerHTML = data
          document.title = title
          document.documentElement.scrollTop = 0
        })
      }
    })
  })
}