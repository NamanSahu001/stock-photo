import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
    let url =
      `${mainUrl}?client_id=10L8L-A6FGii93Z_VkkkBxP5ZILOlyNFxnkS7GCkbaQ${urlPage}`

    if (query) {
      url = `${searchUrl}?client_id=10L8L-A6FGii93Z_VkkkBxP5ZILOlyNFxnkS7GCkbaQ${urlPage}${urlQuery}`
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results
        }

        else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data]
        }
      });
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);

    }
  }
  useEffect(() => {
    fetchImages()
  }, [page])

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if (!loading &&
        (window.innerHeight + window.scrollY)
        >= document.body.scrollHeight - 2) {
        setPage((oldPage) => {
          return oldPage + 1;
        })
      }
    });
    return () => window.removeEventListener('scrole', event)
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  }
  return <main>
    <section className="search">
      <form className="search-form">
        <input type='text' placeholder='search'
          className='form-input' value={query}
          onChange={(e) =>
            setQuery(e.target.value)} />
        <button type="submit-btn" className="submit-btn"
          onClick={handleSubmit}>
          <FaSearch />
        </button>
      </form>
    </section>
    <section className='photos'>
      <div className='photos-center'>
        {photos.map((image, index) => {
          return <Photo key={index}{...image} />
        })}
      </div>
      {loading && <h2 className='loading'>Loading...</h2>}
    </section>
  </main>
}

export default App
