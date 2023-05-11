import LoadingImg from '../assets/loading.png';
import styles from './Loading.module.css'

export default function Loading() {
    return (
        <div>
            <h1>Loading</h1>
            <img 
            alt='loading'
            src={LoadingImg}
            className={styles.loadingImage}
            />
        </div>
    )
};