import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const CausedetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCauseDetails = async () => {
            try {
                setLoading(true);
                const data = await apiService.getCauseById(id);
                setCause(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchCauseDetails();
        }
    }, [id]);

    if (loading) {
        return <div className={styles.container}><p>Loading cause details...</p></div>;
    }

    if (error) {
        return <div className={styles.container}><p>Error fetching cause details: {error}</p></div>;
    }

    if (!cause) {
        return <div className={styles.container}><p>No cause found.</p></div>;
    }

    const progress = (cause.current_amount / cause.goal_amount) * 100;

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
            <div className={styles.header}>
                <h1>CauseHive.</h1>
                <input type="text" placeholder="Search..." className={styles.searchInput} />
                <Link to="#"><span className={styles.cart}>🛒2</span></Link>
            </div>
            <div className={styles.details}>
                <h2>Details</h2>
                <p>{cause.title}</p>
            </div>
            <div className={styles.content}>
                <div className={styles.box} style={{backgroundImage: `url(${cause.image})`}}></div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
            </div>
            <div className={styles.metadata}>
                <p>Created by:</p>
                <p>{cause.organizer_name}</p>
                <p>Description:</p>
                <p>{cause.description}</p>
                <p>Category:</p>
                <p>{cause.category}</p>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                    <span>Progress: {progress.toFixed(2)}% reached</span>
                </div>
            </div>
            <div className={styles.buttons}>
                <Link to={`/donation/${cause.id}`}>
                    <button className={styles.donateBtn}>Donate</button>
                </Link>
                <button className={styles.cartBtn}>Add to Cart</button>
            </div>
        </div>
    );
}

export default CausedetailPage;
