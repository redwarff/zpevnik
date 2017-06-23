import React, { Component } from 'react'
import Select from 'react-select';
import Api from './api'
import { mapAuthorsToSelect, mapSongsToSelect, mapVariantsToSelect } from './lib'
import './App.css'

const api = new Api()

class App extends Component {

  state = {
    songChords: '',
    addSongTitle: '',
    allAuthors: [],
    songAuthors: [],
    addAuthorName: '',
    addAuthorSurname: '',
    allSongs: [],
    selectedSong: {},
    selectedSongVariant: {},
    selectedSongVariants: [],
    newSongVariantTitle: ''
  }

  componentDidMount = () => {
    this.getAllAuthors()
    this.getAllSongs()
  }

  onSongChordsChange = e => {
    this.setState({
      selectedSongVariant: {...this.state.selectedSongVariant, chords: e.target.value}
    })
  }

  onAddSongTitleChange = e => {
    this.setState({
      addSongTitle: e.target.value
    })
  }

  onSongAuthorsChange = value => {
    this.setState({
      songAuthors: value
    })
  }

  onAddAuthorNameChange = e => {
    this.setState({
      addAuthorName: e.target.value
    })
  }

  onAddAuthorSurnameChange = e => {
    this.setState({
      addAuthorSurname: e.target.value
    })
  }

  createAuthor = () => {
    api.createAuthor(this.state.addAuthorName, this.state.addAuthorSurname)
      .then(data => {
        this.getAllAuthors()
      })
  }

  createSong = () => {
    api.createSong(this.state.addSongTitle)
      .then(data => {
        this.getAllSongs()
      })
  }

  getAllAuthors = () => {
    api.getAuthors().then(authors => {
      this.setState({
        allAuthors: mapAuthorsToSelect(authors)
      })
    })
  }

  getAllSongs = () => {
    api.getSongs().then(songs => {
      this.setState({
        allSongs: songs
      })
    })
  }

  getSong = songId => {
    api.getSong(songId).then(song => {
      this.setState({
        selectedSong: song
      })
    }).then(data => {
      api.getSongVariants(songId).then(variants => {
        this.setState({ selectedSongVariants: variants })
      })
    }).then(data => {
      api.getSongAuthors(songId).then(authors => {
        this.setState({ songAuthors: mapAuthorsToSelect(authors) })
      })
    })
    if (songId !== this.state.selectedSong.id) {
      this.setState({ selectedSongVariant: { chords: '' } })
    }
    
  }

  onSelectedSongChange = songId => {
    this.getSong(songId.value)
  }

  onSelectedSongVariantChange = variantId => {
    this.setState({ selectedSongVariant: this.state.selectedSongVariants.filter(variant => variant.id === variantId.value)[0] })
  }

  onNewSongVariantTitleChange = e => {
    this.setState({ newSongVariantTitle: e.target.value })
  }

  createVariant = () => {
    api.createVariant(this.state.newSongVariantTitle, this.state.selectedSong.id)
      .then(data => {
        this.getSong(this.state.selectedSong.id)
      })
  }

  saveSong = () => {
    api.updateSong(this.state.selectedSong.id, this.state.selectedSongVariant.id, this.state.selectedSongVariant.chords, this.state.selectedSongVariant.title)
  }

  updateSongAuthors = () => {
    this.state.songAuthors.forEach(author => {
      api.updateSongAuthor(this.state.selectedSong.id, author.value)
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="app">

        <div className="creator">
          <div>Vytvořit píseň</div>
          <div>Název písně</div>
          <input value={this.state.addSongTitle} onChange={this.onAddSongTitleChange} />
          <button onClick={this.createSong}>Vytvořit píseň</button>

          <div>Vytvořit autora</div>
          <div>
            Jméno
            <input value={this.state.addAuthorName} onChange={this.onAddAuthorNameChange} />
          </div>
          <div>
            Příjmení
            <input value={this.state.addAuthorSurname} onChange={this.onAddAuthorSurnameChange} />
          </div>
          <button onClick={this.createAuthor}>Vytvořit autora</button>
        </div>

        <div className="selector">
          <div>Vybrat píseň</div>
          <Select options={mapSongsToSelect(this.state.allSongs)} value={this.state.selectedSong.id} onChange={this.onSelectedSongChange} />

          <div>Vybrat variantu písně</div>
          <Select options={mapVariantsToSelect(this.state.selectedSongVariants)} value={this.state.selectedSongVariant.id} onChange={this.onSelectedSongVariantChange} />

          <div>Vytvořit novou variantu písně</div>
          <div>Název varianty</div>
          <input value={this.state.newSongVariantTitle} onChange={this.onNewSongVariantTitleChange} />
          <button onClick={this.createVariant}>Vytvořit variantu</button>

          <div>Autoři písně</div>
          <Select multi options={this.state.allAuthors} value={this.state.songAuthors} onChange={this.onSongAuthorsChange} />
          <button onClick={this.updateSongAuthors}>Aktualizovat autory písně</button>

          <div>Značení používané v textu písně:</div>
          <ul>
            <li>zacatek sloky: #####</li>
            <li>zacatek refrenu: *****</li>
            <li>opakovani refrenu (R:): ******</li>
            <li>Sloky i refreny se automaticky ukoncuji prichodem dasli sloky/refrenu (nebo opakovanim)</li>
            <li>zacatek mluveneho textu: &gt;</li>
            <li>konec mluveneho textu: &lt;</li>
            <li>akordy: [X] , napr. <code>[G]Skákal pes [C]přes oves</code></li>
            <li>repetice zacatek: |</li>
            <li>repetice konec: ||</li>
            <li>repetice konec s poctem opakovani: ||{2}</li>
          </ul>
        </div>

        <div className="editor">
          <div>Editace písně: {this.state.selectedSong.title}</div>
          <div>Varianty: {this.state.selectedSongVariant.title}</div>
          <textarea
            value={this.state.selectedSongVariant.chords}
            onChange={this.onSongChordsChange}
            className="song-textarea"
            rows={40} />

          <button onClick={this.saveSong}>
            Save song chords
          </button>
        </div>
      </div>
    );
  }
}

export default App
