import styles from './styles.module.scss'

function Loading() {
    return <div className={styles['lds-ripple']}><div></div><div></div></div>
}

export default Loading