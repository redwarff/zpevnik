const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Accept', 'application/json')

export default class Api {

  apiUrl = 'https://zpevnik.herokuapp.com/api/v1'

  fetch = (endpoint, options) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: myHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          return response.json()
        }
        // return response.json()
        throw new Error('Network response was not ok.')
      })
  )

  getAuthors = () => {
    return this.fetch('authors')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongs = () => {
    return this.fetch('songs')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSong = songId => {
    return this.fetch(`songs/${songId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongVariants = songId => {
    return this.fetch(`songs/${songId}/variants`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongAuthors = songId => {
    return this.fetch(`songs/${songId}/authors`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createAuthor = (firstname, surname) => {
    return this.fetch('authors', { method: 'POST', body: JSON.stringify({ firstname, surname }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createSong = title => {
    return this.fetch('songs', { method: 'POST', body: JSON.stringify({ title }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createVariant = (title, songId) => {
    return this.fetch(`songs/${songId}/variants`, { method: 'POST', body: JSON.stringify({ title, text: 'Sem přidej píseň v ChordPro formátu...' }) })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  updateSongAuthor = (songId, authorId) => {
    return this.fetch(`songs/${songId}/authors/${authorId}`, { method: 'POST' })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  updateSong = (songId, variantId, text, songTitle, musicAuthors, lyricsAuthors, interpreters) => {
    const body = {
      'title': songTitle,
      'text': text,
      'authors': {
        'music': musicAuthors,
        'lyrics': lyricsAuthors
      },
      'interpreters': interpreters
    }
    console.log('sendind text: ', text)
    return this.fetch(`songs/${songId}/variants/${variantId}`, { method: 'PUT', body: JSON.stringify({ text, chords: text, title: songTitle }) })
      .then(data => console.log(data))
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }
}