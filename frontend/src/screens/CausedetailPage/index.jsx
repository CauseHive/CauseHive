import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const CausedetailPage = () => {
    const { id } = useParams();
    const [cause, setCause] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (id) {
            (async () => {
                try {
                    const data = await apiService.getCauseDetails(id);
                    if (mounted) setCause(data);
                } catch (e) {
                    if (mounted) setCause(null);
                }
            })();
        }
        return () => { mounted = false; };
    }, [id]);

    const title = cause?.name || 'Cause Detail';
    const description = cause?.description || 'Rewrite the narrative, save lives and people. Restore balance. Create homes and narratives.';
    const category = cause?.category || 'Category';
    const progressPercent = cause && cause.target_amount > 0
        ? Math.min(100, Math.round((Number(cause.current_amount || 0) / Number(cause.target_amount)) * 100))
        : 0;
    const cover = cause?.cover_image ? `${apiService.baseURL}${cause.cover_image}` : null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>CauseHive.</h1>
                <input type="text" placeholder="Search..." className={styles.searchInput} />
                <span className={styles.cart}>🛒2</span>
            </div>
            <div className={styles.details}>
                <h2>Details</h2>
                <p>{title}</p>
            </div>
            <div className={styles.content}>
                <div className={styles.box}>{cover ? <img src={cover} alt={title} className={styles.causeImage} /> : null}</div>
                <div className={styles.box}></div>
                <div className={styles.box}></div>
            </div>
            <div className={styles.metadata}>
                <p>Created by:</p>
                <p>{cause?.organizer_id || '—'}</p>
                <p>Description:</p>
                <p>{description}</p>
                <p>Category:</p>
                <p>{category?.name || category}</p>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}></div>
                    <span>Progress: {progressPercent}% reached</span>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.donateBtn} onClick={() => window.location.href='/donation'}>Donate</button>
                <button className={styles.cartBtn}>Add to Cart</button>
            </div>
        </div>
    );
}

export default CausedetailPage;
