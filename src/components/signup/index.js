import styles from './styles.module.scss'
import classNames from 'classnames'
import Button from '../Button'
import Input from '../Input'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import enterName from '../../Redux/enterNameAction'
import {nanoid} from 'nanoid'

function SignUp() {
    const dispatch = useDispatch()
   const [formData , setFormData] = useState({
       playerName: null ,
       error: ''
   })
    const handleChange = (e) => {
        setFormData({error: '' , [e.target.name]: e.target.value})
    }
    const setPlayerName = () => {
        if(!formData.playerName || formData.playerName === '') {
            setFormData({...formData , error: 'Please enter a username'})
        } else if (formData.playerName.length > 32) {
            setFormData({...formData , error: 'Username cant be more than 32 carachters'})
        } else {
            dispatch(enterName({name : formData.playerName , id: nanoid(6)}))
            localStorage.setItem('userInfo' , JSON.stringify({name : formData.playerName , id: nanoid(6)}))
        }
    }
    return <div className={classNames(styles.main , 'row p-0 justify-content-center')}>
        <div className={classNames(styles.form , 'col-10 col-lg-4 col-xl-4 col-xxl-4')}>
        <Input name='playerName' onChange={handleChange} placeHolder='Enter your username...' />
        <Button onClick={setPlayerName} className={styles.btn} content='Submit' />
        <span className={styles.errors}>{formData.error}</span>
        </div>
    </div>
}

export default SignUp