import styles from './styles.module.scss'
import ReactTooltip from 'react-tooltip'

function Modal({children , show = false}) {
    console.log(show)
    return <div className={show ? styles.main : styles['main-disabled']}>
       {show && <div className={styles['fade-modal']} />}
        <div className={show ? styles.enabled : styles.disabled}>
        {children}
        </div>
    </div>
}

export default Modal