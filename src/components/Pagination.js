import React from 'react';
import './Pagination.css'; 

const Pagination = ({
  camerasPerPage,
  totalCameras,
  currentPage,
  paginate,
  setCamerasPerPage
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalCameras / camerasPerPage);
  const start = (currentPage - 1) * camerasPerPage + 1;
  const end = Math.min(currentPage * camerasPerPage, totalCameras);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <select
        value={camerasPerPage}
        onChange={(e) => setCamerasPerPage(Number(e.target.value))}
        className="items-per-page"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
      <p className="pagination-info">
        {start}-{end} of {totalCameras}
      </p>
      <div className="pagination-arrows">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="arrow"
        >
          &laquo;
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="arrow"
        >
          &lsaquo;
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="arrow"
        >
          &rsaquo;
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="arrow"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
