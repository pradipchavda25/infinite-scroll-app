import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // State variables to manage items, loading state, current page, error, and selected item.
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Number of items to load per page.
  const ITEMS_PER_PAGE = 10;

  // A ref to keep track of whether the initial data load has completed.
  const initialLoadComplete = useRef(false);

  // Function to fetch data asynchronously.
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate a delay of 1 second.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate new items with unique IDs, names, descriptions, and images.
      const newItems = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
        id: (page - 1) * ITEMS_PER_PAGE + i + 1,
        name: `Item ${(page - 1) * ITEMS_PER_PAGE + i + 1}`,
        description: ` Here is the full description for the item, and you can explore more by clicking on the card No ${
          (page - 1) * ITEMS_PER_PAGE + i + 1
        }`,
        image: `https://via.placeholder.com/150?text=Item${
          (page - 1) * ITEMS_PER_PAGE + i + 1
        }`,
      }));

      // Append new items to the existing items array and update the page.
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "An error occurred while fetching data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle scrolling and trigger data fetching when reaching the end.
  const handleScroll = () => {
    if (
      !loading &&
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100
    ) {
      fetchData();
    }
  };

  // Function to open item modal.
  const openItemDetails = (item) => {
    setSelectedItem(item);
  };

  // Function to close item modal.
  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  // Attach a scroll event listener to the window to handle infinite scrolling.
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // Fetch data on the initial component render.
  useEffect(() => {
    if (!initialLoadComplete.current) {
      fetchData();
      initialLoadComplete.current = true;
    }
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="app-title">React Infinite Scroll App</h1>
        <p>
          Made with &#10084; By{" "}
          <a
            href="https://pradipchavda25.github.io/pradipchavda.github.io/"
            target="_"
          >
            Pradip
          </a>{" "}
        </p>
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <div
              className="card-container"
              key={item.id}
              onClick={() => openItemDetails(item)}
            >
              <img
                className="hero-image"
                src={item.image}
                alt="Spinning glass cube"
              />
              <main className="main-content">
                <h1>
                  <p>
                    <strong>{item.name}</strong>
                  </p>
                </h1>
                <p>{item.description}</p>
              </main>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      )}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeItemDetails}>
          <div className="card-container">
            <span className="close" onClick={closeItemDetails}>
              &times;
            </span>
            <img
              className="modal-image"
              src={selectedItem.image}
              alt="Loading..."
            />
            <main className="main-content">
              <h1>
                <p>{selectedItem.name}</p>
              </h1>
              <p>{selectedItem.description}</p>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
