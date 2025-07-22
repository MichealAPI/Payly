import styles from './Wrapper.module.css';

const Wrapper = ({ className, children }) => {
    return (
        <div className={`${className} ${styles.wrapper}`}>
            {children}
        </div>
    );
}

export default Wrapper;