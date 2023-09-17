import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppSection } from './App.styled';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from 'api/API';

export const App = () => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');

  const handleSubmit = inputValue => {
    setInputValue(inputValue);
    setItems([]);
    setPage(1);
    setTotalItems(0);
  };

  const hendlerLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleClick = (src, alt) => {
    setShowModal(true);
    setModalImageSrc(src);
    setModalImageAlt(alt);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!inputValue) return;
    setLoading(true);

    fetchImages(inputValue, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          toast.error(`OOOps... no picture requested "${inputValue}"`);
          return;
        } else {
          setItems(prevState => [...prevState, ...hits]);
          setTotalItems(totalHits);
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, [inputValue, page]);

  return (
    <AppSection>
      <Searchbar onFormSubmit={handleSubmit}>
        {error && !loading && (
          <h1>Oooops... Something went wrong. Try reloading the page!</h1>
        )}
      </Searchbar>
      <ImageGallery items={items} clicks={handleClick} />

      {loading && <Loader />}
      {totalItems !== items.length && <Button loadMore={hendlerLoadMore} />}

      {showModal && (
        <Modal
          img={modalImageSrc}
          alt={modalImageAlt}
          onModalClose={closeModal}
        >
          {' '}
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </AppSection>
  );
};
