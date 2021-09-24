import classNames from "classnames";
import styles from './styles.module.scss'

function Button({className , content , onClick , type}) {
    return <>
    <button
     className={classNames(styles.btn , className)}
     onClick={onClick}
     type={type}
     >{content}</button>
    </>
}

export default Button