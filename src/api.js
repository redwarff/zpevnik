const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Accept', 'application/json')

export default class Api {

  apiUrl = 'https://zpevnik.herokuapp.com/api/v1'

  fetchJson = (endpoint, options) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: myHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          return response.json()
        }
        // return response.json()
        throw new Error('Network response was not ok.')
      })
  )

  fetchBlob = (endpoint, options, blob) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: { 'Accept': 'application/pdf' } })
      .then(response => {
        if(response.ok) {
          return response.blob()
        }
        throw new Error('Network response was not ok.')
      })
  )

  getAuthors = () => {
    return this.fetchJson('authors')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongs = () => {
    return this.fetchJson('songs')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSong = songId => {
    return this.fetchJson(`songs/${songId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongPdf = (songId, variantId) => {
    return this.fetchBlob(`songs/${songId}/variants/${variantId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongVariants = songId => {
    return this.fetchJson(`songs/${songId}/variants`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongAuthors = songId => {
    return this.fetchJson(`songs/${songId}/authors`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createAuthor = (firstname, surname) => {
    return this.fetchJson('authors', { method: 'POST', body: JSON.stringify({ firstname, surname }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createSong = title => {
    return this.fetchJson('songs', { method: 'POST', body: JSON.stringify({ title }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createVariant = (title, songId) => {
    return this.fetchJson(`songs/${songId}/variants`, { method: 'POST', body: JSON.stringify({ title, text: 'Sem přidej píseň v ChordPro formátu...' }) })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  updateSongAuthor = (songId, authorId) => {
    return this.fetchJson(`songs/${songId}/authors/${authorId}`, { method: 'POST' })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  updateSong = (songId, variantId, text, variantTitle) => {
    console.log('sendind text: ', text)
    return this.fetchJson(`songs/${songId}/variants/${variantId}`, { method: 'PUT', body: JSON.stringify({ text, chords: text, title: variantTitle }) })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }
}