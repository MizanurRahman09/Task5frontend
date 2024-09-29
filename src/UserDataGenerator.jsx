import React, { useState, useEffect } from 'react';

const UserDataGenerator = () => {
    const [region, setRegion] = useState('USA');
    const [errors, setErrors] = useState(0);
    const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));
    const [page, setPage] = useState(1);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user data from the backend
    const fetchUserData = async () => {
        setLoading(true);
        console.log("Fetching data with:", { region, errors, seed, page });
        try {
            const response = await fetch('https://task5-backend-iota.vercel.app/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ region, errors, seed, page }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            console.log("Received data:", data);

            // If it's the first page, reset the data; else append it
            if (page === 1) {
                setUserData(data); // Reset for new fetch
            } else {
                setUserData(prevData => [...prevData, ...data]); // Append new data
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data on mount or when inputs change
    useEffect(() => {
        fetchUserData();
    }, [region, errors, seed, page]); // Dependencies

    // Infinite scroll event handler
    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
            setPage(prevPage => prevPage + 1); // Load more data
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">User Data Generator</h1>

            <div className="row mb-3">
                <div className="col-md-4">
                    <label className="form-label text-success">Select Region:</label>
                    <select className="form-select" value={region} onChange={e => setRegion(e.target.value)}>
                        <option value="USA">USA</option>
                        <option value="Poland">Poland</option>
                        <option value="Georgia">Georgia</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Number of Errors:</label>
                    <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="10"
                        value={errors}
                        onChange={e => setErrors(e.target.value)}
                    />
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="1000"
                        value={errors}
                        onChange={e => setErrors(Math.min(1000, Math.max(0, e.target.value)))}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Seed Value:</label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            value={seed}
                            onChange={e => setSeed(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" onClick={() => setSeed(Math.floor(Math.random() * 10000))}>
                            Random Seed
                        </button>
                    </div>
                </div>
            </div>

            {/* User Data Table */}
            <div className="overflow-auto" style={{ height: '800px' }} onScroll={handleScroll}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.length > 0 ? (
                            userData.map(user => (
                                <tr key={user.id}>
                                    <td>{user.index}</td>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {loading && <p className="text-center">Loading more data...</p>}
            </div>
        </div>
    );
};

export default UserDataGenerator;
