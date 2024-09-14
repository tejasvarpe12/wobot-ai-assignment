import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import Pagination from './components/Pagination';

function App() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [camerasPerPage, setCamerasPerPage] = useState(10);
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedLocation: '',
    selectedStatus: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api-app-staging.wobot.ai/app/v1/fetch/cameras',
          {
            headers: {
              Authorization: 'Bearer 4ApVMIn5sTxeW7GQ5VWeWiy',
            },
          }
        );
        setCameras(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredCameras = useMemo(() => {
    return cameras
      .filter((camera) => camera.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      .filter((camera) => (filters.selectedLocation ? camera.location === filters.selectedLocation : true))
      .filter((camera) => (filters.selectedStatus ? camera.status === filters.selectedStatus : true));
  }, [cameras, filters]);

  const currentCameras = useMemo(() => {
    const indexOfLastCamera = currentPage * camerasPerPage;
    const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
    return filteredCameras.slice(indexOfFirstCamera, indexOfLastCamera);
  }, [filteredCameras, currentPage, camerasPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleStatus = async (cameraId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.post(
        'https://api-app-staging.wobot.ai/app/v1/update/camera/status',
        { id: cameraId, status: newStatus },
        {
          headers: {
            Authorization: 'Bearer 4ApVMIn5sTxeW7GQ5VWeWiy',
            'Content-Type': 'application/json',
          },
        }
      );

      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.id === cameraId ? { ...camera, status: newStatus } : camera
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteCamera = (id) => {
    setCameras(cameras.filter((camera) => camera.id !== id));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (loading) {
    return <p className='loader'>Loading...</p>;
  }

  return (
    <div className="container">
      <h1><span>W</span>obot.ai</h1>
      <header>
        <h2>Cameras</h2>
        <input
          type="text"
          name="searchTerm"
          placeholder="Search cameras..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
        />
      </header>

      <p>Manage Your Cameras here...</p>

      <div className='table-container'>
        <select
          name="selectedLocation"
          className='select-location'
          onChange={handleFilterChange}
        >
          <option value="">Location</option>
          {[...new Set(cameras.map((camera) => camera.location))].map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          name="selectedStatus"
          className='select-status'
          onChange={handleFilterChange}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <table className="camera-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Health</th>
            <th>Location</th>
            <th>Recorder</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCameras.map((camera) => (
            <tr key={camera.id}>
              <td><input type="checkbox" /></td>
              <td><span className='green-dot'></span>{camera.name}</td>
              <td>
                <span className='health'>
                {typeof camera.health === 'object' ? camera.health.device : camera.health || 'N/A'}</span>
              </td>
              <td>{camera.location}</td>
              <td>{camera.recorder || 'N/A'}</td>
              <td>{Array.isArray(camera.tasks) ? `${camera.tasks.length} Tasks` : camera.tasks || 'N/A'} Tasks</td>
              <td>
                <button
                  className={`status-btn ${camera.status.toLowerCase()}`}
                  onClick={() => toggleStatus(camera.id, camera.status)}
                >
                  {camera.status}
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteCamera(camera.id)}>
                  ⛔
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        camerasPerPage={camerasPerPage}
        totalCameras={filteredCameras.length}
        paginate={paginate}
        setCamerasPerPage={setCamerasPerPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default App;
