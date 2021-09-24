import styles from './styles.module.scss'

function Message({isEnemy , messageInfo}) {
    let person;

    if(isEnemy) {
        person = `${messageInfo.name}:`;
    }
    return <div className={isEnemy ? styles['enemy-message'] : styles.message}>
        <span>{person} {messageInfo.message}</span>
        </div>
}

export default Message