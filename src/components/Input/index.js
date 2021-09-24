import classNames from "classnames";
import styles from './styles.module.scss';

function Input({className , onChange , placeHolder , name}) {
    return <>
    <input className={classNames(styles.input , className)}
        onChange={onChange}
        placeholder={placeHolder}
        name={name}
        />
    </>
}

export default Input