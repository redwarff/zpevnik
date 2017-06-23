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
    selectedSong: { authors: {} },
    selectedSongVariant: {},
    selectedSongVariants: [],
    newSongVariantTitle: '',
    interpret: ''
  }

  componentDidMount = () => {
    this.getAllAuthors()
    this.getAllSongs()
  }

  onSongChordsChange = e => {
    this.setState({
      selectedSongVariant: {...this.state.selectedSong, text: e.target.value}
    })
  }

  onAddSongTitleChange = e => {
    this.setState({
      addSongTitle: e.target.value
    })
  }

  onInterpreterChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, interpreters: value.map(it => it.value) }
    })
  }

  onMusicAuthorChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, authors: { ...this.state.selectedSong.authors, music: value.map(it => it.value) } }
    })
  }

  onLyricsAuthorChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, authors: { ...this.state.selectedSong.authors, lyrics: value.map(it => it.value) } }
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

  createAuthor = e => {
    e.preventDefault();
    api.createAuthor(this.state.addAuthorName, this.state.addAuthorSurname)
      .then(data => {
        this.getAllAuthors()
      })
  }

  createSong = e => {
    e.preventDefault();
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

  saveSong = e => {
    e.preventDefault();
    api.updateSong(this.state.selectedSong.id, this.state.selectedSongVariant.id, this.state.selectedSong.text, this.state.selectedSong.title)
  }

  updateSongAuthors = () => {
    this.state.songAuthors.forEach(author => {
      api.updateSongAuthor(this.state.selectedSong.id, author.value)
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="container">
        <div id="content">
          <div className="row-fluid" style={{ marginTop: '10px' }}>
            username
            <a href="{{ logout_link }}">Logout</a>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <h4>Vytvořit autora</h4>
              <form>
                <div className="form-group">
                  <label for="name">Jméno:</label>
                  <input type="text" className="form-control" id="name" value={this.state.addAuthorName} onChange={this.onAddAuthorNameChange} />
                </div>
                <div className="form-group">
                  <label for="surname">Příjmení (optional):</label>
                  <input type="text" className="form-control" id="surname" value={this.state.addAuthorSurname} onChange={this.onAddAuthorSurnameChange} />
                </div>
                <button type="submit" className="btn btn-default" onClick={this.createAuthor}>Vytvořit autora</button>
              </form>

              <hr />

              <h4>Vytvořit píseň</h4>
              <form>
                <div className="form-group">
                  <label for="name">Jméno:</label>
                  <input type="text" className="form-control" id="name" value={this.state.addSongTitle} onChange={this.onAddSongTitleChange} />
                </div>
                <button className="btn btn-default" onClick={this.createSong}>Vytvořit píseň</button>
              </form>
            </div>

            <div className="col-md-4 col-sm-12">
              <h4>Editace písně</h4>
              <form>
                <div className="form-group">
                  <label for="name">Vybrat píseň:</label>
                  <Select id="name" options={mapSongsToSelect(this.state.allSongs)} value={this.state.selectedSong.id} onChange={this.onSelectedSongChange} />
                </div>
              </form>

              <hr />

              <form>
                <div className="form-group">
                  <label for="name">Jméno písně:</label>
                  <input type="text" className="form-control" id="name" value={this.state.selectedSong.title} />
                </div>

                <div className="form-group">
                  <label for="interpreter">Interpret:</label>
                  <Select className="form-control" id="interpreter" multi options={this.state.allAuthors} value={this.state.selectedSong.interpreters} onChange={this.onInterpretChange} />
                </div>

                <div className="form-group">
                  <label for="text">Píseň:</label>
                  <textarea
                    value={this.state.selectedSong.text}
                    onChange={this.onSongChordsChange}
                    className="form-control"
                    rows={10}
                    id="text" />
                </div>
                
                <div className="form-group">
                  <label for="music">Autor hudby:</label>
                  <Select className="form-control" id="music" multi options={this.state.allAuthors} value={this.state.selectedSong.authors.music} onChange={this.onMusicAuthorChange} />
                </div>

                <div className="form-group">
                  <label for="lyrics">Autor textu:</label>
                  <Select className="form-control" id="lyrics" multi options={this.state.allAuthors} value={this.state.selectedSong.authors.lyrics} onChange={this.onLyricsAuthorChange} />
                </div>

                <button onClick={this.saveSong} className="btn btn-default">Editovat píseň</button>
              </form>
            </div>
            <div className="col-md-4 col-sm-12">
              <h4>Editor návod</h4>
              <p>Editor zatím nepodporuje vše - umí ale přidávat autory a editovat písně. V levo se přidávají jakýkoliv lidé - ať je to autor hudby, autor textu, nebo interpret. V případě, že se jedná například o název kapely, vyplň pouze jméno a příjmení nech prázdné</p>
              <p>Píseň je nejprve třeba vytvořit (vytvoř píseň) a poté se dá vybrat v editoru a editovat. Měnit se může jméno, interpret a hlavně text a akordy samotné. Důležití jsou pro nás i autoři hudby a autoři textu, takže pokud je znáš, určitě nám pomohou.</p>
              <p></p>
              <hr />
              <p>
                Editor využívá značky pro tvorbu písniček. 
                <ul>
                  <li>[C] - akord</li>
                  <li>## - začátek sloky</li>
                  <li>** - začátek refrénu</li>
                  <li>*** - opakování refrénu</li>
                  <li>| - začátek repetice</li>
                  <li>|| - konec repetice</li>
                  <li>||{5} - konec repetice s daným množstvím opakování</li>
                  <li>&gt; - začátek mluveného slova</li>
                  <li>&lt; - konec mluveného slova</li>
                </ul>
              </p>
              <hr />
              <h4>Příklad písně</h4>
              <p>
                <b>##</b><br />
                <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
                který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br />

                <b>**</b><br />
                Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
                někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal.<br />

                <b>##</b><br />
                První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />

                <b>***</b><br />

                <b>></b>Vím, trestat je lidský, ale odpouštět božský.<b></b><br />

                <b>|</b> Opakující se refrén..... <b>||{2}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
      {/*<div className="app">

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
      </div>*/}
  }
}

export default App
